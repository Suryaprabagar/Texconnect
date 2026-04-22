import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ManufacturerListPage from './pages/ManufacturerListPage';
import BuyerDashboard from './pages/BuyerDashboard';
import CreateRFQPage from './pages/CreateRFQPage';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import AddProductPage from './pages/AddProductPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="/manufacturers" element={<ManufacturerListPage />} />
          <Route path="/dashboard" element={<BuyerDashboard />} />
          <Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/rfqs/create" element={<CreateRFQPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          {/* Add more routes here */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-[60vh] text-2xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
