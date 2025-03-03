import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import "../styles/Producto.css";

function Producto({ producto, agregarAlCarrito, eliminarDelCarrito, carrito }) {
  const cantidad = carrito[producto.id] || 0;

  return (
    <Col sm={12} md={6} lg={4} className="mb-4">
      <Card>
        <Card.Img variant="top" src={producto.imagen} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>${producto.precio}</Card.Text>
          <div className="d-flex justify-content-between">
            <Button variant="danger" onClick={() => eliminarDelCarrito(producto.id)}>-</Button>
            <span>{cantidad}</span>
            <Button variant="primary" onClick={() => agregarAlCarrito(producto.id)}>+</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Producto;