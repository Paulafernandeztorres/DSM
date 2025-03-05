import React from 'react';
import { Container, Row, Col, Button, ListGroup, Image } from 'react-bootstrap';
import '../styles/Carrito.css';

function Carrito({ carrito, productosFirebase, agregarAlCarrito, eliminarDelCarrito, eliminarProductoDelCarrito }) {
  const productosEnCarrito = productosFirebase.filter(producto => carrito[producto.id]);

  return (
    <Container>
      <h2>Mi Carrito</h2>
      {productosEnCarrito.length === 0 ? (
        <div className="no-products">
          <p>No tienes productos en tu carrito aún.</p>
          <p>¡Añade algunos para comenzar tu compra!</p>
        </div>
      ) : (
        <ListGroup>
          {productosEnCarrito.map(producto => (
            <ListGroup.Item key={producto.id} className="d-flex align-items-center">
              <Image src={producto.imagen} rounded style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              <span style={{ flex: 2, marginLeft: '15px' }}>{producto.nombre}</span>
              <div className="d-flex align-items-center justify-content-center" style={{ flex: 1 }}>
                <Button variant="danger" onClick={() => eliminarDelCarrito(producto.id)}>-</Button>
                <span className="product-quantity" style={{ margin: '0 10px', textAlign: 'center' }}>{carrito[producto.id]}</span>
                <Button variant="primary" onClick={() => agregarAlCarrito(producto.id)}>+</Button>
              </div>
              <Button 
                variant="danger" 
                onClick={() => eliminarProductoDelCarrito(producto.id)} 
                className="delete-button"
                style={{ marginLeft: 'auto' }}
              >
                Eliminar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default Carrito;
