import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import "../styles/Productos.css";

// Aquí definimos algunos productos de ejemplo (puedes cargar estos desde una API o base de datos)
const productos = [
  {
    id: 1,
    nombre: "NFT de Arte Digital 1",
    imagen: "/NFT1.jpg", // Reemplaza con la URL de la imagen del producto
    precio: 10,
  },
  {
    id: 2,
    nombre: "NFT de Arte Digital 2",
    imagen: "/NFT2.jpg", // Reemplaza con la URL de la imagen del producto
    precio: 15,
  },
  {
    id: 3,
    nombre: "NFT de Arte Digital 3",
    imagen: "/NFT3.jpg", // Reemplaza con la URL de la imagen del producto
    precio: 20,
  },
];

function Productos() {
  const [carrito, setCarrito] = useState({});

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[producto.id]) {
        nuevoCarrito[producto.id] += 1;
      } else {
        nuevoCarrito[producto.id] = 1;
      }
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = (producto) => {
    setCarrito((prevCarrito) => {
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
    <div className="productos-container">
      <h1>Productos NFT</h1>
      <Row>
        {productos.map((producto) => (
          <Col sm={12} md={6} lg={4} key={producto.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={producto.imagen} />
              <Card.Body>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text>${producto.precio}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="primary" 
                    onClick={() => agregarAlCarrito(producto)} 
                  >
                    +
                  </Button>
                  <span>{carrito[producto.id] || 0}</span>
                  <Button 
                    variant="danger" 
                    onClick={() => eliminarDelCarrito(producto)} 
                  >
                    -
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Productos;
