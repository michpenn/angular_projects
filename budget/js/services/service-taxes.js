/**
 * Created by michpenn on 10/4/16.
 */
var app = angular.module('budgetApp');

app.factory('Taxes', ['$http', '$q', '$interpolate','Expenses', function ($http, $q, $interpolate, Expenses) {
    var service = {};
    service.filingStatusOptions = filingStatusOptions;
    service.pay_periods = 1;
    service.stateOptions = stateOptions;

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
                    obj.manuallyAdded = false;
                    Expenses.addNewExpense(obj);
                }
            });

    };

    service.updateTaxes = function(salary_data){
        //console.log('salary data update taxes:', salary_data);
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
                    obj.id = Expenses.findExpenseId('Taxes', taxType);
                    obj.manuallyAdded = false;

                    if(obj.id) {
                        Expenses.updateExpense(obj);
                    }
                    else {
                        Expenses.addNewExpense(obj);
                        //console.log('need to add this:', obj);
                    }



                }
            });




    };

    service.removeTaxExpenses = function(){
        var removed_taxes = _.reject(Expenses.expenses, function(expense) {
            return ((expense.category == 'Taxes') && (!expense.manuallyAdded));
        });
        Expenses.expenses = removed_taxes;
        Expenses.getExpenses();
    };
    return service;

}]);