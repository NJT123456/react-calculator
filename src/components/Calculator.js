import React, { useState } from "react"
import { FaSquareRootVariable, FaDeleteLeft } from "react-icons/fa6"

const Calculator = () => {
  const [result, setResult] = useState("0")
  const [subResult, setSubResult] = useState("")
  const [calculations, setCalculations] = useState([])
  const [newNumber, setNewNumber] = useState(false)
  const [reset, setReset] = useState(false)
  const [lastOperator, setLastOperator] = useState(null)
  const [currentResult, setCurrentResult] = useState(0)

  const calculate = (currentResult, value, operator) => {
    switch (operator) {
      case "+":
        return currentResult + value
      case "-":
        return currentResult - value
      case "x":
        return currentResult * value
      case "÷":
        return currentResult / value
      default:
        return currentResult
    }
  }

  const maxDigitWarning = () => {
    const prevVal = result
    setResult("Digit Limit")
    setTimeout(() => setResult(prevVal), 1000)
  }

  const handleNumber = (e) => {
    let number = e.target.value
    if (reset) clear()

    if (result.length > 12) maxDigitWarning()
    else if (result === "0" || newNumber) setResult(number)
    else setResult((prevResult) => prevResult + number)

    setNewNumber(false)
  }

  const handleOption = (e) => {
    let option = e.target.value
    let updatedResult = result
    const lastChar = result[result.length - 1]

    switch (option) {
      case ".":
        if (lastChar !== "." || result.indexOf(".") === -1) {
          updatedResult += "."
        }
        break
      case "CE":
        updatedResult = "0"
        break
      case "C":
        updatedResult = "0"
        clear()
        break
      case "+/-":
        updatedResult = parseFloat(result) * -1
        break
      case "undo":
        result.length === 1
          ? (updatedResult = "0")
          : (updatedResult = result.slice(0, -1))
        break
      default:
        break
    }
    setResult(updatedResult)
  }

  const handleOperator = (e) => {
    const operator = e.target.value
    const value = Number(result)

    switch (operator) {
      case "pow":
        setResult(parseFloat(Math.pow(value, 2).toPrecision(12)))
        setSubResult(
          `${
            currentResult === 0 ? "" : `${currentResult} ${lastOperator}`
          } sqr(${result})`
        )
        break
      case "sqrt":
        setResult(parseFloat(Math.sqrt(value).toPrecision(12)))
        setSubResult(
          `${
            currentResult === 0 ? "" : `${currentResult} ${lastOperator}`
          } √(${result})`
        )
        break
      case "fraction":
        setResult(parseFloat((1 / value).toPrecision(12)))
        setSubResult(
          `${
            currentResult === 0 ? "" : `${currentResult} ${lastOperator}`
          } 1/(${result})`
        )
        break
      case "%":
        setResult(parseFloat((value / 100).toPrecision(12)))
        setSubResult(
          `${currentResult === 0 ? "" : `${currentResult} ${lastOperator}`} ${
            result / 100
          }`
        )
        break
      default:
        if (
          operator === "=" &&
          newNumber &&
          lastOperator !== null &&
          lastOperator !== "="
        ) {
          let updateCalculations = [...calculations]
          if (calculations.length > 2) {
            const value = calculations
              .map()
              .reverse()
              .find((item) => typeof item === "number")

            updateCalculations = [currentResult, lastOperator, value, operator]
          }

          setCalculations(updateCalculations)

          const updatedResult = calculate(currentResult, value, lastOperator)
          setCurrentResult(updatedResult)

          setResult(updatedResult.toString())
          setSubResult(updateCalculations.join(" "))
        } 
        // else if (operator === "-" && (newNumber || result === "0")) {
        //   setResult("-")
        //   setNewNumber(false)
        //   return
        // } 
        else {
          if (newNumber) {
            setCurrentResult(value)
            setLastOperator(operator)
            calculations[calculations.length - 1] = operator
            setSubResult(`${currentResult} ${operator}`)
            setReset(false)
            return
          }

          let updateCurrentResult
          if (lastOperator === null) {
            updateCurrentResult = value
          } else {
            updateCurrentResult = calculate(currentResult, value, lastOperator)
          }

          if (operator !== "=") {
            setLastOperator(operator)
            setSubResult(`${updateCurrentResult} ${operator}`)
          } else {
            setSubResult(`${currentResult} ${lastOperator} ${value} =`)
            setReset(true)
          }
          setNewNumber(true)
          setCalculations([value, operator])
          setCurrentResult(parseFloat(updateCurrentResult.toPrecision(12)))
          setResult(parseFloat(updateCurrentResult.toPrecision(12)))
        }
        break
    }
    console.log("calculations", calculations)
    console.log("lastOperator", lastOperator)
    console.log("operator", operator)
    console.log("currentResult", currentResult)
    console.log("Result", result)
    console.log("value", value)
    console.log("subResult", subResult)
  }

  const clear = () => {
    setResult("0")
    setSubResult("")
    setCalculations([])
    setNewNumber(false)
    setReset(false)
    setLastOperator(null)
    setCurrentResult(0)
  }

  return (
    <div className="calculator">
      <h5 className="center">calculator</h5>
      <div className="calculator-display" id="display">
        <h3>{subResult}</h3>
        <h1>{result}</h1>
      </div>
      <div className="calculator-button">
        <button
          className="operator"
          id="percentage"
          onClick={handleOperator}
          value="%">
          %
        </button>
        <button
          id="clearEntry"
          className="clear-value-btn"
          onClick={handleOption}
          value="CE">
          CE
        </button>
        <button
          id="clear"
          className="clear-btn"
          onClick={handleOption}
          value="C">
          C
        </button>
        <button id="undo" onClick={handleOption} value="undo">
          <FaDeleteLeft />
        </button>
        <button id="fraction" onClick={handleOperator} value="fraction">
          <span>
            <sup>1</sup>
          </span>
          <span>&frasl;</span>
          <span>
            <sub>
              <em>x</em>
            </sub>
          </span>
        </button>

        <button id="pow" onClick={handleOperator} value="pow">
          <span>
            <sub>x</sub>
          </span>
          <span>
            <sup>2</sup>
          </span>
        </button>
        <button id="sqrt" onClick={handleOperator} value="sqrt">
          <FaSquareRootVariable />
        </button>
        <button
          className="operator"
          id="divide"
          onClick={handleOperator}
          value="÷">
          ÷
        </button>

        <button id="seven" onClick={handleNumber} value="7">
          7
        </button>
        <button id="eight" onClick={handleNumber} value="8">
          8
        </button>
        <button id="nine" onClick={handleNumber} value="9">
          9
        </button>

        <button
          className="operator"
          id="multiply"
          onClick={handleOperator}
          value="x">
          X
        </button>

        <button id="four" onClick={handleNumber} value="4">
          4
        </button>
        <button id="five" onClick={handleNumber} value="5">
          5
        </button>
        <button id="six" onClick={handleNumber} value="6">
          6
        </button>
        <button
          className="operator"
          id="subtract"
          onClick={handleOperator}
          value="-">
          -
        </button>

        <button id="one" onClick={handleNumber} value="1">
          1
        </button>
        <button id="two" onClick={handleNumber} value="2">
          2
        </button>
        <button id="three" onClick={handleNumber} value="3">
          3
        </button>

        <button
          className="operator"
          id="add"
          onClick={handleOperator}
          value="+">
          +
        </button>

        <button
          className="operator"
          id="divide"
          onClick={handleOption}
          value="+/-">
          +/-
        </button>
        <button id="zero" onClick={handleNumber} value="0">
          0
        </button>

        <button id="decimal" onClick={handleOption} value=".">
          .
        </button>

        <button
          id="equals"
          className="operator equal"
          onClick={handleOperator}
          value="=">
          =
        </button>
      </div>
    </div>
  )
}

export default Calculator
