import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Productos from './components/Productos';
import Carrito from './components/Carrito';

function App() {
  const [productosFirebase, setproductosFirebase] = useState([]);
  const [carrito, setCarrito] = useState({});

  useEffect(() => {
    axios.get('https://proyecto-webapp-573f0-default-rtdb.europe-west1.firebasedatabase.app/Productos.json')
      .then((response) => {
        let productosArray = [];
        for (let key in response.data) {
          productosArray.push({
            id: key,
            nombre: response.data[key].nombre,
            precio: response.data[key].precio,
            imagen: response.data[key].imagen,
          });
        }
        setproductosFirebase(productosArray);
      })
      .catch((error) => { console.log('¡Se ha producido un error!') });
  }, []);

  const agregarAlCarrito = (productoId) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = { ...prevCarrito };
      nuevoCarrito[productoId] = (nuevoCarrito[productoId] || 0) + 1;
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[productoId] > 1) {
        nuevoCarrito[productoId] -= 1;
      } else {
        delete nuevoCarrito[productoId];
      }
      return nuevoCarrito;
    });
  };

  const eliminarProductoDelCarrito = (productoId) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = { ...prevCarrito };
      delete nuevoCarrito[productoId];
      return nuevoCarrito;
    });
  };

  return (
    <>
      <Header carrito={carrito} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos productosFirebase={productosFirebase} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} carrito={carrito} />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} productosFirebase={productosFirebase} agregarAlCarrito={agregarAlCarrito} eliminarDelCarrito={eliminarDelCarrito} eliminarProductoDelCarrito={eliminarProductoDelCarrito}/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;