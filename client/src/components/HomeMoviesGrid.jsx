import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

const HomeMoviesGrid = ({ onSelectMovie, search = '' }) => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const baseURL = 'http://localhost:3000';
        
        // Load movies (required)
        const mRes = await fetch(`${baseURL}/movies/getRunningMovies`);
        if (!mRes.ok) throw new Error(`Movies failed: ${mRes.status}`);
        const moviesData = await mRes.json();
        setMovies(moviesData || []);
        
        // Load shows (optional, for filtering)
        try {
          const sRes = await fetch(`${baseURL}/api/bookings/shows/all?date=${date}`);
          if (sRes.ok) {
            const showsData = await sRes.json();
            setShows(showsData.shows || []);
          }
        } catch (e) {
          console.warn('Could not load shows:', e);
          setShows([]);
        }
        
        // Load cities (optional, for filtering)
        try {
          const cRes = await fetch(`${baseURL}/theater/cities`);
          if (cRes.ok) {
            const citiesData = await cRes.json();
            setCities(citiesData.cities || []);
          }
        } catch (e) {
          console.warn('Could not load cities:', e);
          setCities([]);
        }
      } catch (e) {
        console.error('Failed to load movies', e);
        setMovies([]);
        setShows([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [date]);

  // Filter movies by search + selected city/theater
  const filtered = movies.filter(m => {
    if (search) {
      const s = search.toLowerCase();
      if (!((m.title || '').toLowerCase().includes(s) || (m.genre || '').toLowerCase().includes(s))) return false;
    }
    // if city selected, ensure there is at least one show for this movie in that city
    if (selectedCity) {
      const showsForMovie = shows.filter(sh => sh.movieId === m.id && sh.city === selectedCity);
      if (showsForMovie.length === 0) return false;
      if (selectedTheater) {
        const byTheater = showsForMovie.filter(sh => sh.theaterName === selectedTheater);
        if (byTheater.length === 0) return false;
      }
    }
    return true;
  });

  return (
    <div className="container mx-auto px-6">
      <h3 className="text-3xl font-bold text-white mb-4">Now Showing</h3>
      <div className="flex gap-3 items-center mb-4">
        <div>
          <label className="text-sm text-gray-300 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-slate-800 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-300 block">City</label>
          <select className="bg-slate-800 text-white p-2 rounded" value={selectedCity} onChange={e => { setSelectedCity(e.target.value); setSelectedTheater(''); }}>
            <option value="">All cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300 block">Theater</label>
          <select className="bg-slate-800 text-white p-2 rounded" value={selectedTheater} onChange={e => setSelectedTheater(e.target.value)}>
            <option value="">All theaters</option>
            {Array.from(new Set(shows.filter(s => !selectedCity || s.city === selectedCity).map(s => s.theaterName))).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-400">No running movies currently.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(movie => (
            <MovieCard key={movie.id} movie={{
              id: movie.id,
              title: movie.title,
              genre: movie.genre,
              rating: '—',
              price: 'From ₹0',
              image: 'bg-slate-700'
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeMoviesGrid;
