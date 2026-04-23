import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeHero from '../assets/welcome_pg.jpg';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={WelcomeHero} 
          className="w-full h-full object-cover opacity-60 scale-105"
          alt="Textile Hub"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-primary/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 py-20 flex flex-col items-center text-center">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-2">Texconnect</h1>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight max-w-4xl mb-8">
          Revolutionizing Tirupur's <br className="hidden md:block" />
          <span className="text-primary">Global Textile</span> Trade.
        </h2>

        <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed">
          The most advanced B2B marketplace connecting verified manufacturers with global sourcing agents. Quality, transparency, and speed at your fingertips.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            to="/register" 
            className="group relative px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="material-symbols-outlined">how_to_reg</span>
            JOIN THE NETWORK
          </Link>
          
          <Link 
            to="/login" 
            className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-black rounded-2xl border border-white/20 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <span className="material-symbols-outlined">login</span>
            LOG IN TO PORTAL
          </Link>
        </div>

        {/* Floating Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">verified</span>
            <div className="text-left">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Verified</p>
              <p className="text-xs font-bold text-slate-400">Manufacturers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">bolt</span>
            <div className="text-left">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Express</p>
              <p className="text-xs font-bold text-slate-400">RFQ Response</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">shield_with_heart</span>
            <div className="text-left">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Secure</p>
              <p className="text-xs font-bold text-slate-400">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;
