import PropTypes from "prop-types";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/Usuario.css";

const Usuario = ({ usuario, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    sessionStorage.clear(); // Clear session storage
    localStorage.removeItem("authToken"); // Clear auth token from local storage
    onLogout(); // Call the onLogout function passed as a prop
    navigate("/login");
  };

  if (!usuario) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="p-4 border rounded shadow-sm container-usuario">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Perfil de Usuario</h2>
              <Button
                variant="danger"
                size="md"
                onClick={handleLogout}
                className="w-25 logout-button"
              >
                <span className="logout-text">Cerrar Sesión</span>
                <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              </Button>
            </div>
            <div>
              <p>
                <strong>Nombre:</strong> {usuario.Nombre}
              </p>
              <p>
                <strong>Apellidos:</strong> {usuario.Apellidos}
              </p>
              <p>
                <strong>Dirección:</strong> {usuario.Direccion}
              </p>
              <p>
                <strong>Código Postal:</strong> {usuario.CodigoPostal}
              </p>
              <p>
                <strong>Teléfono:</strong> {usuario.Telefono}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {usuario.Correo}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

Usuario.propTypes = {
  usuario: PropTypes.shape({
    Nombre: PropTypes.string.isRequired,
    Apellidos: PropTypes.string.isRequired,
    Direccion: PropTypes.string.isRequired,
    CodigoPostal: PropTypes.string.isRequired,
    Telefono: PropTypes.string.isRequired,
    Correo: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Usuario;
