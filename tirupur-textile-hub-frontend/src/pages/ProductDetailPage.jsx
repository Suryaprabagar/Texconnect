import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useToastStore } from '../store/toastStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data.data.product);
      } catch (error) {
        console.error('Error fetching product details:', error);
        addToast('Failed to load product details', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <Link to="/products" className="text-primary font-bold mt-4 inline-block">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <nav className="flex text-sm font-medium text-slate-400 gap-2">
        <Link to="/home" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">Marketplace</Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft">
            <img 
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.slice(1, 5).map((img, i) => (
              <div key={i} className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <img src={img} className="w-full h-full object-cover" alt="Product view" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              {product.isFeatured && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-amber-100">
                  <span className="material-symbols-outlined text-xs">grade</span>
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">factory</span>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {product.manufacturerId?.companyName || 'Verified Supplier'}
                </p>
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 mb-8">
            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-4xl font-black text-slate-900">₹{product.pricePerUnit}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">/ Unit (Ex-Factory)</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minimum Order</p>
                <p className="text-lg font-bold text-slate-900">{product.moq} Units</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Time</p>
                <p className="text-lg font-bold text-slate-900">{product.leadTime || '15-20'} Days</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <button 
              onClick={() => addToast('Quote request feature coming soon!', 'info')}
              className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">request_quote</span>
              REQUEST A QUOTE
            </button>
            <Link 
              to="/messages"
              className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">chat</span>
              CHAT WITH MANUFACTURER
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium">Fabric Type</span>
                <span className="text-xs text-slate-900 font-bold">{product.fabricType || 'Cotton'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium">GSM / Weight</span>
                <span className="text-xs text-slate-900 font-bold">{product.gsm || '180'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium">Sizes Available</span>
                <span className="text-xs text-slate-900 font-bold">{product.availableSizes?.join(', ') || 'S, M, L, XL'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-slate-500 font-medium">Sample Policy</span>
                <span className="text-xs text-slate-900 font-bold">{product.sampleAvailable ? `Available (₹${product.sampleCost})` : 'Not Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Manufacturer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4">Product Description</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {product.description || 'No detailed description provided for this product. Please contact the manufacturer for technical specifications and customization options.'}
            </p>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">About Manufacturer</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <img src={product.manufacturerId?.logoUrl || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=100'} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{product.manufacturerId?.companyName || 'Verified Factory'}</h4>
                <div className="flex items-center gap-1 mt-1 text-primary">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Supplier</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400">Response Rate</span>
                <span className="text-slate-900 font-bold">98%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400">Total Orders</span>
                <span className="text-slate-900 font-bold">150+</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400">Location</span>
                <span className="text-slate-900 font-bold">Tirupur, India</span>
              </div>
            </div>
            <Link 
              to="/manufacturers"
              className="block w-full py-4 bg-slate-900 text-white text-center font-bold rounded-2xl hover:bg-slate-800 transition-all text-xs"
            >
              VIEW PROFILE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
