"""
- Models for wealth app
"""
from django.db import models


class IvAccount(models.Model):
    """
    - Account details model
    """
    acc_id = models.AutoField(primary_key=True)
    acc_name = models.CharField()

    class Meta:
        """
        - Meta class for Account model
        """
        managed = False
        db_table = 'iv_account'


class IvConfGoal(models.Model):
    """
    - Financial Goals models
    """
    goal_id = models.AutoField(primary_key=True)
    goal_name = models.CharField()

    class Meta:
        """
        - Meta model for financial goals
        """
        managed = False
        db_table = 'iv_conf_goal'


class IvConfSource(models.Model):
    """
    - Source of investment
    """
    source_id = models.AutoField(primary_key=True)
    source_name = models.CharField()

    class Meta:
        """
        - Meta model for source of investment
        """
        managed = False
        db_table = 'iv_conf_source'


class IvConfMf(models.Model):
    """
    - Mutual funds configurations
    """
    conf_id = models.AutoField(primary_key=True)
    fund_name = models.CharField()
    fund_code = models.CharField(blank=True, null=True)
    exchange = models.CharField(blank=True, null=True)
    category = models.CharField(blank=True, null=True)
    sub_category = models.CharField(blank=True, null=True)
    market_cap = models.CharField(blank=True, null=True)
    sector = models.CharField(blank=True, null=True)
    curr_val = models.FloatField(blank=True, null=True)
    lock_in = models.FloatField(blank=True, null=True)
    goal = models.ForeignKey(IvConfGoal, models.DO_NOTHING, blank=True, null=True, related_name="mf_conf_goal")
    source = models.ForeignKey(IvConfSource, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        "Meta model for mutual fund configurations"
        managed = False
        db_table = 'iv_conf_mf'


class IvConfNps(models.Model):
    """
    - NPS configurations
    """
    conf_id = models.AutoField(primary_key=True)

    class Meta:
        "Meta model for nps configurations"
        managed = False
        db_table = 'iv_conf_nps'


class IvConfPf(models.Model):
    """
    - PF configurations model
    """
    conf_id = models.AutoField(primary_key=True)
    pf_type = models.CharField()
    lock_in = models.FloatField(blank=True, null=True)

    class Meta:
        "Meta model for ps conf"
        managed = False
        db_table = 'iv_conf_pf'


class IvConfStock(models.Model):
    """
    - Configurations for Stock investment
    """
    conf_id = models.AutoField(primary_key=True)
    stock_name = models.CharField()
    stock_code = models.CharField()
    exchange = models.CharField(blank=True, null=True)
    market_cap = models.CharField(blank=True, null=True)
    sector = models.CharField(blank=True, null=True)
    ipo = models.BooleanField(blank=True, null=True)
    curr_val = models.FloatField(blank=True, null=True)
    lock_in = models.FloatField(blank=True, null=True)
    goal = models.ForeignKey(IvConfGoal, models.DO_NOTHING, blank=True, null=True)
    source = models.ForeignKey(IvConfSource, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        "Meta model for stock investment"
        managed = False
        db_table = 'iv_conf_stock'


class IvTxnMf(models.Model):
    """
    - Mutual fund transactions recorded in this model
    """
    txn_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(IvAccount, models.DO_NOTHING, blank=True, null=True)
    record_date = models.DateField()
    invested_amount = models.FloatField(blank=True, null=True)
    units = models.FloatField(blank=True, null=True)
    nav = models.FloatField(blank=True, null=True)
    fund = models.ForeignKey(IvConfMf, models.DO_NOTHING, blank=True, null=True, related_name="fund_conf")

    class Meta:
        "Meta model for Mutual fund transactions"
        managed = False
        db_table = 'iv_txn_mf'


class IvTxnStock(models.Model):
    """
    - Stock investing transactions
    """
    txn_id = models.AutoField(primary_key=True)
    account = models.ForeignKey(IvAccount, models.DO_NOTHING, blank=True, null=True)
    record_date = models.DateField()
    invested_amount = models.FloatField(blank=True, null=True)
    quantity = models.FloatField(blank=True, null=True)
    avg_price = models.FloatField(blank=True, null=True)
    stock = models.ForeignKey(IvConfStock, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        "Meta model for Stock transaction"
        managed = False
        db_table = 'iv_txn_stock'


class IvTxnCombined(models.Model):
    """
    - Combined transactions of all investment
    TODO: add foreign keys for each transaction id
    """
    txn_id = models.AutoField(primary_key=True)
    record_date = models.DateField()
    invested_amount = models.FloatField(blank=True, null=True)
    current_amount = models.FloatField(blank=True, null=True)
    pnl = models.FloatField(blank=True, null=True)
    pnl_percent = models.FloatField(blank=True, null=True)
    no_of_days = models.IntegerField(blank=True, null=True)
    free_units = models.BooleanField(blank=True, null=True)
    mf_txn = models.ForeignKey(IvTxnMf, on_delete=models.CASCADE, blank=True, null=True, related_name="mf_txn")
    stock_txn = models.ForeignKey(IvTxnStock, on_delete=models.CASCADE, blank=True, null=True, related_name="stock_txn")
    source = models.ForeignKey(IvConfSource, models.CASCADE, blank=True, null=True, related_name="invest_source")
    account = models.ForeignKey(IvAccount, models.CASCADE, blank=True, null=True, related_name="account")

    class Meta:
        """
        - Meta model for merged transactions
        """
        managed = False
        db_table = 'iv_txn_combined'
