import { useState } from 'react';
import { Container, Button, ListGroup, Image, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../styles/Carrito.css';
import OrderDetails from './OrderDetails';
import ShippingInfo from './ShippingInfo';

function Carrito({ carrito, productosFirebase, agregarAlCarrito, eliminarDelCarrito, eliminarProductoDelCarrito }) {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const handleShowModal = (productoId) => {
    setProductoAEliminar(productoId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductoAEliminar(null);
  };

  const handleConfirmDelete = () => {
    eliminarProductoDelCarrito(productoAEliminar);
    handleCloseModal();
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowModal(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const productosEnCarrito = productosFirebase.filter(producto => carrito[producto.id]);

  const totalCost = productosEnCarrito.reduce((total, producto) => {
    return total + producto.precio * carrito[producto.id];
  }, 0);

  return (
    <Container>
      <h2>Mi Carrito</h2>
      {productosEnCarrito.length === 0 ? (
        <div className="no-products">
          <p>No tienes productos en tu carrito aún.</p>
          <p>¡Añade algunos para comenzar tu compra!</p>
        </div>
      ) : (
        <>
          <ListGroup>
            {productosEnCarrito.map(producto => (
              <ListGroup.Item key={producto.id} className="d-flex align-items-center">
                <Image src={producto.imagen} rounded style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                <span style={{ flex: 2, marginLeft: '15px' }}>{producto.nombre}</span>
                <div className="d-flex align-items-center justify-content-center" style={{ flex: 1 }}>
                  <Button variant="danger" onClick={() => eliminarDelCarrito(producto.id)}>-</Button>
                  <span className="product-quantity" style={{ margin: '0 10px', textAlign: 'center' }}>{carrito[producto.id]}</span>
                  <Button variant="primary" onClick={() => agregarAlCarrito(producto.id)}>+</Button>
                </div>
                <span style={{ flex: 1, textAlign: 'right', marginRight: '20px' }}>€{(producto.precio * carrito[producto.id]).toFixed(2)}</span>
                <Button 
                  variant="danger" 
                  onClick={() => handleShowModal(producto.id)} 
                  className="delete-button"
                  style={{ marginLeft: 'auto' }}
                >
                  Eliminar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="total-cost">
            <h4>Total: €{totalCost.toFixed(2)}</h4>
          </div>
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto del carrito?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="modal-button">
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} className="modal-button">
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Button className="buy-button" onClick={() => setShowModal(true)}>Realizar compra</Button>

      <OrderDetails
        show={showModal}
        handleClose={handleCloseModal}
        productosEnCarrito={productosEnCarrito}
        carrito={carrito}
        totalCost={totalCost}
        handleShowForm={handleShowForm}
      />

      <ShippingInfo
        show={showForm}
        handleClose={handleCloseForm}
      />
    </Container>
  );
}

Carrito.propTypes = {
  carrito: PropTypes.object.isRequired,
  productosFirebase: PropTypes.array.isRequired,
  agregarAlCarrito: PropTypes.func.isRequired,
  eliminarDelCarrito: PropTypes.func.isRequired,
  eliminarProductoDelCarrito: PropTypes.func.isRequired,
};

export default Carrito;
