import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Loader } from 'lucide-react';

const NewlyReleasedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/movies/getMovies');
        if (!response.ok) {
          throw new Error(`Failed to fetch movies: ${response.status}`);
        }
        const data = await response.json();
        
        // Sort by release date descending (newest first)
        const sortedMovies = [...data].sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB - dateA;
        });
        
        // Take only the 8 newest movies
        setMovies(sortedMovies.slice(0, 8));
      } catch (err) {
        console.error('Error fetching newly released movies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewMovies();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Newly Released Movies</h2>
          <div className="flex justify-center items-center py-12">
            <Loader size={32} className="animate-spin text-blue-400" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Newly Released Movies</h2>
          <div className="text-center py-8 text-gray-400">
            <p>Unable to load movies. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Newly Released Movies</h2>
          <div className="text-center py-8 text-gray-400">
            <p>No movies available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-slate-900">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Newly Released Movies</h2>
          <Link to="/movies" className="text-blue-400 hover:text-blue-300 transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewlyReleasedMovies;
