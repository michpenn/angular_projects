/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.factory('Expenses', ['$rootScope', function ($rootScope) {
    var service = {};
    service.expenses = [];
    service.categories = ['Living', 'Bills', 'Fun','Taxes', 'Other'];
    service.toEdit = {};
    service.totalCostExpenses = 0;

    service.addNewExpense = function (expense) {


        expense.id = service.getNewId();
        expense.totalCost = service.getTotalCost(expense.cost, expense.frequency);

        if(expense.category == 'Taxes') {
            var index = _.findLastIndex(service.expenses, {'category': 'Taxes'});
            if(index == -1) {
                service.expenses.push(expense);
            }
            else {
                service.expenses.splice(index+1,0, expense);
            }
        }
        else {
            service.expenses.push(expense);
        }

        service.getExpenses();
    };
    service.updateExpense = function (expense) {
        expense.totalCost = expense.cost * expense.frequency;
        var toUpdate = service.getById(expense.id);
        if (expense.id = toUpdate.id) {
            _.extend(toUpdate, expense);
            service.getExpenses();
        }

    };
    service.findExpenseId = function(category,name) {

        var expenseObj = _.find(service.expenses, function(expense) {
            return((expense.category == category) && (expense.name == name));
        });

        return (expenseObj? expenseObj.id : false);
    };

    service.getNewId = function () {
        if (service.expenses.length > 0) {
            var id = _.max(service.expenses, function (expense) {
                return expense.id;
            });
            return id.id + 1;
        }
        else {
            return 1;
        }
    };


    service.delete = function (id) {
        service.expenses = _.reject(service.expenses, function (expense) {
            return expense.id == id;
        });
        service.getExpenses();
    };

    service.getById = function (id) {
        return _.find(service.expenses, function (expense) {
            return expense.id === id;
        })
    };

    service.getTotalCost = function (cost, frequency) {
        return cost * frequency;
    };

    service.sumTotalExpenses = function () {
        if (service.expenses.length === 0) {
            return 0;
        }
        else {
            return _.reduce(service.expenses, function (memo, num) {
                return memo + num.totalCost;
            }, 0);

        }

    };

    service.getExpenses = function () {
        service.totalCostExpenses = service.sumTotalExpenses();
        $rootScope.$broadcast('expenses_changed');
    };
    return service;

}]);
