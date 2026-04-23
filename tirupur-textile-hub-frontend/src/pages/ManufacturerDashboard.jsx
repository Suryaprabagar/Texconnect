import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const ManufacturerDashboard = () => {
  const { user, logout } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, rfqs: 0, revenue: 0 });

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manufacturer Panel</h2>
          <p className="text-slate-500 text-lg mt-1 font-medium">Managing: <span className="text-primary">{user?.name || 'Your Factory'}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard/manufacturer" 
            onClick={() => addToast('Inventory management coming soon!', 'info')}
            className="h-12 px-6 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center shadow-sm text-sm"
          >
            <span className="material-symbols-outlined mr-2">inventory_2</span>
            Manage Inventory
          </Link>
          <Link to="/products/add" className="h-12 px-6 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center transform active:scale-95 text-sm">
            <span className="material-symbols-outlined mr-2">add_circle</span>
            Add New Product
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-primary group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary">package_2</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Live Products</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">{stats.products}</h3>
            <span className="text-xs text-slate-400 font-medium">Items online</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-orange-400 group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <span className="material-symbols-outlined text-orange-600">file_copy</span>
            </div>
            <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Open RFQs</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">{stats.rfqs}</h3>
            <span className="text-xs text-slate-400 font-medium">Bids required</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-emerald-400 group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="material-symbols-outlined text-emerald-600">payments</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">₹4.5L</h3>
            <span className="text-xs text-slate-400 font-medium">This month</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance */}
        <section className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
            <span className="material-symbols-outlined mr-2 text-primary">trending_up</span>
            Performance Overview
          </h3>
          <div className="aspect-video bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Analytics Dashboard Coming Soon</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link 
              to="/dashboard/manufacturer" 
              onClick={() => addToast('Marketplace exploration coming soon!', 'info')}
              className="flex items-center p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-blue-600">search</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm">Review Open RFQs</p>
                <p className="text-xs text-slate-500 mt-1">Find buyers looking for your products.</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </Link>
            
            <Link 
              to="/dashboard/manufacturer" 
              onClick={() => addToast('Order management system coming soon!', 'info')}
              className="flex items-center p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-emerald-600">local_shipping</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-bold text-sm">Manage Orders</p>
                <p className="text-xs text-slate-500 mt-1">Update shipping and order timelines.</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined">logout</span>
              Log Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
