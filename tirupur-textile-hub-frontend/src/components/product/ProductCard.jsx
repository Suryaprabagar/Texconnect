import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col overflow-hidden border border-slate-50">
      <div className="aspect-[4/5] relative overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'} 
          alt={product.name}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800">
            {product.category || 'Apparel'}
          </span>
        </div>
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined text-lg">favorite</span>
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <p className="text-xs font-medium text-slate-500 truncate">
            {product.manufacturerId?.companyName || 'Verified Manufacturer'}
          </p>
          <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors mb-3 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-baseline">
            <p className="text-lg font-bold text-primary">
              ₹{product.pricePerUnit}
              <span className="text-xs text-slate-400 font-normal ml-1">/unit</span>
            </p>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-3 border-t border-slate-50 uppercase tracking-tight">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              MOQ: {product.moq}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">speed</span>
              {product.leadTime || '7'} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
