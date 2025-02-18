import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [numA, setNumA] = useState("");
  const [numB, setNumB] = useState("");
  const [operation, setOperation] = useState(null);
  const [result, setResult] = useState(null);

  // Recalcular el resultado cada vez que numA, numB u operation cambien
  useEffect(() => {
    if (numA && numB && operation) {
      const a = parseFloat(numA);
      const b = parseFloat(numB);
      let resultado;

      switch (operation) {
        case "+":
          resultado = a + b;
          break;
        case "-":
          resultado = a - b;
          break;
        case "×":
          resultado = a * b;
          break;
        case "÷":
          resultado = b !== 0 ? a / b : "Error";
          break;
        default:
          resultado = "Error";
      }

      setResult(resultado);
    }
  }, [numA, numB, operation]); // Dependencias: se recalcula cada vez que cambian los números o la operación

  const handleCalculate = (op) => {
    if (numA === "" || numB === "") return;
    setOperation(op);
  };

  return (
    <div className="calculator">
      <h2>CALCULADORA</h2>
      <div className="inputs">
        <input
          type="number"
          placeholder="Número A"
          value={numA}
          onChange={(e) => setNumA(e.target.value)}
        />
        <input
          type="number"
          placeholder="Número B"
          value={numB}
          onChange={(e) => setNumB(e.target.value)}
        />
      </div>

      <div className="buttons">
        {["+", "-", "×", "÷"].map((op) => (
          <button
            key={op}
            className={operation === op ? "active" : ""}
            onClick={() => handleCalculate(op)}
          >
            {op}
          </button>
        ))}
      </div>

      <Resultado result={result} numA={numA} numB={numB} operation={operation} />
    </div>
  );
}

function Resultado({ result, numA, numB, operation }) {
  return (
    <div className="result-box">
      {operation ? (
        <h3>
          {numA} {operation} {numB} = <span className="result">{result}</span>
        </h3>
      ) : (
        <h5>Ingresa números y elige una operación</h5>
      )}
    </div>
  );
}

export default App;
