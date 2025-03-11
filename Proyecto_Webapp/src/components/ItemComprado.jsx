import { useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/Item.css";

function ItemComprado({ producto, cantidadComprada }) {
  const [showModal, setShowModal] = useState(false);

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Card onClick={handleShowModal}>
        <Card.Img variant="top" src={producto.imagen} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>Cantidad Comprada: {cantidadComprada}</Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{producto.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ width: "100%", marginBottom: "20px" }}
          />
          <p>
            <strong>Precio:</strong> €{producto.precio}
          </p>
          <p>
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <p>
            <strong>Cantidad Comprada:</strong> {cantidadComprada}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="modal-close-button"
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            href={producto.imagen}
            download={`imagen_${producto.nombre}.jpg`}
          >
            Descargar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ItemComprado.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imagen: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  }).isRequired,
  cantidadComprada: PropTypes.number.isRequired,
};

export default ItemComprado;
