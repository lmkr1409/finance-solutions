"""
- Business logic for Wealth app
"""
import logging
from datetime import date

import requests
from bs4 import BeautifulSoup
from django.db import transaction
from django.db.models import F
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from wealth.models import (IvConfMf, IvConfSource, IvConfStock, IvTxnCombined,
                           IvTxnMf, IvTxnStock)

# Create your views here.
logger = logging.getLogger()


def fetch_latest_value_from_google_finance(ticker:str, exchange:str) -> float:
    """
    - Fetches latest value for given ticker from google finance using web scraping
    """
    url = f"https://www.google.com/finance/quote/{ticker}:{exchange}"
    response = requests.get(url, timeout=5)
    soup = BeautifulSoup(response.text, 'html.parser')
    target_class = "YMlKec fxKbKc"
    price = float(soup.find(class_=target_class).text.strip()[1:].replace(",", ""))
    return price

class UpdateNAV(APIView):
    """
    - Fetches latest NAV for mutual funds and update in conf table
    """
    def post(self, request):
        """
        - Updates latest NAV for each mutual fund
        """
        req_data = request.data
        fund_names = req_data['fund_names']
        logger.info("")
        if fund_names == "__all__":
            mf_obj = IvConfMf.objects.all()
        else:
            mf_obj = IvConfMf.objects.filter(fund_name__in = fund_names)
        for this_mf_obj in mf_obj:
            print(this_mf_obj.fund_name)
            logger.info("Checking for fund: %s", this_mf_obj.fund_name)
            nav = fetch_latest_value_from_google_finance(this_mf_obj.fund_code, this_mf_obj.exchange)
            this_mf_obj.curr_val = nav
            this_mf_obj.save()
        return Response({"status": "success", "msg":"NAV updated successfully"})


class UpdateStockPrice(APIView):
    """
    - Fetches latest stock price and updates in stock conf  table
    """
    def post(self, request):
        """
        - Updates latest NAV for each mutual fund
        """
        req_data = request.data
        stock_list = req_data['stocks_list']
        if stock_list == "__all__":
            stock_obj = IvConfStock.objects.all()
        else:
            stock_obj = IvConfStock.objects.filter(stock_name__in=stock_list)
        for this_stock_obj in stock_obj:
            nav = fetch_latest_value_from_google_finance(this_stock_obj.stock_code, this_stock_obj.exchange)
            this_stock_obj.curr_val = nav
            this_stock_obj.save()
        return Response({"status": "success", "msg":"NAV updated successfully"})


