import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { addPedidoToUserComprados } from "../utils/firebase.utils";

function ShippingInfo({
  show,
  handleClose,
  carrito,
  productosEnCarrito,
  totalCost,
}) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setNombre(userData.Nombre);
      setDireccion(userData.Direccion);
      setCiudad(userData.Ciudad);
      setCodigoPostal(userData.CodigoPostal);
      setTelefono(userData.Telefono);
    }
  }, [show]);

  const handleConfirmPedido = async (event) => {
    event.preventDefault();
    const pedido = {
      Nombre_completo: nombre,
      Direccion: direccion,
      Ciudad: ciudad,
      Codigo_postal: codigoPostal,
      Telefono: telefono,
      Productos: productosEnCarrito.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        cantidad: carrito[producto.id],
        precio_unitario: producto.precio,
        total: producto.precio * carrito[producto.id],
      })),
      Total: totalCost,
    };

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData ? userData.id : null;

      if (userId) {
        await addPedidoToUserComprados(userId, pedido);
      }
      localStorage.removeItem("cart"); // Clear the cart from local storage
      handleClose();
      alert("Pedido realizado con éxito");
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Error al realizar el pedido. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Información de Envío</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleConfirmPedido}>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDireccion" className="mt-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCiudad" className="mt-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCodigoPostal" className="mt-3">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu código postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTelefono" className="mt-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce tu teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Form.Group>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="modal-button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="modal-button modal-confirm-button"
              style={{ width: "40%" }} 
            >
              Confirmar Pedido
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

ShippingInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  carrito: PropTypes.object.isRequired,
  productosEnCarrito: PropTypes.array.isRequired,
  totalCost: PropTypes.number.isRequired,
};

export default ShippingInfo;
