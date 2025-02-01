import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.svg";
import Logo from "../Images/logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Add ref for the profile dropdown container
  const profileRef = useRef(null);

  // Add effect to handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "RightDraw", href: "/right-draw" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="backdrop-blur-md w-full z-50 text-neutral-50 fixed top-0">
      <div className="bg-neutral-900/90 border-b border-neutral-800 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)] mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-10">
          {/* Logo and Navigation Links */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-1 w-[60px] hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                <Logo fill="#fff" />
              </Link>
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="hidden sm:ml-4 sm:flex sm:items-center">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium text-neutral-100 
                    bg-neutral-800/40 hover:bg-neutral-800/80 shadow-sm hover:shadow-md 
                    transition-all duration-200 focus:outline-none border border-neutral-700/50"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>{user.full_name}</span>
                  <ChevronDown className="h-3 w-3 text-neutral-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-1 w-48 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-neutral-900/95 
                    backdrop-blur-lg ring-1 ring-white/10 transform opacity-100 scale-100 transition-all duration-200"
                  >
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-1.5 text-sm text-neutral-300 
                          hover:bg-neutral-800/80 transition-colors duration-150 group"
                      >
                        <LogOut className="h-3 w-3 mr-2 text-neutral-500 group-hover:text-red-400 transition-colors" />
                        <span className="group-hover:text-red-400 transition-colors">
                          Sign out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md
                  text-white bg-primary-600/90 hover:bg-primary-600 shadow-sm hover:shadow-primary-600/20
                  transition-all duration-200 hover:-translate-y-0.5"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1 rounded-md text-neutral-100 
                hover:bg-neutral-800/80 shadow-sm hover:shadow-md transition-all duration-200 
                focus:outline-none active:scale-95"
            >
              {isOpen ? (
                <X className="block h-3 w-3" />
              ) : (
                <Menu className="block h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="sm:hidden bg-neutral-900/95 border-b border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          backdrop-blur-lg animate-fadeIn"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 
                  ${
                    isActive(item.href)
                      ? "text-white bg-primary-600/90 shadow-md"
                      : "text-neutral-300 hover:text-white hover:bg-neutral-800/80 hover:shadow-sm"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-1.5 text-sm font-medium text-neutral-300 
                  hover:text-red-400 hover:bg-neutral-800/80 rounded-md transition-all duration-200 
                  hover:shadow-sm group"
              >
                <LogOut className="h-3 w-3 mr-2 group-hover:text-red-400 transition-colors" />
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-1.5 rounded-md text-sm font-medium text-white 
                  bg-primary-600/90 hover:bg-primary-600 shadow-md hover:shadow-lg 
                  transition-all duration-200 hover:-translate-y-0.5"
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
