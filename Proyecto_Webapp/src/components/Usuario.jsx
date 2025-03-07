import PropTypes from "prop-types";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Usuario.css";

const Usuario = ({ usuario, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    onLogout();
    navigate("/login");
  };

  if (!usuario) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="no-hover">
            <Card.Header as="h2" className="d-flex justify-content-between align-items-center">
              Perfil de Usuario
              <Button variant="danger" size="md" onClick={handleLogout} className="w-25">Cerrar Sesión</Button>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Usuario.propTypes = {
  usuario: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Usuario;
