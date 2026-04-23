import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title = "No data found", 
  description = "There are no items to display at the moment.", 
  icon = "inventory_2", 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-slate-300 text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">
        {description}
      </p>
      {actionText && actionLink && (
        <Link 
          to={actionLink}
          className="bg-primary text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-95 transition-all"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
