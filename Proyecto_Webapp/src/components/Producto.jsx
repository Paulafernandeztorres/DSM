import React, { useState } from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import "../styles/Producto.css";

function Producto({ producto }) {
  const [carrito, setCarrito] = useState({});

  const agregarAlCarrito = () => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = { ...prevCarrito };
      nuevoCarrito[producto.id] = (nuevoCarrito[producto.id] || 0) + 1;
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = () => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[producto.id] > 1) {
        nuevoCarrito[producto.id] -= 1;
      } else {
        delete nuevoCarrito[producto.id];
      }
      return nuevoCarrito;
    });
  };

  return (
    <Col sm={12} md={6} lg={4} className="mb-4">
      <Card>
        <Card.Img variant="top" src={producto.imagen} />
        <Card.Body>
          <Card.Title>{producto.nombre}</Card.Title>
          <Card.Text>${producto.precio}</Card.Text>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={agregarAlCarrito}>+</Button>
            <span>{carrito[producto.id] || 0}</span>
            <Button variant="danger" onClick={eliminarDelCarrito}>-</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Producto;