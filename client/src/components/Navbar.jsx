import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ isLoggedIn = false, userName = '' }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setUserAuthenticated(true);
      try {
        setUserInfo(JSON.parse(user));
      } catch (err) {
        console.error('Error parsing user info:', err);
      }
    } else {
      setUserAuthenticated(false);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserAuthenticated(false);
    setUserInfo(null);
    navigate('/');
  };

  return (
    <nav className="bg-slate-800 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
            FilmFlex
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {userAuthenticated ? (
              <>
                <span className="text-gray-300 text-sm">Welcome, {userInfo?.name || 'User'}</span>
                <Link to="/customer/profile" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Link to="/customer/booking-history" className="hover:text-blue-400 transition-colors">
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/loginUser" className="hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/registerUser" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
                <Link to="/loginAdmin" className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-sm transition-colors">
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4 space-y-4">
            {userAuthenticated ? (
              <>
                <div className="text-gray-300 text-sm px-2">
                  Welcome, {userInfo?.name || 'User'}
                </div>
                <Link
                  to="/customer/profile"
                  className="block px-2 hover:text-blue-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/customer/booking-history"
                  className="block px-2 hover:text-blue-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-2 bg-red-600 hover:bg-red-700 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/loginUser"
                  className="block px-2 hover:text-blue-400 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/registerUser"
                  className="block px-2 bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/loginAdmin"
                  className="block px-2 bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
