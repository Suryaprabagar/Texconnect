import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import EmptyState from '../components/common/EmptyState';
import axios from '../api/axios';

const BuyerDashboard = () => {
  const { user, logout } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const [myRfqs, setMyRfqs] = useState([]);
  const [rfqCount, setRfqCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/rfqs');
        const rfqs = response.data.data.rfqs || [];
        setMyRfqs(rfqs);
        setRfqCount(rfqs.length);
      } catch (error) {
        console.error('Error fetching RFQ count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const activities = myRfqs.map(rfq => ({
    id: rfq._id,
    icon: 'request_quote',
    color: 'primary',
    title: `Posted RFQ: ${rfq.title}`,
    desc: `${rfq.requiredQuantity} units of ${rfq.category}`,
    time: new Date(rfq.createdAt).toLocaleDateString(),
    status: rfq.status
  }));

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h2>
          <p className="text-slate-500 text-base lg:text-lg mt-1 font-medium">Here's what's happening with your business today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Link to="/products" className="flex-1 lg:flex-none h-11 lg:h-12 px-4 lg:px-6 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm text-xs lg:text-sm whitespace-nowrap">
            <span className="material-symbols-outlined mr-2 text-xl">explore</span>
            Marketplace
          </Link>
          <Link to="/rfqs/create" className="flex-1 lg:flex-none h-11 lg:h-12 px-4 lg:px-6 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center transform active:scale-95 text-xs lg:text-sm whitespace-nowrap">
            <span className="material-symbols-outlined mr-2 text-xl">add_circle</span>
            Post RFQ
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-primary group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary">request_quote</span>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+0%</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active RFQs</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">
              {isLoading ? '...' : rfqCount}
            </h3>
            <span className="text-xs text-slate-400 font-medium">Requests</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-orange-400 group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <span className="material-symbols-outlined text-orange-600">forum</span>
            </div>
            <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Unread Chats</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">0</h3>
            <span className="text-xs text-slate-400 font-medium">New alerts</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft border-l-4 border-emerald-400 group hover:translate-y-[-4px] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="material-symbols-outlined text-emerald-600">inventory_2</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Orders</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-slate-900">0</h3>
            <span className="text-xs text-slate-400 font-medium">In progress</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-slate-50 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
              <button 
                onClick={() => addToast('Activity history coming soon!', 'info')}
                className="text-primary text-xs font-bold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {activities.length > 0 ? activities.map((activity) => (
                <Link 
                  key={activity.id} 
                  to={`/rfqs/${activity.id}`}
                  className="px-8 py-5 flex items-center hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${activity.color}-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined text-${activity.color}-600`}>{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-bold text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{activity.desc}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{activity.time}</p>
                    <span className={`inline-block px-2 py-1 bg-${activity.color}-100 text-${activity.color}-700 text-[10px] font-black rounded uppercase mt-1`}>
                      {activity.status}
                    </span>
                  </div>
                </Link>
              )) : (
                <EmptyState 
                  title="No Recent Activity" 
                  description="Your recent actions, orders, and chats will appear here." 
                  icon="history"
                  actionText="Post an RFQ"
                  actionLink="/rfqs/create"
                />
              )}
            </div>
          </div>
        </section>

        {/* Side Panel */}
        <aside className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
            <h3 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest">Account</h3>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined">logout</span>
              Log Out
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BuyerDashboard;
