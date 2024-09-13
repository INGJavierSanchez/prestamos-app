import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component'; // Importa la biblioteca para datatables
import './styles/ClientesPage.css'; // Archivo CSS para estilos personalizados

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

  // Columnas para el DataTable
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Cédula',
      selector: (row) => row.cedula,
      sortable: true,
    },
    {
      name: 'Nombres',
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: 'Apellidos',
      selector: (row) => row.apellidos,
      sortable: true,
    },
    {
      name: 'Alias',
      selector: (row) => row.alias,
      sortable: true,
    },
    {
      name: 'Celular',
      selector: (row) => row.celular,
      sortable: true,
    },
  ];

  return (
    <div className="clientes-container">
      <h2>Registro de Clientes</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCedula">
          <Form.Label>Cédula</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="responsive-input"
          />
        </Form.Group>
        <Form.Group controlId="formNombres">
          <Form.Label>Nombres</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="responsive-input"
          />
        </Form.Group>
        <Form.Group controlId="formApellidos">
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="responsive-input"
          />
        </Form.Group>
        <Form.Group controlId="formAlias">
          <Form.Label>Alias</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="responsive-input"
          />
        </Form.Group>
        <Form.Group controlId="formCelular">
          <Form.Label>Celular</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="responsive-input"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="animated-button">
          Registrar
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </Form>

      <h3>Lista de Clientes Registrados</h3>
      <DataTable
        columns={columns}
        data={clientes}
        pagination
        highlightOnHover
        striped
        className="mt-3"
      />
    </div>
  );
}

export default ClientesPage;
