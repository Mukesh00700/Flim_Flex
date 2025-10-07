import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPageUser from "./pages/LoginPageUser";
import RegisterPageUser from "./pages/RegisterPageUser";
import RegisterPageAdmin from "./pages/RegisterPageAdmin";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/MoviesPage";
import BookingsPage from "./pages/BookingsPage";
import UserPage from "./pages/UserPage";

import LoginPageAdmin from "./pages/LoginPageAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loginUser" element={<LoginPageUser />} />
        <Route path="/loginAdmin" element={<LoginPageAdmin />} />
        <Route path="/registerUser" element={<RegisterPageUser />} />
        <Route path="/registerAdmin" element={<RegisterPageAdmin />} />
        <Route path="/adminDashboard" element={<AdminDashboard/>}/>
        <Route path="/movies" element={<MoviesPage/>}/>
        <Route path="/bookings" element={<BookingsPage/>}/>
        <Route path="/user" element={<UserPage/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/movies" element={<MoviesPage/>}/>
        <Route path="/bookings" element={<BookingsPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
