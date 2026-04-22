import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import FactoryCard from '../components/manufacturer/FactoryCard';
import Input from '../components/common/Input';
import { Search } from 'lucide-react';

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
      // Mock data
      setManufacturers([
        { _id: '1', companyName: 'Oceanic Textiles', isVerified: true, verificationBadge: 'premium', rating: 4.8 },
        { _id: '2', companyName: 'Royal Knits', isVerified: true, verificationBadge: 'none', rating: 4.5 },
        { _id: '3', companyName: 'Sun Garments', isVerified: false, verificationBadge: 'none', rating: 4.2 },
        { _id: '4', companyName: 'PureCotton Pvt Ltd.', isVerified: true, verificationBadge: 'premium', rating: 4.9 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Verified Manufacturers</h1>
          <p className="mt-2 text-gray-600">Connect with the industry leaders direct from Tirupur.</p>
        </div>
        
        <div className="mt-4 md:mt-0 relative">
          <Input 
            placeholder="Search manufacturers..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
