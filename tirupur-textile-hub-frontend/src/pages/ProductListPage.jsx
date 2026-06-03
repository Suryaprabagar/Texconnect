import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import { useToastStore } from '../store/toastStore';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [gsmFilter, setGsmFilter] = useState('');
  const [sortBy, setSortBy] = useState('Sort by: Popularity');
  const addToast = useToastStore((state) => state.addToast);

  const categories = [
    { id: 'tshirt', name: 'T-Shirts' },
    { id: 'hoodie', name: 'Hoodies' },
    { id: 'polo', name: 'Polo Shirts' },
    { id: 'sportswear', name: 'Sportswear' },
    { id: 'kidswear', name: 'Kidswear' },
  ];

  const fetchProducts = async (term = '', cat = '', gsm = '', sortVal = '') => {
    setIsLoading(true);
    try {
      const params = {};
      if (cat) params.category = cat;
      if (term) params.q = term;
      
      if (gsm) {
        if (gsm === 'Under 100') {
          params.minGSM = 0;
          params.maxGSM = 100;
        } else if (gsm === '100 - 200') {
          params.minGSM = 100;
          params.maxGSM = 200;
        } else if (gsm === '200 - 300') {
          params.minGSM = 200;
          params.maxGSM = 300;
        } else if (gsm === '300+') {
          params.minGSM = 300;
          params.maxGSM = 9999;
        }
      }
      
      if (sortVal === 'Price: Low to High') {
        params.sortBy = 'price_asc';
      } else if (sortVal === 'Price: High to Low') {
        params.sortBy = 'price_desc';
      } else {
        params.sortBy = 'popular';
      }

      const response = await axios.get('/products', { params });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    addToast(`Sorting by: ${value}`, 'info');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleClearAll = () => {
    setCategory('');
    setGsmFilter('');
    setSearch('');
    setSortBy('Sort by: Popularity');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search, category, gsmFilter, sortBy);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, gsmFilter, sortBy]);

  return (
    <div className="flex gap-8">
      {/* Left Sidebar Filters */}
      <aside className="w-64 flex-shrink-0 hidden xl:block space-y-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            Filters
            <button className="text-primary text-xs font-bold" onClick={handleClearAll}>Clear All</button>
          </h3>
          
          <div className="space-y-3 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</p>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    checked={category === cat.id}
                    onChange={() => setCategory(category === cat.id ? '' : cat.id)}
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
                <button 
                  key={gsm} 
                  onClick={() => setGsmFilter(gsmFilter === gsm ? '' : gsm)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all active:scale-95 ${
                    gsmFilter === gsm
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary'
                  }`}
                >
                  {gsm}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-2">Pro Seller</p>
          <h4 className="text-lg font-bold mb-3 leading-tight">Join the Fastest Growing B2B Hub</h4>
          <button 
            onClick={() => addToast('Premium plans coming soon!', 'info')}
            className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs transition-transform active:scale-95 cursor-pointer"
          >
            Upgrade Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Browse Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">Showing {products.length} premium textile results</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary outline-none w-full sm:w-60"
            />
            <select 
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            >
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
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} onDelete={handleDeleteProduct} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">inventory_2</span>
                <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-xs">We couldn't find any products matching your criteria. Try clearing your filters or check back later.</p>
                <button 
                  onClick={handleClearAll}
                  className="mt-6 px-6 py-2 bg-primary text-white font-bold rounded-xl text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
