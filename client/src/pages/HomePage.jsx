import React from 'react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { Search } from 'lucide-react';
import NewlyReleasedMovies from '../components/NewlyReleasedMovies';
import HomeMoviesGrid from '../components/HomeMoviesGrid';
import Footer from '../components/Footer';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (value) => {
    setSearch(value);
    setShowSearchResults(value.trim().length > 0);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Hero Search Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Ultimate Movie Experience
            </h1>
            <p className="text-xl text-blue-50">Book your tickets and watch your favorite movies</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search movies, cities, theaters..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <p className="text-blue-50 text-sm mt-2 text-center">
              Search for movies by title, find shows by city or theater
            </p>
          </div>
        </div>
      </section>

      <main>
        {/* Show search results or newly released movies */}
        {showSearchResults ? (
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                Search Results for "{search}"
              </h2>
              <HomeMoviesGrid search={search} />
            </div>
          </section>
        ) : (
          <>
            {/* Newly Released Movies Section */}
            <NewlyReleasedMovies />

            {/* Upcoming Movies Section */}
            <section className="py-12 px-6 bg-slate-800">
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Running Movies in Your City</h2>
                <HomeMoviesGrid search="" />
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
