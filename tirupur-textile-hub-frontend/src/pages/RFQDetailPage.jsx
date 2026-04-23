import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

const RFQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rfq, setRfq] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const [quoteForm, setQuoteForm] = useState({
    pricePerUnit: '',
    quantity: '',
    message: ''
  });

  useEffect(() => {
    const fetchRFQ = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/rfqs/${id}`);
        setRfq(response.data.data.rfq);
        setQuoteForm(prev => ({ ...prev, quantity: response.data.data.rfq.requiredQuantity }));
        
        // If user is buyer, fetch quotes
        if (user?.role === 'buyer' || user?._id === response.data.data.rfq.buyerId?._id) {
          const quotesRes = await axios.get(`/quotes/rfq/${id}`);
          setQuotes(quotesRes.data.data.quotes);
        }
      } catch (error) {
        console.error('Error fetching RFQ details:', error);
        addToast('Failed to load RFQ details', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRFQ();
  }, [id, user]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (user?.role !== 'manufacturer') {
      addToast('Only manufacturers can submit quotes', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/quotes', {
        rfqId: id,
        ...quoteForm
      });
      addToast('Quote submitted successfully!', 'success');
      navigate('/dashboard/manufacturer');
    } catch (error) {
      console.error('Error submitting quote:', error);
      addToast('Failed to submit quote', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">RFQ Not Found</h2>
        <Link to="/dashboard/manufacturer" className="text-primary font-bold mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <nav className="flex text-sm font-medium text-slate-400 gap-2">
        <Link to={user?.role === 'manufacturer' ? "/dashboard/manufacturer" : "/dashboard"} className="hover:text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-900">RFQ: {rfq.rfqNumber}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-8 lg:p-12 border-b border-slate-50 flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                {rfq.category}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                {rfq.status}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">{rfq.title}</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span>
              Requested by {rfq.buyerId?.name || 'Verified Buyer'}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6 min-w-[240px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requirement Summary</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Quantity</span>
                <span className="text-sm font-black text-slate-900">{rfq.requiredQuantity} Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Target Price</span>
                <span className="text-sm font-black text-primary">₹{rfq.targetPrice}/unit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Deadline</span>
                <span className="text-sm font-black text-slate-900">{new Date(rfq.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Project Description</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {rfq.description}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Technical Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs">
                    <span className="text-slate-500">Fabric Preference</span>
                    <span className="text-slate-900 font-bold">{rfq.fabricPreference || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs">
                    <span className="text-slate-500">GSM Requirement</span>
                    <span className="text-slate-900 font-bold">{rfq.gsmPreference || 'Standard'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs">
                    <span className="text-slate-500">Sampling Needed</span>
                    <span className="text-slate-900 font-bold">Yes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-50 text-xs">
                    <span className="text-slate-500">Delivery Location</span>
                    <span className="text-slate-900 font-bold">{rfq.shippingAddress?.city || 'Tirupur'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quotes Section for Buyers */}
            {user?.role === 'buyer' && (
              <section className="pt-10 border-t border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6">Quotes Received ({quotes.length})</h3>
                <div className="space-y-4">
                  {quotes.length > 0 ? quotes.map(quote => (
                    <div key={quote._id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-soft flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{quote.manufacturerId?.name}</p>
                        <p className="text-xs text-slate-500 mt-1">₹{quote.pricePerUnit}/unit • Total: ₹{quote.totalAmount}</p>
                      </div>
                      <Link to="/messages" className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg">CONTACT</Link>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400">No quotes received yet.</p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Quote Form for Manufacturers */}
          {user?.role === 'manufacturer' && (
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-8">
                <h3 className="text-lg font-bold mb-6">Submit Your Quote</h3>
                <form onSubmit={handleSubmitQuote} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Price Per Unit (₹)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none" 
                      placeholder="e.g. 150"
                      value={quoteForm.pricePerUnit}
                      onChange={(e) => setQuoteForm({...quoteForm, pricePerUnit: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Quantity</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none" 
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({...quoteForm, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Message to Buyer</label>
                    <textarea 
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none h-24 resize-none" 
                      placeholder="Describe your production capability..."
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SEND QUOTE'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQDetailPage;
