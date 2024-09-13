import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

function ClientesPage() {
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [alias, setAlias] = useState('');
  const [celular, setCelular] = useState('');
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('https://prestamos-app-veyf.vercel.app/clientes');
        setClientes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newClient = {
        cedula,
        nombres,
        apellidos,
        alias,
        celular
      };
      const response = await axios.post('https://prestamos-app-veyf.vercel.app/clientes', newClient);
      setClientes([...clientes, response.data]); // Update the list with the new client
      setCedula('');
      setNombres('');
      setApellidos('');
      setAlias('');
      setCelular('');
      setSuccess('Cliente registrado exitosamente');
      setError('');
    } catch (err) {
      setError('Error al registrar el cliente');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Registro de Clientes</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCédula">
          <Form.Label>Cédula</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formNombres">
          <Form.Label>Nombres</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formApellidos">
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAlias">
          <Form.Label>Alias</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formCelular">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </Form>

      {/* Display the list of clients here */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Alias</th>
            <th>Celular</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.cedula}</td>
              <td>{cliente.nombres}</td>
              <td>{cliente.apellidos}</td>
              <td>{cliente.alias}</td>
              <td>{cliente.celular}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ClientesPage;
