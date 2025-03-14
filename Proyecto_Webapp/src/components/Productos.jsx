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
  const [sortOrder, setSortOrder] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredProductos = productosFirebase
    .filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.precio - b.precio;
      } else if (sortOrder === "desc") {
        return b.precio - a.precio;
      } else {
        return 0;
      }
    });

  return (
    <Container className="productos-container">
      <Form.Group controlId="search" className="mb-4 d-flex">
        <Form.Control
          type="text"
          placeholder="Buscar productos por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input me-2"
        />
        <Form.Control as="select" value={sortOrder} onChange={handleSortChange} className="sort-select" style={{ width: "200px" }}>
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a Mayor</option>
          <option value="desc">Mayor a Menor</option>
        </Form.Control>
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
      precio: PropTypes.number.isRequired,
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
