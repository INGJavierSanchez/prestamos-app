import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PagosPage() {
  const [fechaPago, setFechaPago] = useState(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement payment registration functionality
  };

  return (
    <div>
      <h2>Registro de Pagos</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPrestamo">
          <Form.Label>Préstamo</Form.Label>
          <Form.Control as="select">
            <option>Seleccionar préstamo</option>
            {/* Map through loans and display options */}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formMontoPago">
          <Form.Label>Monto del Pago</Form.Label>
          <Form.Control type="number" placeholder="Enter monto del pago" />
        </Form.Group>
        <Form.Group controlId="formFechaPago">
          <Form.Label>Fecha del Pago</Form.Label>
          <DatePicker
            selected={fechaPago}
            onChange={(date) => setFechaPago(date)}
            className="form-control"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </div>
  );
}

export default PagosPage;
