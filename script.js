function add(first, second) {
    return Number(first.replace(",", ".")) + Number(second.replace(",", "."));
}

function subtract(first, second) {
    return Number(first.replace(",", ".")) - Number(second.replace(",", "."));
}

function multiply(first, second) {
    return Number(first.replace(",", ".")) * Number(second.replace(",", "."));
}

function divide(first, second) {
    return Number(first.replace(",", ".")) / Number(second.replace(",", "."));
}

function operate(first, second, operator) {
    if (operator == "+") return add(first, second);
    else if (operator == "-") return subtract(first, second);
    else if (operator == "×") return multiply(first, second);
    else if (operator == "÷") return divide(first, second);
}

function simplifyExpression(expression, index) {
    let lastNumStart = 0;
    let lastNumEnd = index - 1;
    let nextNumStart = index + 2;
    let nextNumEnd = expression.length;
    for (let i = 0; i < expression.length-1; i++) {
        if (operatorsArray.includes(expression[i])) {
            if (i < index) {
                lastNumStart = i + 2;
            }
            else if (i > index) {
                nextNumEnd = i - 1;
                break;
            }
        }
    }
    return [expression.slice(lastNumStart, lastNumEnd), expression.slice(nextNumStart, nextNumEnd)];
}

//VARIABLES
let operatorsArray = ["+", "-", "×","÷"];
let firstNumber;
let operator;
let secondNumber;
let operatorState = false;
let commaState = false;
let equalState = false;

const screen = document.querySelector(".screen");

//ADDITIONALS

//clear
document.querySelector(".clear").addEventListener("click", () => {
    screen.textContent = "";
    commaState = false;
    operatorState = true;
});

//backspace
document.querySelector(".backspace").addEventListener("click", () => {
    screen.textContent = screen.textContent.slice(0, -1);
});

//plus-minus
document.querySelector(".plus-minus").addEventListener("click", () => {
    console.log(screen.textContent[0]);
    if (screen.textContent[0] != "-") {
        screen.textContent = "-" + screen.textContent;
    }  
    else if(screen.textContent[0] == "-") {
        screen.textContent = screen.textContent.slice(1);
    }
    
});

//MAIN

//numbers
document.querySelectorAll(".number").forEach((number) => {
    number.addEventListener("click", () => {
        if (equalState) {
            screen.textContent = number.textContent;
            equalState = false;
        }
        else {
            screen.textContent += number.textContent;
            operatorState = false;
        }
    });
});

//operators
document.querySelectorAll(".operator").forEach((operator) => {
    operator.addEventListener("click", () => {
        if (!operatorState) {
            screen.textContent += ` ${operator.textContent} `;
            operatorState = true;
            commaState = false;
        }
    });
});

//comma
document.querySelector(".comma").addEventListener("click", () => {
    if (commaState) {
        return;
    }
    if (equalState) {
        screen.textContent = "0,";
        equalState = false;
        operatorState = false;
        commaState = true;
    }
    else if (operatorState) {
        screen.textContent += "0,";
        operatorState = false;
        commaState = true;
    }
    else {
        screen.textContent += ",";
        commaState = true;
    }
});

//LOGICS(equal button)
document.querySelector(".equal").addEventListener("click", () => {
    
    equalState = true;
    let expression = screen.textContent;
    let newNumber;
    while (operatorsArray.some((operator) => expression.includes(operator)))
    {
        if (expression.includes("×") || expression.includes("÷")) {
            for (let i = 0; i < expression.length - 1; i++) {
                let sign;
                if (expression[i] == "×") {
                    sign = "×";
                }
                else if (expression[i] == "÷") {
                    sign = "÷";
                }
                else {
                    continue;
                }
                firstNumber = simplifyExpression(expression, i)[0];
                secondNumber = simplifyExpression(expression, i)[1];
                newNumber = operate(firstNumber, secondNumber, sign);
                expression = expression.replace(`${firstNumber} ${sign} ${secondNumber}`, newNumber.toString());
            }
        }
        else if (expression.includes("+") || expression.includes("-")) {
            for (let i = 0; i < expression.length - 1; i++) {
                let sign;
                if (expression[i] == "+") {
                    sign = "+";
                }
                else if (expression[i] == "-") {
                    sign = "-";
                }
                else {
                    continue;
                }
                firstNumber = simplifyExpression(expression, i)[0];
                secondNumber = simplifyExpression(expression, i)[1];
                newNumber = operate(firstNumber, secondNumber, sign);
                newNumber = Math.round(newNumber * 1e6) / 1e6;
                expression = expression.replace(`${firstNumber} ${sign} ${secondNumber}`, newNumber.toString());
            }
        }
    }

    expression = expression.replace(/\./g, ",");
    
    screen.textContent = expression;

});

