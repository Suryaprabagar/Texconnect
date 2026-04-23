import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToastStore } from '../store/toastStore';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'tshirt',
    pricePerUnit: '',
    moq: '',
    description: '',
    fabricType: '',
    fabricComposition: '',
    gsm: '',
    availableSizes: [],
    colors: '',
    images: [],
  });
  const addToast = useToastStore((state) => state.addToast);
  const [previews, setPreviews] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'availableSizes' && key !== 'colors') {
        data.append(key, formData[key]);
      }
    });
    
    // Append sizes as multiple entries for multer to pick up as array
    formData.availableSizes.forEach(size => {
      data.append('availableSizes', size);
    });

    // Handle colors - split by comma and trim
    if (formData.colors) {
      const colorArray = formData.colors.split(',').map(c => c.trim()).filter(c => c !== '');
      colorArray.forEach(color => {
        data.append('colors', color);
      });
    }
    
    productImages.forEach(file => {
      data.append('images', file);
    });

    try {
      await axios.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      addToast('Product added successfully!', 'success');
      navigate('/dashboard/manufacturer');
    } catch (error) {
      console.error('Error adding product:', error);
      addToast(error.response?.data?.message || 'Failed to add product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProductImages([...productImages, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newImages = productImages.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setProductImages(newImages);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.availableSizes];
    if (currentSizes.includes(size)) {
      setFormData({ ...formData, availableSizes: currentSizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, availableSizes: [...currentSizes, size] });
    }
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
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Fabric Composition</label>
              <input 
                name="fabricComposition"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                placeholder="e.g. 100% Cotton, 60/40 Blended" 
                type="text"
                value={formData.fabricComposition}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Available Colors</label>
              <input 
                name="colors"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                placeholder="e.g. Black, White, Navy Blue" 
                type="text"
                value={formData.colors}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Available Sizes</label>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    formData.availableSizes.includes(size)
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Product Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-100 group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">add_photo_alternate</span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary uppercase tracking-widest">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">PNG, JPG or WebP. Max 5MB per file.</p>
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
