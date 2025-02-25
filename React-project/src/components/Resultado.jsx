import "./Resultado.css";

function Resultado({ result, numA, numB, operation }) {
    const isEmpty = numA === "" || numB === "" || !operation;

    return (
        <div className="result-box">
            {isEmpty ? (
                <h5>Ingresa números y elige una operación</h5>
            ) : (
                <h3>
                    {numA} {operation} {numB} = <span className="result">{result}</span>
                </h3>
            )}
        </div>
    );
}

export default Resultado;
