import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Marketplace', path: '/products', icon: 'storefront' },
    { name: 'Post Requirement', path: '/rfqs/create', icon: 'add_box' },
    { name: 'Messages', path: '/messages', icon: 'chat' },
    { name: 'Profile', path: '/dashboard', icon: 'account_circle' },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-slate-100 bg-white shadow-[4px_0_12px_rgba(0,0,0,0.05)] z-50 hidden lg:block">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Texconnect</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">B2B Textile Marketplace</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-primary/5'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-xs font-medium text-slate-500">Need help?</p>
            <Link to="/support" className="text-xs text-primary font-bold mt-1 block hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
