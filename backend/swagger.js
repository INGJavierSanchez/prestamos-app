// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Préstamos',
      version: '1.0.0',
      description: 'Documentación de la API de gestión de préstamos',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Cambia esto según el puerto de tu servidor
      },
    ],
  },
  apis: ['./app/index.js'], // Indica donde se encuentran tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
