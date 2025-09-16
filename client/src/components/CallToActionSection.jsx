import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="mb-32">
      <div className="container mx-auto px-6">
        <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Start Watching?</h3>
          <p className="text-slate-300 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of movie lovers who trust FilmFlex for their entertainment needs.
          </p>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg">
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
