import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import { Plus, Package, FileText, IndianRupee, TrendingUp } from 'lucide-react';

const ManufacturerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, rfqs: 0, revenue: 0 });

  useEffect(() => {
    // Mock stats
    setStats({ products: 24, rfqs: 15, revenue: 450000 });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturer Panel: {user?.name}</h1>
          <p className="text-gray-600">Manage your products, quotes and incoming RFQs.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/products/manage">
            <Button variant="outline">Manage Products</Button>
          </Link>
          <Link to="/products/add">
            <Button className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Incoming RFQs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rfqs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
            Performance Overview
          </h2>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 italic">
            Chart Placeholder: Sales over time
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/rfqs/incoming" className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <p className="font-bold text-gray-900">Review Open RFQs</p>
              <p className="text-sm text-gray-500">View buyers looking for products in your category.</p>
            </Link>
            <Link to="/orders/manage" className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <p className="font-bold text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-500">Update shipping status and timeline for active orders.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
