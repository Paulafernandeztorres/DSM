import PropTypes from "prop-types";
import { Table, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "../styles/PedidosRealizados.css";

const PedidosRealizados = ({ pedidos, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const handleShowModal = (pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h3>Pedidos Realizados</h3>
      {pedidos && pedidos.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID del Pedido</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Eliminar pedido</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => (
              <tr key={index} onClick={() => handleShowModal(pedido)}>
                <td>{index + 1}</td>
                <td>{formatDate(pedido.fecha)}</td>
                <td>{pedido.Total} €</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pedido.id);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No has realizado ningún pedido.</p>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPedido && (
            <>
              <p><strong>Nombre Completo:</strong> {selectedPedido.Nombre_completo}</p>
              <p><strong>Dirección:</strong> {selectedPedido.Direccion}</p>
              <p><strong>Ciudad:</strong> {selectedPedido.Ciudad}</p>
              <p><strong>Código Postal:</strong> {selectedPedido.Codigo_postal}</p>
              <p><strong>Teléfono:</strong> {selectedPedido.Telefono}</p>
              <p><strong>Total:</strong> {selectedPedido.Total} €</p>
              <p><strong>Productos:</strong></p>
              <ul>
                {selectedPedido.Productos.map((producto, idx) => (
                  <li key={idx}>
                    {producto.nombre} - {producto.cantidad} x {producto.precio_unitario} € = {producto.total} €
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

PedidosRealizados.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      Nombre_completo: PropTypes.string.isRequired,
      Direccion: PropTypes.string.isRequired,
      Ciudad: PropTypes.string.isRequired,
      Codigo_postal: PropTypes.string.isRequired,
      Telefono: PropTypes.string.isRequired,
      Total: PropTypes.number.isRequired,
      Productos: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          nombre: PropTypes.string.isRequired,
          cantidad: PropTypes.number.isRequired,
          precio_unitario: PropTypes.number.isRequired,
          total: PropTypes.number.isRequired,
        })
      ).isRequired,
      fecha: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PedidosRealizados;
