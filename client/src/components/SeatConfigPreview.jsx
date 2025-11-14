import React from 'react';

const SeatConfigPreview = ({ config }) => {
  const { totalSeats, seatsPerRow, basicSeats, reclinerSeats, vipSeats } = config;
  
  if (!totalSeats || !seatsPerRow) return null;

  const rows = Math.ceil(totalSeats / seatsPerRow);
  const seats = [];
  
  let seatCounter = 0;
  let basicRemaining = basicSeats || 0;
  let reclinerRemaining = reclinerSeats || 0;
  let vipRemaining = vipSeats || 0;

  // Generate seat distribution
  for (let rowIndex = 0; rowIndex < rows && seatCounter < totalSeats; rowIndex++) {
    const rowLabel = rowIndex < 26 
      ? String.fromCharCode(65 + rowIndex)
      : String.fromCharCode(65 + Math.floor(rowIndex / 26) - 1) + String.fromCharCode(65 + (rowIndex % 26));
    
    const seatsInRow = Math.min(seatsPerRow, totalSeats - seatCounter);
    const rowSeats = [];

    for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
      let seatType = 'basic';
      
      if (vipRemaining > 0) {
        seatType = 'vip';
        vipRemaining--;
      } else if (reclinerRemaining > 0) {
        seatType = 'recliner';
        reclinerRemaining--;
      } else if (basicRemaining > 0) {
        seatType = 'basic';
        basicRemaining--;
      }

      rowSeats.push(seatType);
      seatCounter++;
    }

    seats.push({ label: rowLabel, seats: rowSeats });
  }

  const getSeatColor = (type) => {
    switch (type) {
      case 'vip': return 'bg-yellow-500';
      case 'recliner': return 'bg-purple-500';
      case 'basic': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const maxRowsToShow = 8;
  const showEllipsis = seats.length > maxRowsToShow;

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span>🎬</span>
        Seat Layout Preview
      </h4>
      
      {/* Screen */}
      <div className="bg-gradient-to-b from-gray-300 to-gray-400 h-2 rounded-full mb-4 relative">
        <div className="absolute -bottom-5 left-0 right-0 text-center">
          <span className="text-xs text-gray-400">Screen</span>
        </div>
      </div>

      {/* Seats */}
      <div className="mt-6 space-y-1 max-h-48 overflow-y-auto">
        {seats.slice(0, maxRowsToShow).map((row, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-6 text-center font-mono">{row.label}</span>
            <div className="flex gap-1 flex-1 justify-center">
              {row.seats.map((seatType, seatIdx) => (
                <div
                  key={seatIdx}
                  className={`w-3 h-3 rounded-sm ${getSeatColor(seatType)}`}
                  title={`${seatType.charAt(0).toUpperCase() + seatType.slice(1)}`}
                />
              ))}
            </div>
          </div>
        ))}
        
        {showEllipsis && (
          <div className="text-center text-gray-500 text-xs py-2">
            ... {seats.length - maxRowsToShow} more rows ...
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-slate-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-yellow-500"></div>
          <span className="text-xs text-gray-300">VIP ({vipSeats})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
          <span className="text-xs text-gray-300">Recliner ({reclinerSeats})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
          <span className="text-xs text-gray-300">Basic ({basicSeats})</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-400">
          {rows} rows × {seatsPerRow} seats/row = {totalSeats} total
        </span>
      </div>
    </div>
  );
};

export default SeatConfigPreview;
