/**
 * Created by michpenn on 8/15/16.
 */
(function(){
    var app = angular.module('budgetApp', []);
app.config(['$httpProvider',function($httpProvider){
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);

    app.controller('incomeController', ['$scope', 'Salary',function($scope, Salary){
        var self = this;
        $scope.title = 'Create a Budget';
        $scope.initialSalary = null;
        $scope.totalCostExpenses = 0;
        $scope.afterExpensesIncome = null;

        $scope.$watch(function(){return Salary.salary},
            function(salary){
            $scope.initialSalary = salary;
                self.updateIncome();
        });

        self.updateIncome = function(){
            if($scope.initialSalary != null) {
                $scope.afterExpensesIncome = $scope.initialSalary - $scope.totalCostExpenses;
            }

        };


    }]);
    app.controller('salaryController', ['$scope', 'Taxes', 'Salary', function($scope, Taxes, Salary){
        var self = this;
        self.title = 'Salary';
        self.form = {};
        self.initialSalary = null;
        self.filingStatusOptions = Taxes.filingStatusOptions;
        self.filingStatus = null;
        self.stateOptions = Taxes.stateOptions;
        self.state = null;
        self.salaryFormSubmitted = false;
        self.save = function(object){
            self.salaryFormSubmitted = true;
            Salary.saveSalary(object.initialSalary);
            self.initialSalary = object.initialSalary;
            if(object.filingStatus){
               Taxes.calculateTaxes(object);
            }
            //console.log('save object:', object);
        };
        self.edit = function(object){
            Salary.saveSalary(object.initialSalary);
            if(object.filingStatus){
                Taxes.calculateTaxes(object);
            }
        };



    }]);

    app.controller('expensesController', ['$scope','Expenses',function($scope, Expenses){
        var self = this;
        self.title = 'Expenses';
        self.expenses = Expenses.expenses;
        self.showExpenseForm = false;


        self.addNewExpense = function(){
            self.showExpenseForm = true;
        };
        self.cancel = function(){
            self.showExpenseForm = false;
        };
        $scope.$on('expenses_changed', function(){
            self.expenses = Expenses.expenses;
            self.showExpenseForm = false;
        });







    }]);

    app.controller('expenseController', ['$scope', 'Expense', function($scope, Expense){
        var self = this;
        self.title = 'Expense Form';
        self.categories = Expense.categories;
        self.expenseObj = {};
        self.save = function(expense){
            Expense.save(expense);
        };
        //self.cancel = function(){};
    }]);

    app.factory('Expenses', ['$rootScope',function($rootScope){
        var service = {};
        service.expenses = [];
        service.categories = ['Living', 'Bills', 'Fun', 'Other'];
        service.addNewExpense = function(expense){
            var id = service.getNewId();
            expense.id = id;
            //console.log('add an id:', expense, id);
            service.expenses.push(expense);
            $rootScope.$broadcast('expenses_changed');
        };
        service.updateExpense = function(expense){
            console.log('update expense called', expense);
        };
        service.getNewId = function(){
            if(service.expenses.length > 0) {
                var id = _.max(service.expenses, function(expense) {
                    return expense.id;
                });
                return id.id;
            }
            else {
                return 0;
            }
        };
        service.getExpenses = function(){
            return service.expenses;
        };
        return service;

    }]);

    app.factory('Expense', ['Expenses',function(Expenses){
        var service = {};
        service.categories = Expenses.categories;
        service.save = function(expense) {
            if(expense.hasOwnProperty('id')) {
                Expenses.updateExpense(expense);
            }
            else{
                Expenses.addNewExpense(expense);
            }
        };
        return service;

    }]);

    app.factory('Salary', function(){
        var service = {};
        service.salary = null;
        service.saveSalary = function(salary){
            console.log('save salary called', salary);
            service.salary = salary;
        };

        return service;
    });

    app.factory('Taxes',['$http', '$q',function ($http, $q) {
        var service = {};
        service.filingStatusOptions = [
            {name: 'single', id: 1, parameter: 'single'},
            {name:'married', id:2, parameter: 'married'},
            {name: 'married, filing separately', id:3, parameter: 'married_separately'},
            {name:'head of household', id:4, parameter: 'head_of_household'},
            {name: 'none', id: 5, parameter: null}
            ];
        service.pay_periods = 1;
        service.stateOptions = ['CA', 'NY', 'NJ', 'FL'];
        service.calculateTaxes = function(salary_data){
            console.log('salary data:', salary_data);
            var config = {
                'async': true,
                'crossDomain': true,
                method: 'POST',
                url: 'http://taxee.io/api/v1/calculate/2016',
                data: {
                    'filing_status': salary_data.filingStatus,
                    'pay_periods': 1,
                    'pay_rate': salary_data.initialSalary,
                    'state': salary_data.state
                },
                headers: {
                    "cache-control": "no-cache",
                    'content-type': 'application/x-www-form-urlencoded'

                }
            };
            $http.jsonp('http://taxee.io/api/v1/calculate/2016',config)
                .then(function(res){
                    console.log('res:',res);
                });

            //$.ajax(config).done(function(response){console.log('res:', response);});
            //$http(config).then(function(res){
              //  console.log('success:', res)},
                //function(res){console.log('error:', res)});
        };
        return service;

    }]);
    //app.controller('', function(){});
})();