import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToastStore } from '../store/toastStore';

const CreateRFQPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'T-Shirts',
    requiredQuantity: '',
    deliveryDeadline: '',
    targetPricePerUnit: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/rfqs', formData);
      addToast('Requirement posted successfully!', 'success');
      navigate('/home');
    } catch (error) {
      console.error('Error creating RFQ:', error);
      addToast(error.response?.data?.message || 'Failed to post requirement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setCategory = (category) => {
    setFormData({ ...formData, category });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Post New Requirement</h2>
        <p className="text-slate-500 text-lg mt-2 font-medium">Specify your textile needs and receive competitive quotes from verified manufacturers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-50 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Type */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Product Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'T-Shirts', icon: 'shirt' },
                    { id: 'Trousers', icon: 'apparel' },
                    { id: 'Shirts', icon: 'checkroom' },
                    { id: 'Kidswear', icon: 'child_care' },
                    { id: 'Innerwear', icon: 'layers' },
                    { id: 'Custom', icon: 'design_services' },
                  ].map((cat) => (
                    <button 
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all ${
                        formData.category === cat.id 
                          ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/10' 
                          : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl mb-2">{cat.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-tight">{cat.id}</span>
                    </button>
                  ))}
                </div>
                <input 
                  name="title"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                  placeholder={formData.category === 'Custom' ? "Enter your custom garment name..." : "Specific product details (e.g., Organic Cotton T-Shirt)"} 
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quantity & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Required Quantity</label>
                  <div className="relative">
                    <input 
                      name="requiredQuantity"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                      placeholder="0.00" 
                      type="number"
                      value={formData.requiredQuantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Delivery Deadline</label>
                  <input 
                    name="deliveryDeadline"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                    type="date"
                    value={formData.deliveryDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Estimated Budget (Optional)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    name="targetPricePerUnit"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium" 
                    placeholder="Max budget per unit" 
                    type="number"
                    value={formData.targetPricePerUnit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">Additional Specifications</label>
                <textarea 
                  name="description"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-sm font-medium min-h-[120px]" 
                  placeholder="Mention GSM, Width, Color, Finishing requirements..." 
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => addToast('RFQ saved as draft!', 'success')}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Save as Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary text-white font-black text-xs uppercase tracking-widest h-14 px-10 rounded-2xl shadow-lg shadow-primary/20 hover:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-indigo-600">lightbulb</span>
              <div>
                <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Expert Tip</p>
                <p className="text-sm text-indigo-700 mt-2 font-medium leading-relaxed">Providing a target budget helps suppliers send more accurate and competitive quotes within your price range.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-50 overflow-hidden">
            <div className="h-40 relative">
              <img src="https://images.unsplash.com/photo-1558278226-9fa105821c7a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Marketplace" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <p className="absolute bottom-4 left-6 text-white text-[10px] font-black uppercase tracking-widest">Live Activity</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500">Manufacturers Online</p>
                <p className="text-xs font-black text-primary">0</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-500">Avg. Response Time</p>
                <p className="text-xs font-black text-primary">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRFQPage;
