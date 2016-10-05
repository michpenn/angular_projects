/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

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
    self.salaryFormEdit = false;
    self.save = function (object) {
        self.salaryFormSubmitted = true;
        Salary.saveSalary(object.initialSalary);
        self.initialSalary = object.initialSalary;
        if (object.filingStatus) {
            self.filingStatus = object.filingStatus;
            self.state = object.state;
            Taxes.calculateTaxes(object);
        }
    };
    self.editClicked = function(){
        self.salaryFormEdit = true;
    };
    self.updateSalary = function(object){

        if((object.initialSalary != self.initialSalary) || (object.state != self.state) || ((object.filingStatus != self.filingStatus) && (object.filingStatus != null) && ((self.filingStatus != null)))){
            if(object.initialSalary != self.initialSalary) {
                Salary.saveSalary(object.initialSalary);
            }
            Taxes.updateTaxes(object);

        }
        else if((object.filingStatus == null) && (self.filingStatus != null)) {
            Taxes.removeTaxExpenses();
        }

        else if((self.filingStatus == null) && (object.filingStatus != null)) {
            Taxes.calculateTaxes(object);
        }



        self.salaryFormEdit = false;
    };
    self.edit = function (object) {
        Salary.saveSalary(object.initialSalary);
        if (object.filingStatus) {
            Taxes.calculateTaxes(object);
        }
    };


}]);