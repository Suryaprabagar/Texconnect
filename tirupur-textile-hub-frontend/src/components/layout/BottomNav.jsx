import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isManufacturer = user?.role === 'manufacturer';

  const navItems = isManufacturer ? [
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Leads', path: '/dashboard/manufacturer', icon: 'ads_click' },
    { name: 'Add', path: '/products/add', icon: 'add_circle' },
    { name: 'Chat', path: '/messages', icon: 'chat' },
  ] : [
    { name: 'Home', path: '/home', icon: 'home' },
    { name: 'Market', path: '/products', icon: 'storefront' },
    { name: 'RFQ', path: '/rfqs/create', icon: 'add_box' },
    { name: 'Chat', path: '/messages', icon: 'chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around px-2 py-2 z-50 lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isActive ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
