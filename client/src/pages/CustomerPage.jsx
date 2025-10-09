import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomerSidebar from "../components/CustomerSidebar";

const CustomerPage = () => {
  const [bookings, setBookings] = useState([
    { id: 1, movie: "Jawan", date: "2025-10-10", seats: "A1, A2", amount: 400 },
    { id: 2, movie: "Leo", date: "2025-10-12", seats: "B1, B2", amount: 350 },
  ]);

  const handleCancel = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const location = useLocation();
  const path = location.pathname.toLowerCase(); // 👈 Convert to lowercase

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
      <CustomerSidebar />

      <div className="flex-1 p-6 flex items-center justify-center">
        {path === "/customer" ? (
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
              🎬 Welcome to Film_Flex
            </h1>
            <p className="text-xl font-medium text-white drop-shadow-md">
              A trusted movie ticket booking platform.
            </p>
          </div>
        ) : (
          <Outlet context={{ bookings, handleCancel }} />
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
