import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const MainLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Sidebar - Desktop and Mobile */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* TopBar */}
      <TopBar onMenuClick={toggleMobileMenu} />
      
      <main className="lg:ml-64 pt-20 lg:pt-24 pb-24 lg:pb-12 px-4 lg:px-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
