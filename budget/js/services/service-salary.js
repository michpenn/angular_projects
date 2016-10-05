/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.factory('Salary', function () {
    var service = {};
    service.salary = null;
    service.saveSalary = function (salary) {
        service.salary = salary;
    };

    return service;
});