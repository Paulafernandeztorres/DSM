import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Producto from "./Producto";

function Productos({ productosFirebase, agregarAlCarrito, eliminarDelCarrito, carrito }) {
  return (
    <Container className="productos-container">
      <Row>
        {productosFirebase.map(producto => (
          <Producto key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} carrito={carrito} />
        ))}
      </Row>
    </Container>
  );
}

export default Productos;