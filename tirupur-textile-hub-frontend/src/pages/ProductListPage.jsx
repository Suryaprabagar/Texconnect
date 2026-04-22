import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/product/ProductCard';
import Input from '../components/common/Input';
import { Search, Filter } from 'lucide-react';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'tshirt', 'hoodie', 'kidswear', 'polo', 'formal', 'sportswear', 'innerwear', 'ethnic', 'denim', 'jacket', 'other'
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/products', {
        params: { q: search, category }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data for demo if backend is not available
      setProducts([
        { _id: '1', name: 'Premium Cotton T-Shirt', pricePerUnit: 150, moq: 100, category: 'tshirt', isFeatured: true },
        { _id: '2', name: 'Hooded Sweatshirt', pricePerUnit: 450, moq: 50, category: 'hoodie' },
        { _id: '3', name: 'Kids Organic Wear', pricePerUnit: 250, moq: 200, category: 'kidswear' },
        { _id: '4', name: 'Classic Polo Shirt', pricePerUnit: 220, moq: 100, category: 'polo' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Browse Products</h1>
          <p className="mt-2 text-gray-600">Find the best garment manufacturers in Tirupur.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="relative">
            <Input 
              placeholder="Search products..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full md:w-64"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
