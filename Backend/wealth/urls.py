"""
- URL's for wealth app
"""
from django.urls import path

from wealth import views

urlpatterns = [
    path('update_latest_nav/', views.UpdateNAV.as_view()),
    path('update_latest_stock_price/', views.UpdateStockPrice.as_view()),
    path("update_transactions/", views.UpdateTransactions().as_view()),
    path('get_investment_conf/', views.InvestmentConfigurations().as_view()),
    path('update_investment_conf/', views.CreateOrUpdateConfiguration().as_view()),
]
