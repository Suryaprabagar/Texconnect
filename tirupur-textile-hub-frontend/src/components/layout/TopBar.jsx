import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const [searchTerm, setSearchTerm] = useState('');

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 lg:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md z-40">
      <div className="flex items-center justify-between px-4 lg:px-8 h-full gap-4">
        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="absolute inset-0 bg-white z-50 flex items-center px-4 animate-in slide-in-from-top duration-200">
            <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 mr-2 text-slate-400">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <input 
              autoFocus
              className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Search fabrics, manufacturers..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button 
              onClick={() => handleSearch({ key: 'Enter' })}
              className="ml-2 p-2 text-primary"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-black text-slate-900 tracking-tighter">Texconnect</h1>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all outline-none" 
              placeholder="Search fabrics, manufacturers..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button 
            onClick={() => addToast('No new notifications', 'info')}
            className="hover:bg-slate-50 rounded-full p-2 transition-colors relative"
          >
            <span className="material-symbols-outlined text-slate-600">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name?.split(' ')[0] || 'Guest'}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role || 'Visitor'}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-primary/10 border-2 border-white shadow-sm flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.[0] || '?'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
