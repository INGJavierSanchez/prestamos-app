🚀 Proyecto de Gestión de Préstamos
Este proyecto es una aplicación web para gestionar préstamos, clientes y pagos. Utiliza Node.js y SQLite en el backend, y React en el frontend para la interfaz de usuario.

🎯 Características
CRUD de Clientes: Crear, leer, actualizar y eliminar clientes.
Gestión de Préstamos: Crear y listar préstamos.
Registro de Pagos: Registrar y visualizar pagos relacionados con préstamos.
📋 Requisitos previos
Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

Node.js (versión 14 o superior)
npm (gestor de paquetes de Node.js)
⚙️ Instalación y ejecución
Sigue los pasos a continuación para ejecutar correctamente tanto el backend como el frontend:

1. Iniciar el Backend (Node.js + SQLite)
1.1. Navega a la carpeta del backend:

bash
Copiar código
cd backend
1.2. Instala las dependencias:

bash
Copiar código
npm install
1.3. Inicia el servidor backend:

bash
Copiar código
node server.js
Esto debería mostrar el siguiente mensaje en la terminal:

bash
Copiar código
Servidor corriendo en http://localhost:4000
2. Iniciar el Frontend (React)
2.1. Navega a la carpeta del frontend:

bash
Copiar código
cd ../frontend/prestamos-frontend
2.2. Instala las dependencias:

bash
Copiar código
npm install
2.3. Inicia el servidor de desarrollo de React:

bash
Copiar código
npm start
Tu navegador debería abrir automáticamente la aplicación en http://localhost:3000.

🔌 Configuración del Proxy
Asegúrate de que el frontend pueda comunicarse correctamente con el backend. En el archivo package.json del frontend, verifica que esté configurado el siguiente proxy:

json
Copiar código
{
  "proxy": "http://localhost:4000"
}
🔍 Prueba la Aplicación
Una vez que todo esté en marcha, podrás probar las siguientes rutas en tu navegador:

Clientes: Visualiza y gestiona los clientes.
Préstamos: Crea y lista préstamos.
Pagos: Registra pagos y visualiza los detalles.
🛠️ Solución de Problemas
Si te encuentras con algún inconveniente, aquí tienes algunos consejos útiles:

Errores en la consola del navegador: Verifica la comunicación entre el frontend y el backend.
Errores en el backend: Consulta los logs en la terminal donde ejecutaste node server.js para ver si hay errores con la base de datos o las rutas.
📝 Licencia
Este proyecto está licenciado bajo la MIT License. ¡Siéntete libre de usarlo y mejorarlo!

¡Gracias por usar esta aplicación! Si tienes alguna duda o sugerencia, no dudes en crear un issue o enviar un pull request.

