"""
Owner:
    "Manoj Kumar Reddy"
Author:
    "Manoj Kumar Reddy"
Functionality:
    - creates url patters for the expenses app
"""

from django.urls import path
from expenses import views

urlpatterns = [
    path('expense-details', view=views.ExpenseDetails().as_view()),
]