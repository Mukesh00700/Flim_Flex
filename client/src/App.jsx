import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPageUser from "./pages/LoginPageUser";
import LoginPageAdmin from "./pages/LoginPageAdmin";
import RegisterPageUser from "./pages/RegisterPageUser";
import RegisterPageAdmin from "./pages/RegisterPageAdmin";
import TestPage from "./pages/TestPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetail from "./pages/MovieDetail";
import BookingsPage from "./pages/BookingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserPage from "./pages/UserPage";
import CustomerPage from "./pages/CustomerPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import CustomerBookingsPage from "./pages/CustomerBookingsPage";
import CustomerBookingHistoryPage from "./pages/CustomerBookingHistoryPage";
import ShowPage from "./pages/ShowPage";
import PaymentPage from "./pages/PaymentPage";


import SeatsPage from "./pages/SeatsPage";

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<HomePage />} />
        <Route path="/loginUser" element={<LoginPageUser />} />
        <Route path="/loginAdmin" element={<LoginPageAdmin />} />
        <Route path="/registerUser" element={<RegisterPageUser />} />
  <Route path="/registerAdmin" element={<RegisterPageAdmin />} />

  <Route path="/admin/*" element={<AdminDashboard />} />
  <Route path="/user" element={<UserPage />} />

  <Route path="/test" element={<TestPage />} />
  <Route path="/movies" element={<MoviesPage />} />
  <Route path="/movies/:movieId" element={<MovieDetail />} />
  <Route path="/shows/:showId" element={<ShowPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
  <Route path="/payment" element={<PaymentPage />} />

        {/* 👤 Customer routes */}
        <Route path="/customer" element={<CustomerPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="bookings" element={<CustomerBookingsPage />} />
          <Route path="booking-history" element={<CustomerBookingHistoryPage />} />
        </Route>
        <Route path="/seats" element={<SeatsPage />} />

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
