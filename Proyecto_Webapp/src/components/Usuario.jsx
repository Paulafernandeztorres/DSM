import PropTypes from "prop-types";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/Usuario.css";

const Usuario = ({ usuario }) => {
  if (!usuario) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="no-hover">
            <Card.Header as="h2">Perfil de Usuario</Card.Header>
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
};

export default Usuario;
