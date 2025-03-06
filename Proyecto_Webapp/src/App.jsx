import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Productos from "./components/Productos";
import Carrito from "./components/Carrito";
import Login from "./components/Login";
import Contacto from "./components/Contacto";
import { getProductos } from "./utils/firebase.utils";

function App() {
  const [productosFirebase, setproductosFirebase] = useState([]);
  const [carrito, setCarrito] = useState({});

  useEffect(() => {
    const fetchProductos = async () => {
      const productosArray = await getProductos();
      setproductosFirebase(productosArray);
    };

    fetchProductos().catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }, []);

  const agregarAlCarrito = (productoId) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };
      nuevoCarrito[productoId] = (nuevoCarrito[productoId] || 0) + 1;
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((prevCarrito) => {
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
    setCarrito((prevCarrito) => {
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
        <Route path="/Login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route
          path="/productos"
          element={
            <Productos
              productosFirebase={productosFirebase}
              agregarAlCarrito={agregarAlCarrito}
              eliminarDelCarrito={eliminarDelCarrito}
              carrito={carrito}
            />
          }
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              productosFirebase={productosFirebase}
              agregarAlCarrito={agregarAlCarrito}
              eliminarDelCarrito={eliminarDelCarrito}
              eliminarProductoDelCarrito={eliminarProductoDelCarrito}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