class UpdateTransactions(APIView):
    """
    - Updates all transactions with latest values and adjusts the pnl and other details
    """
    def post(self, request):
        """
        Calculates updated pnl with latest values
        """
        req_body = request.data
        invest_source = req_body['invest_source']
        if invest_source == "MutualFunds":
            def calculate_values(record:dict[str, float]) -> dict:
                """
                - Calculates the pnl values
                """
                current_amount = record['mf_txn__units'] * record['mf_txn__fund__curr_val']
                pnl = current_amount - record['mf_txn__invested_amount']
                pnl_percent = (pnl/record['mf_txn__invested_amount'])*100
                no_of_days = date.today() - record['mf_txn__record_date']
                no_of_days = no_of_days.days
                free_units = bool(no_of_days > record['mf_txn__fund__lock_in'])
                return {
                    "txn_id": record['txn_id'],
                    "invested_amount": record['mf_txn__invested_amount'],
                    "current_amount": current_amount,
                    "pnl":pnl,
                    "pnl_percent":pnl_percent,
                    "no_of_days":no_of_days,
                    "free_units":free_units,
                    "account": record['mf_txn__account']
                }

            logger.info("Updating all Mutual Funds pnl with latest values")
            source_obj = IvConfSource.objects.get(source_name=invest_source)
            # Step1: add missing transactions to combined transactions
            combined_txn = IvTxnCombined.objects.filter(source=source_obj).values_list('mf_txn_id', flat=True)
            mf_txn = IvTxnMf.objects.exclude(txn_id__in= combined_txn)
            with transaction.atomic():
                for this_mf_txn in mf_txn:
                    IvTxnCombined.objects.create(
                        source = source_obj,
                        record_date = this_mf_txn.record_date,
                        mf_txn = this_mf_txn,
                        invested_amount = this_mf_txn.invested_amount
                    )
                # Step2: Update all transactions
                mf_records = IvTxnCombined.objects.filter(source=source_obj).values(
                    "txn_id", "mf_txn__record_date", "mf_txn__invested_amount", "mf_txn__units",
                    "mf_txn__fund__curr_val", "mf_txn__fund__lock_in", "mf_txn__account"
                )
                for this_mf_record in mf_records:
                    IvTxnCombined.objects.filter(txn_id = this_mf_record['txn_id']).update(
                        **calculate_values(this_mf_record)
                    )

        elif invest_source == "Stocks":
            def calculate_values(record:dict[str, float]) -> dict:
                """
                - Calculates the pnl values
                """
                current_amount = record['stock_txn__quantity'] * record['stock_txn__stock__curr_val']
                pnl = current_amount - record['stock_txn__invested_amount']
                pnl_percent = (pnl/record['stock_txn__invested_amount'])*100
                no_of_days = date.today() - record['stock_txn__record_date']
                no_of_days = no_of_days.days
                free_units = True if no_of_days > record['stock_txn__stock__lock_in'] else False
                return {
                    "txn_id": record['txn_id'],
                    "invested_amount": record['stock_txn__invested_amount'],
                    "current_amount": current_amount,
                    "pnl":pnl,
                    "pnl_percent":pnl_percent,
                    "no_of_days":no_of_days,
                    "free_units":free_units,
                    "account":record['stock_txn__account']
                }

            logger.info("Updating all Stock pnl with latest values")
            source_obj = IvConfSource.objects.get(source_name=invest_source)
            # Step1: add missing transactions to combined transactions
            combined_txn = IvTxnCombined.objects.filter(source=source_obj).values_list('stock_txn_id', flat=True)
            stock_txn = IvTxnStock.objects.exclude(txn_id__in= combined_txn)
            with transaction.atomic():
                for this_stock_txn in stock_txn:
                    IvTxnCombined.objects.create(
                        source = source_obj,
                        record_date = this_stock_txn.record_date,
                        stock_txn = this_stock_txn,
                        invested_amount = this_stock_txn.invested_amount
                    )
                # Step2: Update all transactions
                stock_records = IvTxnCombined.objects.filter(source=source_obj).values(
                    "txn_id", "stock_txn__record_date", "stock_txn__invested_amount", "stock_txn__quantity",
                    "stock_txn__stock__curr_val", "stock_txn__stock__lock_in", "stock_txn__account"
                )
                for this_stock_record in stock_records:
                    IvTxnCombined.objects.filter(txn_id = this_stock_record['txn_id']).update(
                        **calculate_values(this_stock_record)
                    )
        return Response({"status":"success", "msg":"DataGenerated"})


class InvestmentConfigurations(APIView):
    """
    - Returns MF configuration
    """
    def get(self, request):
        """
        GET for MF Configurations
        """
        query_params = request.query_params
        final_response = {}
        invest_source = query_params['investment_source']
        if invest_source == "MutualFunds":
            mf_conf = IvConfMf.objects.all().annotate(
                goal_name=F("goal__goal_name")
                ).values(
                "conf_id", "fund_name", "fund_code", "exchange", "category", "sub_category",
                "market_cap", "sector", "curr_val", "lock_in", "goal_name"
            )
            final_response['mf_conf_data'] = mf_conf
        elif invest_source == "Stocks":
            stocks_conf = IvConfStock.objects.all().annotate(
                goal_name = F("goal__goal_name")
            ).values(
                "conf_id", "stock_name", "stock_code", "exchange", "market_cap", "sector",
                "ipo", "curr_val", "locked_in", "goal_name"
            )
            final_response['stock_conf_data'] = stocks_conf
        return Response(final_response)


class CreateOrUpdateConfiguration(APIView):
    """
    - Creates or updates a configuration detail
    """
    def post(self, request):
        """
        - POST request
        """
        req_data = request.data
        if req_data['investment_source'] == "MutualFunds":
            this_conf = req_data['mf_conf']
            IvConfMf.objects.update_or_create(**this_conf)
        elif req_data['investment_source'] == "Stocks":
            this_conf = req_data['stock_conf']
            IvConfStock.objects.update_or_create(**this_conf)
        return Response({"status":"success", "msg":"Data Updated successfully"}, status=status.HTTP_201_CREATED)
