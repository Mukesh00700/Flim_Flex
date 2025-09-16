import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-slate-700">
      <div className={`${movie.image} h-48 rounded-lg mb-4 flex items-center justify-center text-white text-sm opacity-80`}>
        Movie Poster
      </div>
      <h4 className="text-xl font-bold text-white mb-2">{movie.title}</h4>
      <p className="text-slate-400 mb-2">{movie.genre}</p>
      <p className="text-yellow-400 mb-4">⭐ {movie.rating}</p>
      <div className="flex justify-between items-center">
        <span className="text-blue-400 font-semibold text-lg">{movie.price}</span>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
