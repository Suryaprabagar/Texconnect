import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import FactoryCard from '../components/manufacturer/FactoryCard';

const ManufacturerListPage = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchManufacturers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/manufacturers');
      setManufacturers(response.data.data.manufacturers);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      // No mock manufacturers as requested
      setManufacturers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Manufacturers</h1>
          <p className="text-slate-500 text-lg mt-1 font-medium">Direct sourcing from India's premium knitwear factories.</p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium shadow-soft" 
            placeholder="Search factories by name or category..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {manufacturers.map(factory => (
            <FactoryCard key={factory._id} factory={factory} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManufacturerListPage;
