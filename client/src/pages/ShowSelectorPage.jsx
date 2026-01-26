import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Loader } from "lucide-react";
import API from "../api";

const ShowSelectorPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredShows, setFilteredShows] = useState([]);

  // Fetch movie and shows
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details
        const movieRes = await API.get(`/movies/${movieId}`);
        setMovie(movieRes.data);

        // Fetch all shows for this movie
        const showsRes = await API.get(`/shows?movieId=${movieId}`);
        const showsData = showsRes.data;
        
        setShows(showsData);
        
        // Set default date to today
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        
        // Filter shows for today
        const filtered = showsData.filter(show => {
          const showDate = new Date(show.show_time).toISOString().split("T")[0];
          return showDate === today;
        });
        setFilteredShows(filtered);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || "Failed to load shows");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filtered = shows.filter(show => {
      const showDate = new Date(show.show_time).toISOString().split("T")[0];
      return showDate === date;
    });
    setFilteredShows(filtered);
  };

  // Handle show selection
  const handleSelectShow = (showId) => {
    navigate(`/seats/${showId}`);
  };

  // Get next 7 days for date picker
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-300 hover:text-blue-100 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            {movie?.title || "Select Show"}
          </h1>
          <p className="text-blue-200">Choose your preferred date and showtime</p>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Select Date
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getNext7Days().map(date => {
              const dateObj = new Date(date);
              const day = dateObj.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = dateObj.getDate();
              const isSelected = date === selectedDate;

              return (
                <button
                  key={date}
                  onClick={() => handleDateChange(date)}
                  className={`px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-yellow-400 text-slate-900 shadow-lg"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  <div className="text-sm">{day}</div>
                  <div className="text-lg">{dayNum}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shows List */}
        {filteredShows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blue-200 text-lg">No shows available for this date</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredShows.reduce((groups, show) => {
              const theaterName = show.theater_name || "Unknown Theater";
              const existing = groups.find(g => g.theater === theaterName);
              
              if (existing) {
                existing.shows.push(show);
              } else {
                groups.push({ theater: theaterName, shows: [show] });
              }
              
              return groups;
            }, []).map(group => (
              <div key={group.theater} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  {group.theater}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.shows.map(show => {
                    const showTime = new Date(show.show_time);
                    const timeStr = showTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    });

                    return (
                      <button
                        key={show.id}
                        onClick={() => handleSelectShow(show.id)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-4 rounded-lg transition-all transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold">{timeStr}</span>
                        </div>
                        <div className="text-xs text-blue-200">
                          {show.language || "Hindi"} • 2D
                        </div>
                        <div className="text-xs text-green-300 mt-2">
                          Seats Available
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSelectorPage;
