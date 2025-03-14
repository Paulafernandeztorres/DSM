import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button } from "react-bootstrap";
import { contarProductosComprados } from "../utils/firebase.utils";
import ItemComprado from "./ItemComprado";
import UploadNFT from "./UploadNFT";
import "../styles/MisNFT.css"; // Importar el archivo CSS
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const MisNFT = ({ usuario, productosFirebase }) => {
  const [productosContados, setProductosContados] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && usuario.Comprados) {
      const productos = contarProductosComprados(usuario.Comprados);
      setProductosContados(productos);
    }
  }, [usuario]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleViewProducts = () => {
    navigate("/productos");
  };

  if (!usuario) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center p-4 border rounded shadow-sm bg-light">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="3x"
            className="mb-3 text-warning"
          />
          <h2>Debes iniciar sesión para ver tus NFT</h2>
          <Button
            onClick={handleLogin}
            className="w-auto mt-3 inicio-button"
            variant="primary"
          >
            Iniciar Sesión
          </Button>
          <Button
            onClick={handleViewProducts}
            className="w-auto mt-3 btn"
            variant="secondary"
          >
            Ver Productos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="productos-container">
      <h2>Mis NFT</h2>
      <UploadNFT userId={usuario.uid} /> {/* Mostrar el componente UploadNFT */}
      <Row>
        {Object.keys(productosContados).map((productoId) => {
          const producto = productosFirebase.find((p) => p.id === productoId);
          return (
            <Col key={productoId} xs={12} sm={6} md={4} lg={3} className="mb-4">
              {producto ? (
                <ItemComprado
                  producto={producto}
                  cantidadComprada={productosContados[productoId]}
                />
              ) : (
                <p>Producto no encontrado</p>
              )}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

MisNFT.propTypes = {
  usuario: PropTypes.object.isRequired,
  productosFirebase: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      imagen: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
    })
  ).isRequired,
};

export default MisNFT;
