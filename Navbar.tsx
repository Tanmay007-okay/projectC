import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Map, PieChart, Bell, LogIn, User, Plus, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const navLinks = [
    { name: 'Map', path: '/', icon: <Map size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <PieChart size={20} /> },
    { name: 'Report Issue', path: '/report', icon: <Plus size={20} />, highlighted: true },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <Bell className="h-8 w-8 text-blue-800" />
              <span className="ml-2 text-xl font-bold text-blue-800">CivicPulse</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  link.highlighted 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : isActive(link.path)
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="relative ml-4 flex items-center">
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full mr-2" 
                    />
                  ) : (
                    <User size={20} className="mr-2" />
                  )}
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="ml-4 px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-700 hover:bg-gray-100">
                    <Settings size={20} className="mr-2" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <LogIn size={20} className="mr-2" />
                <span>Login</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  link.highlighted 
                    ? 'bg-green-600 text-white' 
                    : isActive(link.path)
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeMenu}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  <User size={20} className="mr-3" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogIn size={20} className="mr-3" />
                  <span>Logout</span>
                </button>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <Settings size={20} className="mr-3" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={closeMenu}
              >
                <LogIn size={20} className="mr-3" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;