import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;
      
      setAuth(user, accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Texconnect</h1>
        <p className="text-sm text-slate-500 mt-1">Access your B2B textile workspace</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-soft w-full max-w-[420px] border border-slate-50">
        <h2 className="text-xl font-bold text-on-surface mb-6">Log in</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-300 text-sm" 
                placeholder="name@company.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
              <Link className="text-[10px] font-bold text-primary hover:underline" to="/forgot-password">Forgot?</Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-300 text-sm" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" id="remember" type="checkbox"/>
            <label className="text-xs text-slate-600 cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
          </div>

          <button 
            className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account? <Link className="text-primary font-bold hover:underline" to="/register">Sign up</Link>
          </p>
        </div>
      </div>
      
      {/* Trust Elements */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">language</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Global Supply Chain</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
