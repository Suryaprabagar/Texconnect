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
import ServicesPage from './pages/ServicesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RFQDetailPage from './pages/RFQDetailPage';
import Toast from './components/common/Toast';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Landing Page - No Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Pages - With Layout */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/manufacturers" element={<ManufacturerListPage />} />
              <Route path="/dashboard" element={<BuyerDashboard />} />
              <Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
              <Route path="/rfqs/create" element={<CreateRFQPage />} />
              <Route path="/rfqs/:id" element={<RFQDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="*" element={<div className="flex items-center justify-center min-h-[60vh] text-2xl font-bold">404 - Page Not Found</div>} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
