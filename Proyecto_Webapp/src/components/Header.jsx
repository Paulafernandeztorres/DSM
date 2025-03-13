import "../styles/Header.css";
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
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

  const location = useLocation();

  return (
    <header className="header">
      <div className="header-title-container">
        <img src="icon.png" alt="Logo" className="header-logo" />
        <h2>NFT MarketPlace</h2>
      </div>

      <button className="menu-toggle" onMouseEnter={() => setMenuOpen(true)}>
        ☰
      </button>

      <Nav
        className={`nav ${menuOpen ? "open" : ""}`}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <Nav.Item>
          <NavLink
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Inicio
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to="/contacto"
            className={`nav-item ${
              location.pathname === "/contacto" ? "active" : ""
            }`}
          >
            Contacto
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to="/productos"
            className={`nav-item ${
              location.pathname === "/productos" ? "active" : ""
            }`}
          >
            Productos
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to="/mis-nfts"
            className={`nav-item ${
              location.pathname === "/mis-nfts" ? "active" : ""
            }`}
          >
            Mis NFTs
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          {usuario ? (
            <Nav.Item className="user-container">
              <NavLink
                to="/usuario"
                className={`nav-item user-link ${
                  location.pathname === "/usuario" ? "active" : ""
                }`}
              >
                {usuario.Nombre}
              </NavLink>
              <FaUser size={24} color="#ffffff" />
            </Nav.Item>
          ) : (
            <Nav.Item>
              <NavLink
                to="/login"
                className={`nav-item ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Login
              </NavLink>
            </Nav.Item>
          )}
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to="/carrito"
            className={`nav-item ${
              location.pathname === "/carrito" ? "active" : ""
            }`}
          >
            <FaShoppingCart size={24} color="#ffffff" />
            <span className="cart-count">{totalItems}</span>
          </NavLink>
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
