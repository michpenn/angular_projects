/**
 * Created by michpenn on 8/15/16.
 */
(function () {
    var app = angular.module('budgetApp', []);

    app.controller('incomeController', ['$scope', 'Salary', 'Expenses', function ($scope, Salary, Expenses) {
        var self = this;
        $scope.title = 'Create a Budget';
        $scope.initialSalary = null;
        $scope.totalCostExpenses = Expenses.totalCostExpenses;
        $scope.afterExpensesIncome = null;
        $scope.expenses = Expenses.expenses;

        $scope.$watch(function () {
                return Salary.salary
            },
            function (salary) {
                $scope.initialSalary = salary;
                self.updateIncome();
            });

        $scope.$on('expenses_changed', function () {
            $scope.expenses = Expenses.expenses;
            $scope.totalCostExpenses = Expenses.totalCostExpenses;
            self.updateIncome();
        });

        self.updateIncome = function () {
            if ($scope.initialSalary != null) {
                $scope.afterExpensesIncome = $scope.initialSalary - $scope.totalCostExpenses;
            }

        };


    }]);
    app.controller('salaryController', ['$scope', 'Taxes', 'Salary', function ($scope, Taxes, Salary) {
        var self = this;
        self.title = 'Salary';
        self.form = {};
        self.initialSalary = null;
        self.filingStatusOptions = Taxes.filingStatusOptions;
        self.filingStatus = null;
        self.stateOptions = Taxes.stateOptions;
        self.state = null;
        self.salaryFormSubmitted = false;
        self.save = function (object) {
            self.salaryFormSubmitted = true;
            Salary.saveSalary(object.initialSalary);
            self.initialSalary = object.initialSalary;
            if (object.filingStatus) {
                Taxes.calculateTaxes(object);
            }
            //console.log('save object:', object);
        };
        self.edit = function (object) {
            Salary.saveSalary(object.initialSalary);
            if (object.filingStatus) {
                Taxes.calculateTaxes(object);
            }
        };


    }]);

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
        /*
         $scope.$on('edit_expense', function(){
         self.showExpenseForm = true;
         }); */


    }]);

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
            console.log('self:', self);
        };


        $scope.$on('expense_obj', function () {
            self.expenseObj = Expense.expenseObj;
        });
    }]);

    app.factory('Expenses', ['$rootScope', function ($rootScope) {
        var service = {};
        service.expenses = [];
        service.categories = ['Living', 'Bills', 'Fun','Taxes', 'Other'];
        service.toEdit = {};
        service.totalCostExpenses = 0;

        service.addNewExpense = function (expense) {
            console.log(expense);
            expense.id = service.getNewId();
            expense.totalCost = service.getTotalCost(expense.cost, expense.frequency);
            service.expenses.push(expense);
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
                Expenses.addNewExpense(expense);
            }
        };


        service.expenseObjChanged = function () {
            $rootScope.$broadcast('expense_obj');
        };

        return service;

    }]);

    app.factory('Salary', function () {
        var service = {};
        service.salary = null;
        service.saveSalary = function (salary) {
            service.salary = salary;
        };

        return service;
    });

    app.factory('Taxes', ['$http', '$q', '$interpolate','Expenses', function ($http, $q, $interpolate, Expenses) {
        var service = {};
        service.filingStatusOptions = [
            {name: 'single', id: 1, parameter: 'single'},
            {name: 'married', id: 2, parameter: 'married'},
            {name: 'married, filing separately', id: 3, parameter: 'married_separately'},
            {name: 'head of household', id: 4, parameter: 'head_of_household'},
            {name: 'none', id: 5, parameter: null}
        ];
        service.pay_periods = 1;
        service.stateOptions = ['CA', 'NY', 'NJ', 'FL'];
        service.calculateTaxes = function (salary_data) {
            console.log('salary data:', salary_data);
            var config = {
                'async': true,
                'crossDomain': true,
                headers: {
                    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUElfS0VZX01BTkFHRVIiLCJodHRwOi8vdGF4ZWUuaW8vdXNlcl9pZCI6IjU3ZDM5MjU3Y2RiYjc1MmM5OTkyNDVmOSIsImh0dHA6Ly90YXhlZS5pby9zY29wZXMiOlsiYXBpIl0sImlhdCI6MTQ3MzQ4MzM1MX0.NTja_sCVYtIGsmmeO8IJSs6lAr8pGLmfn3yf9ih9uI0",
                    'content-type': 'application/x-www-form-urlencoded'

                }
            };
            var data = {
                'filing_status': salary_data.filingStatus,
                'pay_periods': 1,
                'pay_rate': salary_data.initialSalary,
                'state': salary_data.state
            };

            var dataFunc = $interpolate('state={{salary_data.state}}&filing_status={{salary_data.filingStatus}}&pay_periods=1&pay_rate={{salary_data.initialSalary}}');
            var url_encoded_string = dataFunc({salary_data:salary_data});



            $http.post('https://taxee.io/api/v2/calculate/2016', url_encoded_string,config)
                .then(function (res) {
                    var taxes = res.data.annual;
                    for(var taxType in taxes) {
                        var obj ={};
                        obj.category = 'Taxes';
                        obj.name = taxType;
                        obj.frequency = 1;
                        obj.cost = taxes[taxType]['amount'];
                        Expenses.addNewExpense(obj);

                    }
                });

        };
        return service;

    }]);

    app.directive('budgetSheet', function () {
        return {
            restrict: 'E',
            templateUrl: 'budget-sheet.html'
        }
    });

    app.directive('salaryForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'salary-form.html'
        }
    });

    app.directive('expensesTable', function () {
        return {
            restrict: 'E',
            templateUrl: 'expenses-table.html',
            controller: 'expensesController',
            require: 'expensesTable',
            link: linkFn
        };
        function linkFn($scope, element, attr, controller) {

        }
    });

    app.directive('expenseForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'expense-form.html',
            controller: 'expenseController',
            require: 'expenseForm',
            //controllerAs: 'expenses',
            link: linkFn
        };
        function linkFn($scope, element, attr, controller) {

        }
    });
    app.directive('appTitle', function () {
        return {
            restrict: 'E',
            templateUrl: 'app-title.html'
        }
    });
    app.directive('addExpense', function () {
        return {
            restrict: 'E',
            templateUrl: 'add-expense.html'
        }
    });
    app.directive('expensesSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'expenses-section.html'
        }
    });


})();