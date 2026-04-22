import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Users } from 'lucide-react';
import Button from '../common/Button';

const FactoryCard = ({ factory }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-2xl uppercase">
            {factory.companyName?.charAt(0) || 'F'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              {factory.companyName}
              {factory.isVerified && <ShieldCheck className="h-4 w-4 ml-1 text-green-500" fill="currentColor" />}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold text-gray-900 mr-2">{factory.rating || '4.5'}</span>
              <span>({factory.reviewCount || '24'} reviews)</span>
            </div>
          </div>
        </div>
        {factory.verificationBadge === 'premium' && (
          <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Premium
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Capacity</p>
          <p className="font-medium text-gray-900">{factory.productionCapacity || '50k units/mo'}</p>
        </div>
        <div>
          <p className="text-gray-500">Experience</p>
          <p className="font-medium text-gray-900">{factory.yearEstablished ? `${new Date().getFullYear() - factory.yearEstablished} Years` : '10+ Years'}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(factory.specializations || ['Knitted Garments', 'Cotton', 'Casual Wear']).map(spec => (
          <span key={spec} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
            {spec}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Link to={`/manufacturers/${factory._id}`}>
          <Button variant="secondary" className="w-full">View Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default FactoryCard;
