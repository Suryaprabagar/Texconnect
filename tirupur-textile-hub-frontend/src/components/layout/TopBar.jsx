import React from 'react';
import { useAuthStore } from '../../store/authStore';

const TopBar = () => {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md z-40">
      <div className="flex items-center justify-between px-8 h-full">
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary transition-all outline-none" 
              placeholder="Search fabrics, manufacturers, or GSM..." 
              type="text"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hover:bg-slate-50 rounded-full p-2 transition-colors relative">
            <span className="material-symbols-outlined text-slate-600">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface">{user?.name || 'Guest'}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'Visitor'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary font-bold">
              {user?.name?.[0] || '?'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
