import React, { useState } from "react";

const CustomerChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Change Password</h1>

      <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none focus:ring"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none focus:ring"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded border focus:outline-none focus:ring"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default CustomerChangePasswordPage;
