import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">
          FilmFlex
        </h1>
        <ul className="flex space-x-6">
          <li><a href="#movies" className="hover:text-blue-400 transition-colors">Movies</a></li>
          <li><a href="#reviews" className="hover:text-blue-400 transition-colors">Reviews</a></li>
          <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
          <li><Link to="/loginUser" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">Login</Link></li>
          <li><Link to="/registerAdmin" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">SignUp as Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
