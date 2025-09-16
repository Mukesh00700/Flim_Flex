import React from 'react';
import MovieCard from './MovieCard';

const MoviesSection = () => {
  const movies = [
    {
      id: 1,
      title: "The Dark Knight Returns",
      genre: "Action, Drama",
      rating: "8.5/10",
      price: "₹250",
      image: "bg-slate-700"
    },
    {
      id: 2,
      title: "Inception Dreams",
      genre: "Sci-Fi, Thriller",
      rating: "9.2/10",
      price: "₹300",
      image: "bg-blue-700"
    },
    {
      id: 3,
      title: "Romantic Evenings",
      genre: "Romance, Comedy",
      rating: "7.8/10",
      price: "₹200",
      image: "bg-rose-700"
    }
  ];

  return (
    <section id="movies" className="mb-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">Featured Movies</h3>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover the latest blockbusters and timeless classics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoviesSection;
