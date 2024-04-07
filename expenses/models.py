"""
Owner:
    Manoj Kumar Reddy
Author:
    Manoj Kumar Reddy
Functionality:
    - All the database models(tables) will be connected via models.py
"""

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Categories(models.Model):
    """
    This model holds categories of the expenses we want to track
    """
    cat_id = models.AutoField(primary_key=True, db_column='cat_id')
    cat_name = models.CharField(max_length=64, null=False, blank=False)
    cat_description = models.CharField(max_length=256, null=True, blank=True)
    creation_time = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'conf_categories'


class SubCategories(models.Model):
    """
    - This model holds sub category of the expenses we want to track
    - This model will connect to Categories model
    """
    sub_cat_id = models.AutoField(primary_key=True, db_column='sub_cat_id')
    category = models.ForeignKey(
        Categories, on_delete=models.CASCADE,
        blank=False, null=False, db_column='category')
    sub_cat_name = models.CharField(max_length=64, null=False, blank=False)
    sub_cat_description = models.CharField(max_length=256, null=True, blank=True)
    creation_time = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'conf_sub_categories'


class Account(models.Model):
    """
    - This model holds type of accounts we will use for expenses
    """
    class AccountType(models.TextChoices):
        "Enumeration for account type"
        CREDIT = "Credit"
        SAVINGS = "Savings"

    account_id = models.AutoField(primary_key=True, db_column='acc_id')
    acc_name = models.CharField(max_length=16, null=False, blank=False)
    acc_type = models.CharField(max_length=16, choices=AccountType.choices, default=AccountType.SAVINGS)
    acc_description = models.CharField(max_length=256, null=True, blank=True)
    creation_time = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'conf_account'



class Groups(models.Model):
    """
    - This model holds groups that user is added in.
    """
    group_id = models.AutoField(primary_key=True, db_column='group_id')
    group_name = models.CharField(max_length=16, null=False, blank=False)
    group_description = models.CharField(max_length=256, null=True, blank=True)
    creation_time = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'conf_group'


class GroupMembers(models.Model):
    """
    - This model contains users and group mapping information.
    """
    group_user_id = models.AutoField(primary_key=True, db_column='group_user_id')
    group = models.ForeignKey(
        Groups, on_delete=models.CASCADE,
        null=False, blank=False, db_column='group')
    member = models.ForeignKey(
        User, on_delete=models.CASCADE,
        blank=False, null=False, db_column='member')

    class Meta:
        "Meta section of model"
        db_table = 'conf_group_members'


class GroupExpenses(models.Model):
    """
    - This model holds type of accounts we will use for expenses
    """
    group_exp_id = models.AutoField(primary_key=True, db_column='gp_exp_id')
    group_expense_desc = models.CharField(max_length=256, null=False, blank=False)
    category = models.ForeignKey(
        Categories, on_delete=models.CASCADE,
        null=False, blank=False, db_column='category')
    sub_category = models.ForeignKey(
        SubCategories, on_delete=models.CASCADE,
        null=True, blank=True, db_column='sub_category')
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE,
        null=False, blank=False, db_column='account')
    expense_amount = models.FloatField(null=False, blank=False)
    number_of_users = models.IntegerField(blank=False, null=False)
    amount_per_user = models.FloatField(null=False, blank=False)
    created_on = models.DateTimeField(auto_now=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'group_expenses'


class GroupExpenseUsers(models.Model):
    """
    - This model holds type of accounts we will use for expenses
    """
    group_expense_user_id = models.AutoField(primary_key=True, db_column='gp_exp_user_id')
    group_exp = models.ForeignKey(
        GroupExpenses, on_delete=models.CASCADE,
        null=False, blank=False, db_column='group_exp')
    group_exp_user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        null=False, blank=False, db_column='group_exp_user')

    class Meta:
        "Meta section of model"
        db_table = 'group_expense_users'


class Expenses(models.Model):
    """
    - This model will hold all expenses we have made
    """
    class ExpenseType(models.TextChoices):
        "Expense type choices"
        SINGLE = "Single"
        GROUP = "Group"

    expense_id = models.AutoField(primary_key=True, db_column='exp_id')
    expense_desc = models.CharField(max_length=16, null=False, blank=False, db_column='exp_desc')
    category = models.ForeignKey(
        Categories, on_delete=models.CASCADE,
        null=False, blank=False, db_column='category')
    sub_category = models.ForeignKey(
        SubCategories, on_delete=models.CASCADE,
        null=True, blank=True, db_column='sub_category')
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE,
        null=False, blank=False, db_column='account')
    expense_type = models.CharField(
        max_length=8, choices=ExpenseType.choices,
        default=ExpenseType.SINGLE)
    group_expense = models.ForeignKey(
        GroupExpenses, on_delete=models.CASCADE,
        null=False, blank=False, db_column='group_expense')
    amount = models.FloatField(null=False, blank=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE,
        null=False, blank=False, db_column='user')
    created_on = models.DateTimeField(auto_now=True)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        "Meta section of model"
        db_table = 'expenses'
