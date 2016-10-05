/**
 * Created by michpenn on 8/15/16.
 */
(function () {
    var app = angular.module('budgetApp', []);




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

    app.filter('capitalize', function() {
        return function(input) {
            if(!!input) {


                var splitString = input.split(' ');
                var stringPartsCaps = [];
                for (var i = 0; i < splitString.length; i++) {
                    if (!!splitString[i]) {
                        stringPartsCaps.push(splitString[i].charAt(0).toUpperCase() + splitString[i].substr(1).toLowerCase());
                    }
                    else {
                        stringPartsCaps.push('');
                    }

                }

                return stringPartsCaps.join(' ');
            }
            else {
                return '';
            }
        }
    });


})();