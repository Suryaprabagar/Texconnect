import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'tshirt',
    pricePerUnit: '',
    moq: '',
    description: '',
    fabricType: '',
    gsm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/products', formData);
      navigate('/dashboard/manufacturer');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h2>
        <p className="text-slate-500 text-lg mt-2 font-medium">List your premium garments to reach verified sourcing agents.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-50 p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Product Name</label>
              <input 
                name="name"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                placeholder="e.g. Mens Black Crewneck T-shirt" 
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Category</label>
              <select
                name="category"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium appearance-none"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="tshirt">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="polo">Polo</option>
                <option value="formal">Formal Wear</option>
                <option value="sportswear">Sportswear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Base Price (per unit)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  name="pricePerUnit"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                  type="number"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Min. Order Quantity (MOQ)</label>
              <input 
                name="moq"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                type="number"
                value={formData.moq}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Fabric Type</label>
              <input 
                name="fabricType"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                placeholder="e.g. Sinker, Pique, Interlock" 
                type="text"
                value={formData.fabricType}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">GSM</label>
              <input 
                name="gsm"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                placeholder="e.g. 180" 
                type="number"
                value={formData.gsm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Description</label>
            <textarea 
              name="description"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium min-h-[120px]" 
              placeholder="Detail your product features, sizing, composition..." 
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary text-white font-black text-xs uppercase tracking-widest h-14 px-10 rounded-2xl shadow-lg shadow-primary/20 hover:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
