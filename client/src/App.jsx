import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPageUser from "./pages/LoginPageUser";
import RegisterPageUser from "./pages/RegisterPageUser";
import RegisterPageAdmin from "./pages/RegisterPageAdmin";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import TestPage from "./pages/TestPage";

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
        <Route path="/admin/*" element={<AdminDashboard/>}/>
        <Route path="/Test" element={<TestPage/>}/>
        {/* <Route path="/analytics" element={<AnalyticsPage/>}/> */}
      </Routes>
    </Router>
  );
};

export default App;
