import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <header className="min-h-screen flex items-center justify-center text-center text-white bg-slate-800 relative">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-blue-400">
          Welcome to FilmFlex
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your ultimate destination for booking movie tickets. Experience cinema like never before!
        </p>
        <div className="flex gap-6 justify-center flex-wrap">
          <button className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg">
            Browse Movies
          </button>
          <Link to="/register" className="border-2 border-blue-400 hover:bg-blue-600 hover:border-blue-600 px-10 py-4 rounded-full text-xl font-semibold transition-all">
            Sign Up
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#movies" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </header>
  );
};

export default HeroSection;
