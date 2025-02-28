import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Productos from './components/Productos';

function App() {
  const [productosFirebase, setproductosFirebase] = useState([]);

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

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/productos" element={<Productos productosFirebase={productosFirebase} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;