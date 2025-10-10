import React, { useState, useEffect } from "react";
import axios from "axios";
const CustomerProfilePage = () => {
  // ✅ State for loading, error, and dynamic user data
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserProfile = async () => {
  try {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    // 2. Make the GET request with Axios
    // The second argument to axios.get is the configuration object, where we place headers.
    const response = await axios.get("http://localhost:3000/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Process the response
    // With Axios, the response data is directly available on the `data` property.
    console.log("Profile data:", response.data);
    setUser(response.data);

  } catch (err) {
    // Axios automatically throws an error for non-2xx status codes.
    // We can inspect the error object for more details.
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with an error:", err.response.status, err.response.data);
      setError(`Error: ${err.response.data.message || 'Failed to fetch user profile.'}`);
    } else if (err.request) {
      // The request was made but no response was received (e.g., server is down)
      console.error("No response received from server:", err.request);
      setError("Could not connect to the server. Please make sure it's running.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", err.message);
      setError(err.message);
    }
  } finally {
    setIsLoading(false);
  }
};

    fetchUserProfile();
  }, []); // Empty array ensures this runs only once on mount

  // ✅ Conditional rendering for loading and error states
  if (isLoading) {
    return <div className="p-8 text-center text-white">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-400">Error: {error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-center text-white">No profile data found.</div>;
  }
  
  // ✅ Dynamically generate avatar from user's name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=160`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#0f172a] text-white min-h-screen overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
        <span>👤</span> My Profile
      </h1>

      <div className="bg-[#1e293b] p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-purple-500 mb-4 shadow-md"
          />
        </div>

        {/* Profile Information */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">
              {user.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
            <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;