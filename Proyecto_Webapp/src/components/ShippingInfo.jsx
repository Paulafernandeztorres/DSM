import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ShippingInfo({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Información de Envío</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu nombre" />
          </Form.Group>
          <Form.Group controlId="formDireccion" className="mt-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu dirección" />
          </Form.Group>
          <Form.Group controlId="formCiudad" className="mt-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu ciudad" />
          </Form.Group>
          <Form.Group controlId="formCodigoPostal" className="mt-3">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu código postal" />
          </Form.Group>
          <Form.Group controlId="formTelefono" className="mt-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" placeholder="Introduce tu teléfono" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="modal-button">
          Cancelar
        </Button>
        <Button variant="primary" className="modal-button modal-confirm-button">
          Confirmar Pedido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ShippingInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ShippingInfo;
