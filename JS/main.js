const calculator = {
    displayValue: "0", //Screen will show 0
    firstOperand: null, //Before we have first operator we have null
    waitSecondOperand: false, //Here we check for second Operand input
    operator: null, //Here we will hold the Operator
};

function inputDigit(digit) {
    const { displayValue, waitSecondOperand} = calculator;
    /*We check if waitSecondOperand is true and set
    displayValue to the key that was pressed*/
    if (waitSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitSecondOperand = false;
    }
    else {
    /*This will overwrite the current displayValue if it's 
      otherwise it adds onto it*/
      calculator.displayValue = displayValue === "0" ? digit : displayValue + digit;
    }
}

//This section handles decimals
function inputDecimal(dot) {
    /*This ensures accidental clicks don't cause any bugs */
    if (calculator.waitSecondOperand === true) return;
    if(!calculator.displayValue.includes(dot)) {
    //If display does not include decimal point we add it 
    calculator.displayValue += dot;
    }
}

//This section will handles operators
function handleOperator(nextOperator) {
    const {firstOperand, displayValue, operator} = calculator;
    /*When an operator key is pressed, we convert the current number
    displayed on the screen to a number and then store the result in
    calculator.firstOperand if it doesn't already exist  */
    const valueOfInput = parseFloat(displayValue);
    /*Checks if an operator already exists and if waitSecondOperand
    is true, updates the operator and exits from the function */
    if (operator && calculator.waitSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }
    if (firstOperand == null) {
        calculator.firstOperand = valueOfInput;
    }
    //Checks if operators already exists
    else if (operator) {
        const valueNow = firstOperand || 0;
        /*If operator exists, property lookup is performed for the
        operator in the performCalculation object and the function 
        matches the operator is executed */
        let result = performCalculation[operator] (valueNow, valueOfInput);
        //Here we add a fixed amount of numbers after the decimal
        result = Number(result).toFixed(9)
        //This will remove any trailing 0's
        result = (result * 1).toString()
        calculator.displayValue = parseFloat(result);
        calculator.firstOperand = parseFloat(result);
    }
    calculator.waitSecondOperand = true;
    calculator.operator = nextOperator;
}

//Here calculations are done
const performCalculation = {
    "/" : (firstOperand, secondOperand) => firstOperand / secondOperand,
    "*" : (firstOperand, secondOperand) => firstOperand * secondOperand,
    "+" : (firstOperand, secondOperand) => firstOperand + secondOperand,
    "-" : (firstOperand, secondOperand) => firstOperand - secondOperand,
    "=" : (firstOperand, secondOperand) => secondOperand
};

//This function resets calculator
function calculatorReset() {
    calculator.displayValue = "0";
    calculator.firstOperand = null;
    calculator.waitSecondOperand = false;
    calculator.operator = null;
}

//This will update the screen with the contents of displayValue
function updateDisplay(){
    const display = document.querySelector(".calculator-screen");
    display.value = calculator.displayValue;
}

updateDisplay();//We call display update

//This section will monitor the clicks
const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
//Target variable represents the clicked element
const { target } = event;
//If the element that was clicked on is not a button, exit function
if (!target.matches("button")) {
    return;
}

//If we click on one of the operator keys
if (target.classList.contains("operator")) {
    handleOperator(target.value);
    updateDisplay();
    return;
}

//If we click on decimal
if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    updateDisplay();
    return;
}

//If ACC is clicked, calculator screen is cleared
if (target.classList.contains("all-clear")) {
    calculatorReset();
    updateDisplay();
    return
}

inputDigit(target.value);
updateDisplay();
})
