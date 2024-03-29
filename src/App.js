import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import './style.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.currentOperand == null || state.operation == null) {
        return state;
      }
      return {
        overwrite: true,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: state.currentOperand.slice(0, -1),
        }
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length === 1) {
        return {};
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) && isNaN(current)) {
    return "";
  }
  let calculate = "";
  switch (operation) {
    case "+":
      calculate = previous + current;
      break;
    case "-":
      calculate = previous - current;
      break;
    case "x":
      calculate = previous * current;
      break;
    case "÷":
      calculate = previous / current;
      break;
  }
  return calculate.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

function formatOperand(operand) {
  if (operand == null) {
    return null;
  }
  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});
  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-output">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-output">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={()=>dispatch({ type:ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="x" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

      </div>
    </>
  )
}
export default App;