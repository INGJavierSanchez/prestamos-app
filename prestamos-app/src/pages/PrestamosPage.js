import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PrestamosPage() {
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date());
  const [fechaPago, setFechaPago] = useState(new Date());
  const [interes, setInteres] = useState(0);

  const calcularFechaPago = (date) => {
    if (date) {
      const fecha = new Date(date);
      fecha.setDate(fecha.getDate() + 30);
      setFechaPago(fecha);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement loan registration functionality
  };

  return (
    <div>
      <h2>Registro de Préstamos</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCliente">
          <Form.Label>Cliente</Form.Label>
          <Form.Control as="select">
            <option>Seleccionar cliente</option>
            {/* Map through clients and display options */}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formFechaPrestamo">
          <Form.Label>Fecha del Préstamo</Form.Label>
          <DatePicker
            selected={fechaPrestamo}
            onChange={(date) => {
              setFechaPrestamo(date);
              calcularFechaPago(date);
            }}
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formFechaPago">
          <Form.Label>Fecha de Pago</Form.Label>
          <DatePicker
            selected={fechaPago}
            readOnly
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formInteres">
          <Form.Label>% de Valor de Interés</Form.Label>
          <Form.Control
            type="number"
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
            placeholder="Enter interés"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </div>
  );
}

export default PrestamosPage;
