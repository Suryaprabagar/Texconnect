import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeHero from '../assets/welcome_pg.jpg';
import useStats from '../hooks/useStats';

const HomePage = () => {
  const { stats, loading } = useStats(30000); // Update every 30 seconds

  return (
    <div className="space-y-12">
      {/* Hero Bento Box */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[400px] rounded-3xl overflow-hidden group">
          <img 
            src={WelcomeHero} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Textile Hub Welcome"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 lg:p-10">
            <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight tracking-tighter mb-3 lg:mb-4">
              Tirupur's Largest B2B <br className="hidden sm:block"/> Textile Marketplace
            </h1>
            <p className="text-slate-200 text-sm lg:text-lg max-w-xl mb-6 lg:mb-8 font-medium">
              Source premium garments directly from certified manufacturers in India's knitwear hub.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95">
                Explore Inventory
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-primary/20">
          <div>
            <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <h2 className="text-2xl font-bold mb-2">Verified Sourcing</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Every manufacturer on Texconnect is personally verified for quality and production capacity.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
              <span className="text-3xl font-black">{loading ? '...' : stats.suppliers}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Suppliers</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
              <span className="text-3xl font-black">{loading ? '...' : stats.rfqs}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Daily RFQs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Categories</h2>
            <p className="text-slate-500 text-sm">Trending textile demands in Tirupur</p>
          </div>
          <Link to="/products" className="text-primary font-bold text-sm hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Knitted T-Shirts', icon: 'checkroom', slug: 'tshirt' },
            { name: 'Organic Fabrics', icon: 'eco', slug: 'other' },
            { name: 'Sportswear', icon: 'fitness_center', slug: 'sportswear' },
            { name: 'Infant Wear', icon: 'child_care', slug: 'kidswear' },
          ].map((cat) => (
            <Link 
              key={cat.name} 
              to={`/products?category=${cat.slug}`}
              className="bg-white p-6 rounded-2xl border border-slate-50 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {loading ? '...' : (stats.categories[cat.slug] || 0)} items
              </p>
            </Link>
          ))}
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="bg-white rounded-3xl p-6 lg:p-10 border border-slate-50 shadow-soft">
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Built for Global Scale</h2>
          <p className="text-slate-500 mt-3 text-sm lg:text-base">We bridge the gap between global buyers and India's finest garment manufacturers with technology.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Fast RFQ Response</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Get quotes within 24 hours from multiple manufacturers simultaneously.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Built-in inspection requests and verified production facility audits.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Direct Communication</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Secure chat system for negotiation and technical specification sharing.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
