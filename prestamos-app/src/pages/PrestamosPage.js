import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
import { es } from 'date-fns/locale';
import { FaMoneyCheckAlt } from 'react-icons/fa'; // Ícono para el botón de registro
import DataTable from 'react-data-table-component'; // Importa la biblioteca para datatables
import './styles/PrestamosPage.css'; // Archivo CSS para estilos personalizados

registerLocale('es', es);

function PrestamosPage() {
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date());
  const [fechaPago, setFechaPago] = useState();
  const [interes, setInteres] = useState(0);
  const [valorPrestamo, setValorPrestamo] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState('');
  const [prestamos, setPrestamos] = useState([]); // Almacena los préstamos registrados
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('https://prestamos-app-veyf.vercel.app/clientes');
        setClientes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar clientes', err);
        setLoading(false);
      }
    };
  
    fetchClientes();
  }, []);
  
  if (loading) {
    return <div>Cargando...</div>;
  }

  const calcularFechaPago = (date) => {
    if (date) {
      const fecha = new Date(date);
      fecha.setDate(fecha.getDate() + 30);
      setFechaPago(fecha);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('ID del cliente seleccionado:', clienteSeleccionadoId);
    console.log('Clientes disponibles:', clientes);
  
    // Encuentra el cliente basado en el ID seleccionado
    const clienteSeleccionado = clientes.find(cliente => cliente.id === clienteSeleccionadoId);

    if (!clienteSeleccionado) {
      // Si no se encuentra el cliente, muestra un mensaje de error y detiene el envío
      console.error('Cliente no encontrado o ID de cliente inválido');
      return;
    }

    const nuevoPrestamo = {
      cliente: clienteSeleccionadoId, // Enviar solo el ID del cliente como string
      fechaPrestamo: fechaPrestamo.toISOString(), // Convertir la fecha a formato ISO 8601
      fechaPago: fechaPago.toISOString(), // Convertir la fecha a formato ISO 8601
      interes,
      valorPrestamo,
    };

    // Llama a la API para guardar el nuevo préstamo
    axios
      .post('https://prestamos-app-veyf.vercel.app/prestamos', nuevoPrestamo)
      .then((response) => {
        // Actualiza la lista de préstamos localmente con el nuevo registro
        setPrestamos((prevPrestamos) => [...prevPrestamos, response.data]);
        // Resetea los campos
        setFechaPrestamo(new Date());
        setFechaPago(new Date());
        setInteres(0);
        setValorPrestamo('');
        setClienteSeleccionadoId('');
      })
      .catch((error) => {
        console.error('Error al registrar el préstamo', error);
      });
  };

  // Columnas para el DataTable
  const columns = [
    {
      name: 'Cédula',
      selector: (row) => row.cliente.cedula,
      sortable: true,
    },
    {
      name: 'Cliente',
      selector: (row) => `${row.cliente.nombres} ${row.cliente.apellidos}`,
      sortable: true,
    },
    {
      name: 'Fecha del Préstamo',
      selector: (row) => new Date(row.fechaPrestamo).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Fecha de Pago',
      selector: (row) => new Date(row.fechaPago).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Interés (%)',
      selector: (row) => row.interes,
      sortable: true,
    },
    {
      name: 'Valor del Préstamo',
      selector: (row) => `$${row.valorPrestamo.toLocaleString()}`,
      sortable: true,
    },
  ];

  return (
    <div className="prestamos-container">
      <h2>Registro de Préstamos</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCliente">
          <Form.Label>Cliente</Form.Label>
          <Form.Control
            as="select"
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
          >
            <option>Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombres} {cliente.apellidos}
              </option>
            ))}
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
            className="form-control responsive-input"
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </Form.Group>
        <Form.Group controlId="formFechaPago">
          <Form.Label>Fecha de Pago</Form.Label>
          <DatePicker
            selected={fechaPago}
            readOnly
            className="form-control responsive-input"
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </Form.Group>
        <Form.Group controlId="formInteres">
          <Form.Label>% de Valor de Interés</Form.Label>
          <Form.Control
            type="number"
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
            placeholder="Ingrese el interés"
            className="responsive-input"
          />
        </Form.Group>
        <Form.Group controlId="formValorPrestamo">
          <Form.Label>Valor del Préstamo</Form.Label>
          <NumericFormat
            thousandSeparator={true}
            prefix={'$'}
            value={valorPrestamo}
            onValueChange={(values) => {
              const { value } = values;
              setValorPrestamo(value);
            }}
            className="form-control responsive-input"
            placeholder="Ingrese el valor del préstamo"
            isNumericString={true}
            allowNegative={false}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="animated-button">
          <FaMoneyCheckAlt className="button-icon" /> Registrar
        </Button>
      </Form>

      <h3>Lista de Préstamos Registrados</h3>
      <DataTable
        columns={columns}
        data={prestamos}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default PrestamosPage;
