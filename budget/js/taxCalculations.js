/**
 * Created by michpenn on 8/13/16.
 */
function california_income(income, filing) {
    var tax = [];
    var incomeTax = {};
    incomeTax.name = 'Income Tax';
    switch (filing) {
        case 'single':
            if (income <= 7850) {
                incomeTax.rate = '1%';
                incomeTax.totalInTaxes = income * 0.01;
                tax.push(incomeTax);
            }
            else if (income <= 18610) {
                incomeTax.rate = '2%';
                incomeTax.totalInTaxes = income * 0.02;
                tax.push(incomeTax);
            }
            else if (income <= 29372) {
                incomeTax.rate = '4%';
                incomeTax.totalInTaxes = income * 0.04;
                tax.push(incomeTax);
            }
            else if (income <= 40773) {
                incomeTax.rate = '6%';
                incomeTax.totalInTaxes = income * 0.06;
                tax.push(incomeTax);
            }
            else if (income <= 51530) {
                incomeTax.rate = '8%';
                incomeTax.totalInTaxes = income * 0.08;
                tax.push(incomeTax);
            }
            else if (income <= 263222) {
                incomeTax.rate = '9.3%';
                incomeTax.totalInTaxes = income * 0.093;
                tax.push(incomeTax);
            }
            else if (income <= 315866) {
                incomeTax.rate = '10.3%';
                incomeTax.totalInTaxes = income * 0.103;
                tax.push(incomeTax);
            }
            else if (income <= 526443) {
                incomeTax.rate = '11.3%';
                incomeTax.totalInTaxes = income * 0.113;
                tax.push(incomeTax);
            }
            else {
                incomeTax.rate = '12.3%';
                incomeTax.totalInTaxes = income * 0.123;
                tax.push(incomeTax);
                if(1000000 <= income) {
                    var mentalTax = {rate: '1%', totalInTaxes: income*0.01, name:'Mental Health Tax'};
                    tax.push(mentalTax);
                }
            }

            break;
        default:
            console.log('filing status:', filing, 'income:', income);
            break;
    }
    return tax;
}