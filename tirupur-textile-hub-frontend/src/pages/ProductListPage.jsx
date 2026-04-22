import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/product/ProductCard';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('');

  const categories = [
    { id: 'organic', name: 'Organic Cotton' },
    { id: 'linen', name: 'Premium Linen' },
    { id: 'polyester', name: 'Recycled Polyester' },
    { id: 'silk', name: 'Silk Blend' },
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/products', {
        params: { category }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for demo
      setProducts([
        { _id: '1', name: 'Supima Combed Organic Cotton Jersey 180 GSM', pricePerUnit: 450, moq: 500, category: 'Organic', leadTime: 4 },
        { _id: '2', name: 'European Heavyweight Pre-Washed Linen', pricePerUnit: 890, moq: 200, category: 'Sustainable', leadTime: 7 },
        { _id: '3', name: 'Mulberry Silk Charmeuse 19mm - 60" Width', pricePerUnit: 1850, moq: 100, category: 'Premium', leadTime: 12 },
        { _id: '4', name: 'Recycled PET Moisture Wicking Athletic Mesh', pricePerUnit: 320, moq: 1000, category: 'Recycled', leadTime: 5 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div className="flex gap-8">
      {/* Left Sidebar Filters */}
      <aside className="w-64 flex-shrink-0 hidden xl:block space-y-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            Filters
            <button className="text-primary text-xs font-bold" onClick={() => setCategory('')}>Clear All</button>
          </h3>
          
          <div className="space-y-3 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fabric Type</p>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={category === cat.id}
                    onChange={() => setCategory(cat.id)}
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GSM (Weight)</p>
            <div className="flex flex-wrap gap-2">
              {['Under 100', '100 - 200', '200 - 300', '300+'].map(gsm => (
                <button key={gsm} className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold hover:border-primary hover:text-primary transition-all">
                  {gsm}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-2">Pro Seller</p>
          <h4 className="text-lg font-bold mb-3 leading-tight">Reach 50k+ Sourcing Agents</h4>
          <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs transition-transform active:scale-95">
            Upgrade Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Browse Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">Showing {products.length} premium textile results</p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary outline-none">
              <option>Sort by: Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
