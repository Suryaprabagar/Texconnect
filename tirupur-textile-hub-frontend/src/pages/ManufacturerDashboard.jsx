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
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Manufacturer Panel</h2>
            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              Verified
            </span>
          </div>
          <p className="text-slate-500 text-base lg:text-lg font-medium">Managing: <span className="text-primary">{user?.name || 'Your Factory'}</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Link 
            to="/dashboard/manufacturer" 
            onClick={() => addToast('Inventory management coming soon!', 'info')}
            className="flex-1 lg:flex-none h-11 lg:h-12 px-4 lg:px-6 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm text-xs lg:text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined mr-2 text-xl">inventory_2</span>
            Inventory
          </Link>
          <Link to="/products/add" className="flex-1 lg:flex-none h-11 lg:h-12 px-4 lg:px-6 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center transform active:scale-95 text-xs lg:text-sm whitespace-nowrap">
            <span className="material-symbols-outlined mr-2 text-xl">add_circle</span>
            Add Product
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Details */}
        <section className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <h3 className="text-xl font-black text-slate-900 mb-6">Company Profile</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Production Capacity</p>
              <p className="text-sm font-bold text-slate-700">50,000 units / month</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600">GOTS Certified</span>
                <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600">ISO 9001</span>
                <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-600">OEKO-TEX</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Tirupur, Tamil Nadu
              </p>
            </div>
            <button className="w-full py-3 border border-primary text-primary font-bold rounded-xl text-xs hover:bg-primary/5 transition-all">
              Edit Profile Details
            </button>
          </div>
        </section>

        {/* Product Catalog */}
        <section className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-900">Your Catalog</h3>
            <Link to="/products" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Organic Cotton Tee', price: '₹180', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200' },
              { name: 'Heavy GSM Hoodie', price: '₹450', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200' },
              { name: 'Slim Fit Chinos', price: '₹320', img: 'https://images.unsplash.com/photo-1624371414361-e6e8ea402430?auto=format&fit=crop&q=80&w=200' },
            ].map((product, i) => (
              <div key={i} className="group">
                <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-2 relative">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-lg text-[10px] font-black text-primary">{product.price}</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-900 truncate">{product.name}</p>
              </div>
            ))}
            <Link to="/products/add" className="aspect-square border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">add_circle</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-widest">Add New</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Ratings & Reviews */}
      <section className="bg-white p-8 rounded-3xl shadow-soft border border-slate-50">
        <h3 className="text-xl font-black text-slate-900 mb-6">Ratings & Reviews</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="text-center md:pr-8 md:border-r border-slate-100">
            <h4 className="text-5xl font-black text-slate-900">4.8</h4>
            <div className="flex items-center justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-orange-400 text-lg">star</span>)}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Based on 24 reviews</p>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">JS</div>
                  <p className="text-xs font-bold text-slate-900">Jatin Sharma <span className="text-slate-400 font-medium ml-2">Buyer</span></p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-orange-400 text-[14px]">star</span>)}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">"Excellent quality cotton and timely delivery. Highly recommend for bulk orders."</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManufacturerDashboard;
