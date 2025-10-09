import React, { useState } from "react";

const CustomerProfilePage = () => {
  // ✅ Initial dummy user data
  const [user, setUser] = useState({
    name: "Aditya Kumar Dwivedi",
    username: "aditya_123",
    email: "aditya@example.com",
    dob: "2002-06-15",
    address: "NIT Bhopal, Madhya Pradesh, India",
    photo: "https://i.pravatar.cc/150?img=3",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save action
  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#0f172a] text-white min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>👤</span> My Profile
        </h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition"
          >
            ✏️ Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition"
            >
              💾 Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Container */}
      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={user.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mb-4 shadow-md"
          />
          {isEditing && (
            <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm">
              Change Photo
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-slate-600 rounded-lg px-3 py-2 outline-none text-white focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">{user.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Username</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full bg-white/10 border border-slate-600 rounded-lg px-3 py-2 outline-none text-white focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">{user.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full bg-white/10 border border-slate-600 rounded-lg px-3 py-2 outline-none text-white focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">{user.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                className="w-full bg-white/10 border border-slate-600 rounded-lg px-3 py-2 outline-none text-white focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">{user.dob}</p>
            )}
          </div>

          {/* Address (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 mb-1">Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={user.address}
                onChange={handleChange}
                rows={3}
                className="w-full bg-white/10 border border-slate-600 rounded-lg px-3 py-2 outline-none text-white focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="bg-white/5 border border-slate-700 rounded-lg px-3 py-2">{user.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
