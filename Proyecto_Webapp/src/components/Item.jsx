import { Card, Button, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/Item.css";

function Item({ producto, agregarAlCarrito, eliminarDelCarrito, carrito }) {
  const cantidad = carrito[producto.id] || 0;

  return (
    <Col sm={12} md={6} lg={4} className="mb-4">
      <Card>
        <Card.Img variant="top" src={producto.imagen} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>${producto.precio}</Card.Text>
          <div className="d-flex justify-content-between">
            <Button
              variant="danger"
              onClick={() => eliminarDelCarrito(producto.id)}
            >
              -
            </Button>
            <span>{cantidad}</span>
            <Button
              variant="primary"
              onClick={() => agregarAlCarrito(producto.id)}
            >
              +
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
Item.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imagen: PropTypes.string.isRequired,
  }).isRequired,
  agregarAlCarrito: PropTypes.func.isRequired,
  eliminarDelCarrito: PropTypes.func.isRequired,
  carrito: PropTypes.object.isRequired,
};

export default Item;
