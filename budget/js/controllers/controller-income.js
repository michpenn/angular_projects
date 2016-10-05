/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

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
