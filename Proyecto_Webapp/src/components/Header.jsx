import "../styles/Header.css";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaShoppingCart, FaUser } from "react-icons/fa"; // Ícono de carrito
import { useState, useEffect } from "react";

function Header({ carrito, usuario }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = Object.values(carrito).reduce(
    (acc, item) => acc + item,
    0
  );

  // Cerrar el menú cuando la pantalla se agranda
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-title-container">
        <img src="icon.png" alt="Logo" className="header-logo" />
        <h2>NFT MarketPlace</h2>
      </div>

      <button
        className="menu-toggle"
        onMouseEnter={() => setMenuOpen(true)}
      >
        ☰
      </button>

      <Nav
        className={`nav ${menuOpen ? "open" : ""}`}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <Nav.Item>
          <Link to="/">Inicio</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/contacto">Contacto</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/productos">Productos</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/mis-nfts">Mis NFTs</Link>
        </Nav.Item>
        <Nav.Item>
          {usuario ? (
            <Nav.Item className="user-container">
              <Link to="/usuario">{usuario.Nombre}</Link>
              <FaUser size={24} color="#ffffff" />
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Link to="/login">Login</Link>
            </Nav.Item>
          )}
        </Nav.Item>
        <Nav.Item>
          <Link to="/carrito">
            <FaShoppingCart size={24} color="#ffffff" />
            <span className="cart-count">{totalItems}</span>
          </Link>
        </Nav.Item>
      </Nav>
    </header>
  );
}

Header.propTypes = {
  carrito: PropTypes.object.isRequired,
  usuario: PropTypes.object,
};

export default Header;
