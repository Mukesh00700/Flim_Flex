import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-800 text-white py-16 mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">FilmFlex</h3>
            <p className="text-slate-300 mb-4 max-w-md">
              Your premier destination for movie ticket booking. Experience the magic of cinema with ease and convenience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-colors">
                <span className="text-blue-400">📘</span>
              </a>
              <a href="#" className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-colors">
                <span className="text-blue-400">🐦</span>
              </a>
              <a href="#" className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-colors">
                <span className="text-blue-400">📷</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Now Showing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Coming Soon</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Theaters</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Offers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 FilmFlex. All rights reserved. Made with ❤️ for movie lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
