import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../styles/Contacto.css";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre && email && mensaje) {
      setShowSuccess(true);
      setShowError(false);
      setNombre("");
      setEmail("");
      setMensaje("");
    } else {
      setShowError(true);
      setShowSuccess(false);
    }
  };

  return (
    <Container className="contacto-container">
      <h2>Contacto</h2>
      <p>
        Si tienes alguna pregunta o necesitas más información, no dudes en
        contactarnos.
      </p>
      {showSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowSuccess(false)}
          dismissible
        >
          ¡Mensaje enviado con éxito!
        </Alert>
      )}
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          Por favor, rellena todos los campos.
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formMensaje" className="mt-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Escribe tu mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Enviar
        </Button>
      </Form>
    </Container>
  );
}

export default Contacto;
