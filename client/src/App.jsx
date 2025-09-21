import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/MoviesPage";
import BookingsPage from "./pages/BookingsPage";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="/movies" element={<MoviesPage/>}/>
      <Route path="/bookings" element={<BookingsPage/>}/>
      <Route path="/user" element={<UserPage/>}/>
   
    
    
      </Routes>
    </Router>
  );
};

export default App;
