import { useState } from "react";
import "../styles/Login.css";
import { Container, Form, Button } from "react-bootstrap";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, hacer una llamada a una API
    console.log("Email o Usuario:", emailOrUsername);
    console.log("Contraseña:", password);
  };

  return (
    <Container className="login-container">
      <h2 className="text-center">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="emailOrUsername">
          <Form.Label>Usuario o Correo Electrónico:</Form.Label>
          <Form.Control
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
