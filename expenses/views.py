"""
Owner:
    "Manoj Kumar Reddy"
Author:
    "Manoj Kumar Reddy"
Functionality:
    - creates views for the expenses app
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class ExpenseDetails(APIView):
    """
    List down all the expenses that user is part of
    """
    def get(self, request):
        "GET request for Expense details app"
        return Response({"status":"ok"}, status=status.HTTP_200_OK)
