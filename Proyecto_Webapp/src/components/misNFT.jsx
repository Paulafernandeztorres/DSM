import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { contarProductosComprados } from "../utils/firebase.utils";
import ItemComprado from "./ItemComprado";
import "../styles/MisNFT.css"; // Importar el archivo CSS

const MisNFT = ({ usuario, productosFirebase }) => {
  const [productosContados, setProductosContados] = useState({});

  useEffect(() => {
    if (usuario.Comprados) {
      const productos = contarProductosComprados(usuario.Comprados);
      setProductosContados(productos);
    }
  }, [usuario]);

  return (
    <Container className="productos-container">
      <h2>Mis NFT</h2>
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
