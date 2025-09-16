import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join FilmFlex
          </h2>
          <p className="text-gray-300">Create your account to start booking</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Enter your full name" 
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Enter your email" 
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Create a password" 
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="Confirm your password" 
            />
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" className="mr-3 rounded" />
            <span className="text-sm text-gray-300">
              I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
            </span>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
