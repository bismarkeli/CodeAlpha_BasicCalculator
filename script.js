// Select display elements
const previousOperandText = document.getElementById('previous-operand');
const currentOperandText = document.getElementById('current-operand');
const buttons = document.querySelectorAll('.btn');

// Calculator State Variables
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;
let calculationFinished = false;

// Helper to get matching math symbols for display
function getOperatorSymbol(op) {
    switch (op) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        default: return '';
    }
}

// Update the visual display screen
function updateDisplay() {
    currentOperandText.textContent = currentInput;
    if (operator !== null) {
        previousOperandText.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
    } else {
        previousOperandText.textContent = '';
    }
}

// Handle number button clicks
function handleNumber(number) {
    if (calculationFinished) {
        currentInput = '';
        calculationFinished = false;
    }
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Handle operator button clicks (+, -, ×, ÷)
function handleOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    calculationFinished = false;
    
    // Show expression preview at the top immediately
    previousOperandText.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
}
function handlePercentage() {
    let current = parseFloat(currentInput);
    if (isNaN(current)) return;
    
    currentInput = (current / 100).toString();
    updateDisplay();
}
// Perform the calculation
function calculate() {
    if (operator === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case 'add': result = prev + current; break;
        case 'subtract': result = prev - current; break;
        case 'multiply': result = prev * current; break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default: return;
    }

    // Show expression history at top (e.g., "869 + 586 =") and result at bottom
    previousOperandText.textContent = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput} =`;
    currentInput = result.toString();
    operator = null;
    shouldResetScreen = true;
    calculationFinished = true;
    
    // Directly update main result display
    currentOperandText.textContent = currentInput;
}

// Clear everything (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    calculationFinished = false;
    previousOperandText.textContent = '';
    currentOperandText.textContent = '0';
}

// Delete the last typed digit (C)
function deleteLast() {
    if (shouldResetScreen || calculationFinished) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '' || currentInput === '-') {
        currentInput = '0';
    }
    updateDisplay();
}

// Button event listeners
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.number !== undefined) {
            handleNumber(button.dataset.number);
        } else if (button.dataset.action === 'clear') {
            clearAll();
        } else if (button.dataset.action === 'delete') {
            deleteLast();
        } else if (button.dataset.action === 'calculate') {
            calculate();
        }else if (button.dataset.action === 'percentage') {
            handlePercentage();
        } else {
            handleOperator(button.dataset.action);
        }
    });
});
// Keyboard Support
window.addEventListener('keydown', (e) => {
    // Numbers 0-9 and decimal point
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleNumber(e.key);
    } 
    // Operators
    else if (e.key === '+') {
        handleOperator('add');
    } else if (e.key === '-') {
        handleOperator('subtract');
    } else if (e.key === '*') {
        handleOperator('multiply');
    } else if (e.key === '/') {
        e.preventDefault(); // Prevents browser from opening quick-find search bar
        handleOperator('divide');
    } 
    // Equals (Enter key or standard equals sign)
    else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault(); // Prevents default form submit behavior
        calculate();
    } 
    // Clear All (Escape key)
    else if (e.key === 'Escape') {
        clearAll();
    } 
    // Backspace / Delete (Deletes last digit)
    else if (e.key === 'Backspace') {
        deleteLast();
    }
});