import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeatSelector from '../components/SeatSelector';
import { ChevronLeft } from 'lucide-react';

export default function ShowPage() {
  const { showId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-6 px-6 border-b border-slate-700">
        <div className="container mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Select Your Seats</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Seat selector handles fetching availability and booking */}
        <SeatSelector showId={Number(showId)} />
      </main>
    </div>
  );
}
