import React, { useState } from "react";

const CustomerProfilePage = () => {
  // ✅ Static user data
  const [user] = useState({
    name: "Aditya Kumar Dwivedi",
    email: "aditya@example.com",
    photo: "https://i.pravatar.cc/150?img=3",
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#0f172a] text-white min-h-screen overflow-y-auto">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
        <span>👤</span> My Profile
      </h1>

      {/* Profile Container */}
      <div className="bg-[#1e293b] p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={user.photo}
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-purple-500 mb-4 shadow-md"
          />
        </div>

        {/* Profile Information */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Full Name
            </label>
            <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">
              {user.name}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Email
            </label>
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
