/**
 * Created by michpenn on 8/6/16.
 */
var app = angular.module('budgetApp', ['ngRoute']);

app.factory('Income', function ($http) {
    var service = {};
    service.title = 'Income Info';
    service.salary = null;
    service.save = function (salary) {
        service.salary = salary.amount;
    };
    return service;
});

app.config(['$routeProvider', function ($routeProvider) {
}]);

app.factory('Taxes',['Expenses','$http', '$q',function (Expenses,$http, $q) {
    var service = {};
    service.stateOptions = [{"id": 1, "name": "California"}, {"id": 2, "name": "New York"}, {"id":3, "name": "Other"}];
    service.incomeTaxes = null;
    service.calculateIncomeTax = function (salaryObject) {
        var deferred = $q.defer();
        var taxes = null;
        if(salaryObject.hasOwnProperty('state')){
            switch(parseInt(salaryObject['state'])){
                case 1:
                    taxes = california_income(salaryObject['salary'], 'single');
                    break;
                default:
                    console.log('state to format:', salaryObject['state']);
                    break;
            }
        }
        else {
            console.log('make an empty expense object');
        }
        deferred.resolve(taxes);
        return deferred.promise;
    };
    service.addTaxesToExpenses = function(taxes){
        var deferred = $q.defer();
        deferred.resolve(Expenses.addTaxes(taxes));
        return deferred.promise;
    };
    service.handleSalaryForm = function(salaryObject){
        var promise = service.calculateIncomeTax(salaryObject)
            .then(function(taxes){
                return service.addTaxesToExpenses(taxes);
            });
        promise.then(function(expenses){
            return expenses});
        return promise;


    };


    return service;
}]);

app.factory('Expenses',['$http', '$q', function ($http, $q) {
    var service = {};
    service.title = 'Expenses';
    service.expenses = [];
    service.save = function (expense) {
        if (expense.hasOwnProperty('id')) {
            expense.totalCost = expense.cost * expense.frequency;
            var toUpdate = service.getById(expense.id);
            if (expense.id == toUpdate.id) {
                _.extend(toUpdate, expense);
            }
        }
        else {
            if (service.expenses.length == 0) {
                service.expenses.push(new Expense(1, expense.category, expense.name, expense.cost, expense.frequency));
            }
            else {
                var id = _.max(service.expenses, function (expense) {
                    return expense.id
                });
                service.expenses.push(new Expense(id.id + 1, expense.category, expense.name, expense.cost, expense.frequency));
            }
        }


    };
    service.delete = function (id) {
        service.expenses = _.reject(service.expenses, function (expense) {
            return expense.id == id;
        })
    };

    service.addTaxes = function(taxes){
        console.log('Expenses add Taxes called');
        var deferred = $q.defer();
        for(var i=0; i< taxes.length; i++) {
            var id;
            if(service.expenses.length === 0){
                id = 1;
            }
            else {
                id =  _.max(service.expenses, function (expense) {
                    return expense.id
                });
                id = id.id + 1;
            }
            var name = taxes[i].name + ' - ' + taxes[i].rate;
            service.expenses.push(new Expense(id, 'Taxes', name, taxes[i].totalInTaxes, 1));
        }
        deferred.resolve(service.expenses);
        return deferred.promise;
    };

    service.getById = function (id) {
        return _.find(service.expenses, function (expense) {
            return expense.id == id
        });
    };

    service.calculateTotalExpenses = function () {
        return _.reduce(service.expenses, function (memo, num) {
            return memo + num.totalCost;
        }, 0);
    };

    return service;
}]);
app.factory('Budget', function ($http) {
    var service = {};
    service.title = 'Budget';
    return service;
});


app.directive('salaryTitle', function(){
    return {
        restrict: 'E',
        templateUrl: 'views/salary-title.html'
    };
});

app.controller('BudgetController', ['$scope', '$routeParams', '$q', 'Income', 'Taxes', 'Expenses', 'Budget',
    function ($scope, $routeParams, $q, Income, Taxes, Expenses, Budget) {
        if ($routeParams) {
            console.log('route params: ', $routeParams);
        }
        $scope.title = 'Budget Calculator';
        $scope.incomeTitle = Income.title;
        $scope.budgetTitle = Budget.title;
        $scope.stateOptions = Taxes.stateOptions;
        $scope.showExpenseDiv = false;
        $scope.inputSalary = 0;
        $scope.taxes = null;
        $scope.showExpenseForm = false;
        $scope.expenses = Expenses.expenses;
        $scope.salary = null;
        $scope.totalExpenses = 0;
        $scope.afterExpenses = null;
        $scope.salaryFormObj = null;
        $scope.showAddExpenseButton = true;
        $scope.showAddExpenseForm = false;


        $scope.saveForm = function (form_name, form_data) {
            switch (form_name) {
                case 'salaryForm':
                    $scope.salary = form_data.salary;
                    $scope.updateIncome();
                    var promise = Taxes.handleSalaryForm(form_data)
                        .then(function(expenses){
                            if(expenses.length > 0) {
                                console.log('expenses 3: ', expenses);
                                $scope.expenses = expenses;
                                $scope.showExpenseDiv = true;
                                $scope.totalExpenses = Expenses.calculateTotalExpenses();
                            }
                        });
                    promise.then(function(){
                        $scope.updateIncome();
                    });
                    break;
                default:
                    console.log('form name:', form_name, 'form data:', form_data);
                    break;
            }

        };

       $scope.editExpense= function(expense){
           $scope.editExpense = _.clone(Expenses.getById(expense.id));
           $('#editModal').modal('show');
       };

        $scope.saveExpense = function (expense) {
            console.log('expense to save: ', expense);
            Expenses.save(expense);
            $scope.updateExpenses();

        };

        $scope.updateIncome = function () {
            $scope.totalExpenses = Expenses.calculateTotalExpenses();
            $scope.afterExpenses = $scope.salary - $scope.totalExpenses;
        };

        $scope.updateExpenses = function () {
            $scope.$watch(function () {
                return Expenses.expenses;
            }, function (expenses) {
                console.log('expenses 2:', expenses);
                $('#editModal').modal('hide');
                $scope.showAddExpenseButton = true;
                $scope.showAddExpenseForm = false;
                $scope.expenses = expenses;
                $scope.showExpenseForm = false;
                $scope.totalExpenses = Expenses.calculateTotalExpenses();
                $scope.updateIncome();

            });

        };

        $scope.deleteExpense = function (id) {
            Expenses.delete(id);
            $scope.updateExpenses();

        };

        $scope.addNewExpense = function () {
            $scope.showAddExpenseButton = false;
            $scope.showAddExpenseForm = true;
            $scope.newExpense = {};
        };
    }]);


var Expense = function (id, category, name, cost, frequency) {
    return {
        id: id,
        category: category,
        name: name,
        cost: cost,
        frequency: frequency,
        totalCost: (cost * frequency)
    }
};
