import { useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Form } from "react-bootstrap";
import Item from "./Item";
import "../styles/Productos.css";

function Productos({
  productosFirebase,
  agregarAlCarrito,
  eliminarDelCarrito,
  carrito,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProductos = productosFirebase.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="productos-container">
      <Form.Group controlId="search" className="mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar productos por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </Form.Group>
      <h2>Productos disponibles:</h2>
      <Row>
        {filteredProductos.map((producto) => (
          <Item
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
            eliminarDelCarrito={eliminarDelCarrito}
            carrito={carrito}
          />
        ))}
      </Row>
    </Container>
  );
}
Productos.propTypes = {
  productosFirebase: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  agregarAlCarrito: PropTypes.func.isRequired,
  eliminarDelCarrito: PropTypes.func.isRequired,
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Productos;
