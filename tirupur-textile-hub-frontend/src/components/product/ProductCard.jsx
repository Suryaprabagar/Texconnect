import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Package } from 'lucide-react';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48 relative">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{product.category}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">₹{product.pricePerUnit}</p>
            <p className="text-xs text-gray-500">per unit</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Package className="h-4 w-4 mr-1" />
          <span>MOQ: {product.moq} pieces</span>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{product.manufacturerId?.companyName || 'Anonymous Manufacturer'}</span>
        </div>

        <div className="mt-6">
          <Link to={`/products/${product._id}`}>
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
