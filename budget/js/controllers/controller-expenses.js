/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.controller('expensesController', ['$scope', 'Expenses', 'Expense', function ($scope, Expenses, Expense) {
    var self = this;
    self.title = 'Expenses';
    self.expenses = Expenses.expenses;
    self.showExpenseForm = false;


    self.addNewExpense = function () {
        self.addOrEdit('add');

    };
    self.cancel = function () {
        self.showExpenseForm = false;
    };


    self.delete = function (id) {
        Expenses.delete(id);
    };

    self.edit = function (expense) {
        self.addOrEdit('edit', expense);

    };

    self.addOrEdit = function (addOrEdit, expense) {
        if (addOrEdit == 'add') {
            Expense.newExpense();
        }
        else if (addOrEdit == 'edit') {
            Expense.edit(expense);
        }

    };

    $scope.$on('expense_obj', function () {
        self.showExpenseForm = true;
    });

    $scope.$on('expenses_changed', function () {
        self.expenses = Expenses.expenses;
        self.showExpenseForm = false;
    });


}]);