import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, X, User, ShoppingBag, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">TexConnect</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/products" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Products</Link>
              <Link to="/manufacturers" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Manufacturers</Link>
              <Link to="/rfqs" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">RFQs</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="p-1 rounded-full text-gray-400 hover:text-primary-600 focus:outline-none">
                  <MessageSquare className="h-6 w-6" />
                </Link>
                <div className="relative flex items-center space-x-3">
                  <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600">Dashboard</Link>
                  <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-700">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Products</Link>
            <Link to="/manufacturers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Manufacturers</Link>
            <Link to="/rfqs" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">RFQs</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50">Logout</button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
