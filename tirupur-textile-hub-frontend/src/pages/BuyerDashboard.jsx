import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import { Plus, Layout, Package, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ rfqs: 0, orders: 0, unread: 0 });
  const [recentRFQs, setRecentRFQs] = useState([]);

  useEffect(() => {
    // Fetch stats and recent RFQs
    // Mock data for demo
    setStats({ rfqs: 12, orders: 3, unread: 5 });
    setRecentRFQs([
      { _id: '1', rfqNumber: 'RFQ-82910', title: '100% Cotton T-shirts for Summer', status: 'open', quoteCount: 5, createdAt: new Date() },
      { _id: '2', rfqNumber: 'RFQ-82911', title: 'Organic Cotton Kidswear Batch', status: 'quoted', quoteCount: 8, createdAt: new Date() },
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Buyer'}</h1>
          <p className="text-gray-600">Overview of your sourcing activities.</p>
        </div>
        <Link to="/rfqs/create">
          <Button className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New RFQ
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Layout className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active RFQs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rfqs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Unread Messages</p>
            <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent RFQs</h2>
          <Link to="/rfqs/my" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all</Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFQ #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRFQs.map((rfq) => (
                <tr key={rfq._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{rfq.rfqNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rfq.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                        rfq.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfq.quoteCount} received</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(rfq.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentRFQs.length === 0 && (
            <div className="py-12 text-center text-gray-500">No active RFQs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
