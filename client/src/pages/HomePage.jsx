import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MoviesSection from '../components/MoviesSection';
import ReviewsSection from '../components/ReviewsSection';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <HeroSection />
      <main className="py-24">
        <MoviesSection />
        <ReviewsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
