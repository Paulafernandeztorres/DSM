import "../styles/Header.css";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FaShoppingCart, FaUser } from "react-icons/fa"; // Ícono de carrito

function Header({ carrito, usuario }) {
  const location = useLocation();
  const totalItems = Object.values(carrito).reduce(
    (acc, item) => acc + item,
    0
  );

  return (
    <header className="header">
      <div className="header-title-container">
        <img src="icon.png" alt="Logo" className="header-logo" />
        <h2>NFT MarketPlace</h2>
      </div>

      <Nav className="justify-content-end">
        <Nav.Item>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Inicio</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/contacto" className={location.pathname === "/contacto" ? "active" : ""}>Contacto</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/productos" className={location.pathname === "/productos" ? "active" : ""}>Productos</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/mis-nfts" className={location.pathname === "/mis-nfts" ? "active" : ""}>Mis NFTs</Link>
        </Nav.Item>
        <Nav.Item>
          {usuario ? (
            <Nav.Item className="user-container">
              <Link to="/usuario" className={location.pathname === "/usuario" ? "active" : ""}>{usuario.Nombre}</Link>
              <FaUser size={24} color="#ffffff" />
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
            </Nav.Item>
          )}
        </Nav.Item>
        <Nav.Item>
          <Link to="/carrito" className={location.pathname === "/carrito" ? "active" : ""}>
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
