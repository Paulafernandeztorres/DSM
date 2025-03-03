import "../styles/Header.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom'; 
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito

function Header({ carrito }) {
  const totalItems = Object.values(carrito).reduce((acc, item) => acc + item, 0);

  return (
    <header className="header">
      <div className="header-title-container">
        <img src="icon.png" alt="Logo" className="header-logo" />
        <h2>NFT MarketPlace</h2>
      </div>

      <Nav className="justify-content-end">
        <Nav.Item>
          <Link to="/">Inicio</Link>
        </Nav.Item>
        <NavDropdown title="Explorar" id="nav-dropdown">
          <NavDropdown.Item as={Link} to="/explorar/nuevos">Nuevos NFTs</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/explorar/subastas">Subastas en Vivo</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/explorar/colecciones">Colecciones</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/explorar/detalles">Detalles del NFT</NavDropdown.Item>
        </NavDropdown>
        <Nav.Item>
          <Link to="/productos">Productos</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/mis-nfts">Mis NFTs</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/login">Login</Link>
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

export default Header;
