import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronLeft, Clock, MapPin, Users, Loader } from 'lucide-react';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
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
      });

    // Fetch shows for selected date
    fetch(`http://localhost:3000/api/bookings/shows?movieId=${movieId}&date=${selectedDate}`)
      .then(r => {
        if (!r.ok) {
          if (r.status === 404) throw new Error('No shows available');
          throw new Error(`Failed to fetch: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (data.shows) {
          setShows(data.shows);
        } else {
          setShows([]);
          setError('No shows available for this date');
        }
      })
      .catch(e => {
        console.error('Error fetching shows:', e);
        setShows([]);
        setError(e.message || 'Failed to load shows');
      })
      .finally(() => setLoading(false));
  }, [movieId, selectedDate]);

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const dateOptions = getDateOptions();

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

      <main className="container mx-auto px-6 py-8">
        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Select Date</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dateOptions.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  selectedDate === date
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={48} className="animate-spin text-blue-400 mb-4" />
            <p className="text-gray-400">Loading shows...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8">
            <p>{error}</p>
          </div>
        )}

        {/* Shows Grid */}
        {!loading && shows.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Available Shows - {formatDate(selectedDate)}
            </h2>

            {/* Group shows by theater */}
            {Object.entries(
              shows.reduce((acc, show) => {
                const key = `${show.theaterName} - ${show.city}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(show);
                return acc;
              }, {})
            ).map(([theaterLabel, theaterShows]) => (
              <div key={theaterLabel} className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">{theaterLabel}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {theaterShows.map(show => (
                    <div
                      key={show.showId}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all transform hover:scale-105"
                    >
                      {/* Show Time */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock size={18} className="text-blue-400" />
                          <span className="text-3xl font-bold text-white">
                            {formatTime(show.showTime)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {show.language ? `Language: ${show.language}` : 'Language: Not specified'}
                        </p>
                      </div>

                      {/* Hall Info */}
                      <div className="mb-4">
                        <p className="text-gray-300 font-semibold mb-1">{show.hallName}</p>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Users size={16} />
                          <span>
                            {show.availableSeats} seats available
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/shows/${show.showId}`}
                        className="w-full block text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
                      >
                        Select Seats & Book
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Shows State */}
        {!loading && shows.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No shows available for {formatDate(selectedDate)}</p>
            <p className="text-gray-500 mt-2">Try selecting a different date</p>
          </div>
        )}
      </main>
    </div>
  );
}
