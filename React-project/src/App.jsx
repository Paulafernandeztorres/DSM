import { useState, useEffect } from "react";
import "./App.css";
import Resultado from "./components/Resultado";

function App() {
  const [numA, setNumA] = useState("");
  const [numB, setNumB] = useState("");
  const [operation, setOperation] = useState(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const a = parseFloat(numA);
    const b = parseFloat(numB);

    if (!isNaN(a) && !isNaN(b) && operation) {
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
    } else {
      setResult(numA || numB || ""); // Si no hay operación, muestra numA o numB
    }
  }, [numA, numB, operation]); // Se ejecuta al cambiar cualquier número u operación

  return (
    <div className="calculator">
      <h2>CALCULADORA</h2>
      <h3>Ingresar Números</h3>
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

      <h3>Seleccionar Operación</h3>
      <div className="buttons">
        {["+", "-", "×", "÷"].map((op) => (
          <button
            key={op}
            className={operation === op ? "active" : ""}
            onClick={() => setOperation(op)}
          >
            {op}
          </button>
        ))}
      </div>

      <h3>Resultado</h3>
      <Resultado result={result} numA={numA} numB={numB} operation={operation} />
    </div>
  );
}

export default App;
