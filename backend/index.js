const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret'; // Cambia esto por una clave secreta más segura

app.use(bodyParser.json());
app.use(cors()); // Permite todas las solicitudes CORS

// Configura la base de datos
const db = new sqlite3.Database(':memory:'); // Cambia ':memory:' por el path de tu archivo de base de datos

// Crea tablas de usuarios, clientes, préstamos y pagos
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)");
  db.run(`
    CREATE TABLE clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cedula TEXT UNIQUE,
      nombres TEXT,
      apellidos TEXT,
      alias TEXT,
      celular TEXT
    )
  `);
  db.run(`
    CREATE TABLE prestamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      fecha_prestamo TEXT,
      fecha_pago TEXT,
      interes REAL,
      valor_prestamo REAL,
      FOREIGN KEY(cliente_id) REFERENCES clients(id)
    )
  `);
  db.run(`
    CREATE TABLE pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prestamo_id INTEGER,
      fecha_pago TEXT,
      monto REAL,
      FOREIGN KEY(prestamo_id) REFERENCES prestamos(id)
    )
  `);
});

// Ruta para el registro de usuarios
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error al encriptar la contraseña');

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash], function(err) {
      if (err) return res.status(500).send('Error al registrar el usuario');
      res.status(201).send('Usuario registrado');
    });
  });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).send('Error al obtener el usuario');
    if (!user) return res.status(404).send('Usuario no encontrado');

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).send('Error al comparar contraseñas');
      if (!result) return res.status(401).send('Contraseña incorrecta');

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Ruta para obtener todos los clientes
app.get('/clientes', (req, res) => {
  db.all("SELECT * FROM clients", (err, rows) => {
    if (err) return res.status(500).send('Error al obtener los clientes');
    res.json(rows);
  });
});

// Ruta para registrar un nuevo cliente
app.post('/clientes', (req, res) => {
  const { cedula, nombres, apellidos, alias, celular } = req.body;

  // Verifica si la cédula ya existe
  db.get("SELECT * FROM clients WHERE cedula = ?", [cedula], (err, existingClient) => {
    if (err) return res.status(500).send('Error al verificar la cédula');

    if (existingClient) {
      return res.status(400).send('La cédula ya está registrada');
    }

    // Inserta el nuevo cliente
    db.run(
      "INSERT INTO clients (cedula, nombres, apellidos, alias, celular) VALUES (?, ?, ?, ?, ?)",
      [cedula, nombres, apellidos, alias, celular],
      function(err) {
        if (err) return res.status(500).send('Error al registrar el cliente');
        res.status(201).send('Cliente registrado');
      }
    );
  });
});

// Ruta para registrar un nuevo préstamo
app.post('/prestamos', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { cliente, fechaPrestamo, fechaPago, interes, valorPrestamo } = req.body;

  if (!cliente) {
    return res.status(400).send('Cliente no proporcionado o ID de cliente faltante');
  }

  // Convierte las fechas de cadena a objeto Date
  const fechaPrestamoDate = new Date(fechaPrestamo);
  const fechaPagoDate = new Date(fechaPago);

  if (isNaN(fechaPrestamoDate.getTime()) || isNaN(fechaPagoDate.getTime())) {
    return res.status(400).send('Fechas inválidas');
  }

  db.run(
    "INSERT INTO prestamos (cliente_id, fecha_prestamo, fecha_pago, interes, valor_prestamo) VALUES (?, ?, ?, ?, ?)",
    [cliente, fechaPrestamoDate.toISOString(), fechaPagoDate.toISOString(), interes, valorPrestamo],
    function(err) {
      if (err) return res.status(500).send('Error al registrar el préstamo');
      res.status(201).json({ id: this.lastID, cliente, fechaPrestamo, fechaPago, interes, valorPrestamo });
    }
  );
});


// Ruta para obtener todos los préstamos
app.get('/prestamos', (req, res) => {
  db.all("SELECT * FROM prestamos", (err, rows) => {
    if (err) return res.status(500).send('Error al obtener los préstamos');
    res.json(rows);
  });
});

// Ruta para registrar un nuevo pago
app.post('/pagos', (req, res) => {
  const { prestamo_id, fechaPago, monto } = req.body;
  console.log('Datos recibidos:', req.body);
  
  // Inserta el nuevo pago
  db.run(
    "INSERT INTO pagos (prestamo_id, fecha_pago, monto) VALUES (?, ?, ?)",
    [prestamo_id, fechaPago.toISOString(), monto],
    function(err) {
      if (err) return res.status(500).send('Error al registrar el pago');
      res.status(201).json({ id: this.lastID, prestamo_id, fechaPago, monto });
    }
  );
});

// Ruta para obtener todos los pagos
app.get('/pagos', (req, res) => {
  db.all("SELECT * FROM pagos", (err, rows) => {
    if (err) return res.status(500).send('Error al obtener los pagos');
    res.json(rows);
  });
});

// Configura Swagger-UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
