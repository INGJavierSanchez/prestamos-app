
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret'; // Cambia esto por una clave secreta más segura

app.use(bodyParser.json());
app.use(cors()); // Esto permitirá todas las solicitudes CORS

// Configura la base de datos
const db = new sqlite3.Database(':memory:'); // Cambia ':memory:' por el path de tu archivo de base de datos

// Crea tablas de usuarios
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)");
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
/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *                 example: '123456789'
 *               nombres:
 *                 type: string
 *                 example: 'Juan'
 *               apellidos:
 *                 type: string
 *                 example: 'Pérez'
 *               alias:
 *                 type: string
 *                 example: 'jperez'
 *               celular:
 *                 type: string
 *                 example: '3001234567'
 *     responses:
 *       200:
 *         description: Cliente registrado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error en el servidor
 */
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

// Ruta protegida de ejemplo
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).send('Token requerido');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');

    res.send('Ruta protegida accedida');
  });
});

const { swaggerUi, swaggerSpec } = require('./swagger');

// Configura Swagger-UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
