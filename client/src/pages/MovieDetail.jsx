import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronLeft, Clock, MapPin, Users, Loader } from 'lucide-react';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get next 7 days for date selection
  const getDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().slice(0, 10));
    }
    return dates;
  };

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);

    // Fetch movie info
    fetch(`http://localhost:3000/movies/getMovies`)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch: ${r.status}`);
        return r.json();
      })
      .then(data => {
        const found = data.find(m => String(m.id) === String(movieId));
        if (found) {
          setMovie(found);
        } else {
          setError('Movie not found');
        }
      })
      .catch(e => {
        console.error('Error fetching movie:', e);
        setError('Failed to load movie details');
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Back Button & Movie Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-6 px-6 border-b border-slate-700">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{movie?.title || 'Loading...'}</h1>
            <p className="text-gray-400 mb-1">
              {movie?.genre && `Genre: ${movie.genre}`}
            </p>
            <p className="text-gray-400">
              {movie?.description && `${movie.description.substring(0, 100)}...`}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        {/* Movie Details Section */}
        {movie && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Poster */}
            <div>
              <img
                src={movie.posterImage || '/movie-placeholder.jpg'}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-400 mb-6 text-lg">{movie.description}</p>

              <div className="space-y-4 mb-8">
                {movie.genre && (
                  <p className="text-gray-300"><strong>Genre:</strong> {movie.genre}</p>
                )}
                {movie.duration && (
                  <p className="text-gray-300"><strong>Duration:</strong> {movie.duration} min</p>
                )}
                {movie.rating && (
                  <p className="text-gray-300"><strong>Rating:</strong> {movie.rating}</p>
                )}
              </div>

              {/* Book Button */}
              <button
                onClick={() => navigate(`/shows/${movie.id}`)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎬 Select Shows & Book Tickets
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !movie && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={48} className="animate-spin text-blue-400 mb-4" />
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
