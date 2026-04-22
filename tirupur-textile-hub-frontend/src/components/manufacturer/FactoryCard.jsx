import React from 'react';
import { Link } from 'react-router-dom';

const FactoryCard = ({ factory }) => {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-50 p-8 hover:shadow-hover transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl uppercase group-hover:bg-primary group-hover:text-white transition-all">
            {factory.companyName?.charAt(0) || 'F'}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              {factory.companyName}
              {factory.isVerified && <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
            </h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-yellow-400">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="text-sm font-bold text-slate-900 ml-1">{factory.rating || '4.8'}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase ml-2">({factory.reviewCount || '24'} reviews)</span>
            </div>
          </div>
        </div>
        {factory.verificationBadge === 'premium' && (
          <span className="bg-indigo-50 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/10">
            Premium
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-50 mb-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
          <p className="text-sm font-bold text-slate-700">{factory.productionCapacity || '50k units/mo'}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Established</p>
          <p className="text-sm font-bold text-slate-700">{factory.yearEstablished || '2012'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(factory.specializations || ['Knitted Garments', 'Organic Cotton']).map(spec => (
          <span key={spec} className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tight">
            {spec}
          </span>
        ))}
      </div>

      <Link to={`/manufacturers/${factory._id}`}>
        <button className="w-full h-12 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary transition-all shadow-lg shadow-slate-900/10 hover:shadow-primary/20">
          View Factory Profile
        </button>
      </Link>
    </div>
  );
};

export default FactoryCard;
