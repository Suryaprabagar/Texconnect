import React, { useState } from 'react';
import { useToastStore } from '../store/toastStore';

const ServicesPage = () => {
  const addToast = useToastStore((state) => state.addToast);
  const [filter, setFilter] = useState('All');
  const [location, setLocation] = useState('All Locations');

  const services = [
    { id: 1, name: 'Tirupur Digital Prints', category: 'Printing', location: 'Tirupur', rating: 4.9, img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Eco-Labels India', category: 'Labeling', location: 'Coimbatore', rating: 4.7, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Royal Embroidery Works', category: 'Embroidery', location: 'Tirupur', rating: 4.8, img: 'https://images.unsplash.com/photo-1571247094030-9b418579047d?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Smart Packing Solutions', category: 'Packing', location: 'Tirupur', rating: 4.5, img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Vibrant Dyeing House', category: 'Dyeing', location: 'Salem', rating: 4.6, img: 'https://images.unsplash.com/photo-1555529669-2269763671c0?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: 'Precision Zipper Co.', category: 'Zippers', location: 'Bangalore', rating: 4.9, img: 'https://images.unsplash.com/photo-1594932224828-b4b059b6ff6f?auto=format&fit=crop&q=80&w=400' },
  ];

  const categories = ['All', 'Printing', 'Labeling', 'Tagging', 'Button fixing', 'Zippers', 'Embroidery', 'Dyeing', 'Packing'];
  const locations = ['All Locations', 'Tirupur', 'Coimbatore', 'Salem', 'Bangalore'];

  const filteredServices = services.filter(s => 
    (filter === 'All' || s.category === filter) && 
    (location === 'All Locations' || s.location === location)
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Services Marketplace</h2>
        <p className="text-slate-500 text-lg mt-1 font-medium">Find specialized industry partners for your production needs.</p>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 5).map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
          <select 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 focus:outline-none"
          >
            <option value="All">More...</option>
            {categories.slice(5).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
          <span className="material-symbols-outlined text-slate-400 ml-3">location_on</span>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-2 pr-8 py-2 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
      </section>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="h-48 relative overflow-hidden">
              <img src={service.img} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">{service.category}</span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-slate-900/40 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-orange-400 text-xs">star</span>
                  <span className="text-[10px] font-black text-white">{service.rating}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 mb-1">{service.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-6 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {service.location}, India
              </p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => addToast(`Contacting ${service.name}...`, 'info')}
                  className="flex-1 bg-primary text-white font-black text-xs uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all"
                >
                  Contact Now
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No services found in this area</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
