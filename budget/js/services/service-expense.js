/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.factory('Expense', ['Expenses', '$rootScope', function (Expenses, $rootScope) {
    var service = {};
    service.expenseObj = null;
    service.categories = Expenses.categories;

    service.newExpense = function () {
        service.expenseObj = {};
        service.expenseObjChanged();
    };

    service.edit = function (expense) {
        service.expenseObj = _.clone(Expenses.getById(expense.id));
        service.expenseObjChanged();

    };

    service.save = function (expense) {
        if (expense.hasOwnProperty('id')) {
            Expenses.updateExpense(expense);
        }
        else {
            expense.manuallyAdded = true;
            Expenses.addNewExpense(expense);
        }
    };


    service.expenseObjChanged = function () {
        $rootScope.$broadcast('expense_obj');
    };

    return service;

}]);