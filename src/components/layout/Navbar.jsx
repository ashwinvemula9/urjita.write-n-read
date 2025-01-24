import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import logo from "../../assets/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'RightDraw', href: '/right-draw' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-neutral-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-8">
          {/* Logo and Navigation Links */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-1">
                <img src={logo} alt="Logo" className="h-4 w-auto" />
                <span className="text-sm font-bold text-neutral-900">URJITA</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-4 sm:flex sm:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="hidden sm:ml-4 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none"
                >
                  <span>{user.role}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
                      >
                        <LogOut className="h-3 w-3 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-4 w-4" />
              ) : (
                <Menu className="block h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-b border-neutral-200">
          <div className="px-2 pt-1 pb-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-2 py-1 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-2 py-1 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 