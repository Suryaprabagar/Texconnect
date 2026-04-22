import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tirupur's #1 B2B Textile Marketplace
          </h1>
          <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
            Connect directly with top garment manufacturers and wholesalers from Tirupur. Streamline your sourcing, RFQs, and order management.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/products">
              <Button size="lg" className="px-8 py-3">Browse Products</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Sign Up Now</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="mt-2 text-gray-600 font-medium">Manufacturers</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-primary-600">10k+</div>
              <div className="mt-2 text-gray-600 font-medium">Daily RFQs</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-primary-600">1M+</div>
              <div className="mt-2 text-gray-600 font-medium">Garments Sourced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
