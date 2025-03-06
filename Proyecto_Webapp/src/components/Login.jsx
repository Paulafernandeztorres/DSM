import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { Container, Form, Button, Alert } from "react-bootstrap";
import {
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
} from "../utils/firebase.utils";
import { FaGoogle } from "react-icons/fa"; // Importa el ícono de Google de react-icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      console.log("Login successful:", response.user);
      setAlertMessage("Inicio de sesión exitoso.");
      setAlertVariant("success");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === "auth/invalid-credential") {
        setAlertMessage(
          "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña."
        );
      } else {
        setAlertMessage(
          "Error al iniciar sesión. Por favor, intenta nuevamente."
        );
      }
      setAlertVariant("danger");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithGooglePopup();
      console.log("Google login successful:", response.user);
      setAlertMessage("Inicio de sesión con Google exitoso.");
      setAlertVariant("success");
      // Aquí puedes manejar la respuesta de Google, por ejemplo, guardar el usuario en tu estado o redirigirlo
    } catch (error) {
      console.error("Google login failed:", error);
      setAlertMessage("Error al iniciar sesión con Google.");
      setAlertVariant("danger");
    }
  };

  return (
    <Container className="login-container">
      <h2 className="text-center">Iniciar Sesión</h2>
      {alertMessage && (
        <Alert
          variant={alertVariant}
          onClose={() => setAlertMessage("")}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Correo Electrónico:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="login-button w-100 mt-3"
        >
          Iniciar Sesión
        </Button>
      </Form>
      <div className="text-center mt-3">
        <Button
          variant="outline-danger"
          onClick={handleGoogleLogin}
          className="w-100"
        >
          <FaGoogle className="me-2" /> Iniciar Sesión con Google
        </Button>
      </div>
      <div className="text-center mt-3">
        <Button
          variant="link"
          onClick={() => navigate("/registro")}
          className="w-100"
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </div>
    </Container>
  );
};

export default Login;
