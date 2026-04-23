import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/auth/register', formData);
      const { user, accessToken, refreshToken } = response.data.data;
      
      setAuth(user, accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      addToast('Account created successfully!', 'success');
      
      // Role-based redirection
      if (user.role === 'manufacturer') {
        navigate('/dashboard/manufacturer');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Texconnect</h1>
        <p className="text-sm text-slate-500 mt-1">Join thousands of industry professionals</p>
      </div>

      <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-soft w-full max-w-[460px] border border-slate-50">
        <h2 className="text-xl font-bold text-on-surface mb-6">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-4 text-center border rounded-xl transition-all ${
                  formData.role === 'buyer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined block mb-1">shopping_cart</span>
                <span className="text-xs font-bold">Buyer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('manufacturer')}
                className={`p-4 text-center border rounded-xl transition-all ${
                  formData.role === 'manufacturer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined block mb-1">factory</span>
                <span className="text-xs font-bold">Manufacturer</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
              <input 
                name="name"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" 
                placeholder="First and last name" 
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
              <input 
                name="email"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" 
                placeholder="name@company.com" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Set Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">vpn_key</span>
              <input 
                name="password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm" 
                placeholder="Min. 8 characters" 
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          </div>

          <button 
            className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              'Get Started'
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
          By joining, you agree to Texconnect's <Link className="underline" to="/terms">Terms of Service</Link> and <Link className="underline" to="/privacy">Privacy Policy</Link>.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link className="text-primary font-bold hover:underline" to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
