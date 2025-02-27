import "../styles/Header.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router';
import { FaShoppingCart } from "react-icons/fa"; // Ícono de carrito

function Header() {
  return (
    <header className="header">
      <h2>NFT MarketPlace</h2>
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
          <Link to="/crear">Crear</Link>
        </Nav.Item>
        {/* Ícono de carrito de compras */}
        <Nav.Item>
          <Link to="/carrito">
            <FaShoppingCart size={24} color="#ffffff" />
            <span className="cart-count">3</span> {/* Este número debe ser dinámico según la cantidad de productos en el carrito */}
          </Link>
        </Nav.Item>
      </Nav>
    </header>
  );
}

export default Header;
