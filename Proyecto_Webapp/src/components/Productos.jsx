import React from 'react';
import { Container, Row } from 'react-bootstrap';
import Producto from "./Producto";

function Productos({ productosFirebase }) {
  return (
    <Container className="productos-container">
      <Row>
        {productosFirebase.map(producto => (
          <Producto key={producto.id} producto={producto} />
        ))}
      </Row>
    </Container>
  );
}

export default Productos;