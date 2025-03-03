import React from 'react';
import { Container, Row, Col, Button, ListGroup, Image } from 'react-bootstrap';
import '../styles/Carrito.css';

function Carrito({ carrito, productosFirebase, agregarAlCarrito, eliminarDelCarrito, eliminarProductoDelCarrito }) {
  const productosEnCarrito = productosFirebase.filter(producto => carrito[producto.id]);

  return (
    <Container>
      <h1>Carrito de Compras</h1>
      <ListGroup>
        {productosEnCarrito.map(producto => (
          <ListGroup.Item key={producto.id} className="d-flex align-items-center">
            <Image src={producto.imagen} rounded style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            <span style={{ flex: 2, marginLeft: '15px' }}>{producto.nombre}</span>
            <div className="d-flex align-items-center">
              <Button variant="danger" onClick={() => eliminarDelCarrito(producto.id)}>-</Button>
              <span style={{ margin: '0 10px' }}>{carrito[producto.id]}</span>
              <Button variant="primary" onClick={() => agregarAlCarrito(producto.id)}>+</Button>
            </div>
            <Button 
              variant="danger" 
              onClick={() => eliminarProductoDelCarrito(producto.id)} 
              style={{ flex: 1, padding: '6px 12px' }} 
            >
              Eliminar
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default Carrito;
