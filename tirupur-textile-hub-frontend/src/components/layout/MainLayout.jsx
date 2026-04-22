import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-bright">
      <Sidebar />
      <TopBar />
      <main className="lg:ml-64 pt-24 pb-12 px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
