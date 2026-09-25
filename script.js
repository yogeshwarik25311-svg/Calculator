const currentOperandText = document.getElementById('current-operand');
const previousOperandText = document.getElementById('previous-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

function updateDisplay() {
    currentOperandText.innerText = currentOperand;
    if (operation != null) {
        let symbol = operation;
        if (operation === '*') symbol = '×';
        if (operation === '/') symbol = '÷';
        if (operation === '-') symbol = '−';
        previousOperandText.innerText = `${previousOperand} ${symbol}`;
    } else {
        previousOperandText.innerText = '';
    }
}

function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        if (number === '.') {
            currentOperand = '0.';
        } else {
            currentOperand = number;
        }
        resetScreen = false;
    } else {
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentOperand === '' && previousOperand === '') return;
    
    if (previousOperand !== '' && !resetScreen) {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    resetScreen = false;
    updateDisplay();
}

function deleteNumber() {
    if (resetScreen) return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }

    // Fix JavaScript floating point precision issues (e.g., 0.1 + 0.2)
    currentOperand = Math.round(computation * 100000000) / 100000000 + '';
    operation = undefined;
    previousOperand = '';
    resetScreen = true;
    updateDisplay();
}

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
        appendOperator(e.key);
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') {
        deleteNumber();
    }
    if (e.key === 'Escape') {
        clearDisplay();
    }
});
