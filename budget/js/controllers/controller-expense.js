/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.controller('expenseController', ['$scope', 'Expense', 'Expenses', function ($scope, Expense, Expenses) {
    var self = this;
    self.title = 'Expense Form';
    self.categories = Expense.categories;
    self.expenseObj = Expense.expenseObj;


    self.save = function (expense) {
        Expense.save(expense);
    };

    self.edit = function () {
        Expense.edit();

    };


    $scope.$on('expense_obj', function () {
        self.expenseObj = Expense.expenseObj;
    });
}]);