import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ClientesPage from './pages/ClientesPage';
import PrestamosPage from './pages/PrestamosPage';
import PagosPage from './pages/PagosPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/prestamos" element={<PrestamosPage />} />
          <Route path="/pagos" element={<PagosPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
