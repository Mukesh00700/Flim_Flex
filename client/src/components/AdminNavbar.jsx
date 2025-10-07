import {jwtDecode} from "jwt-decode";
export function AdminNavbar() {
  let decoded = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return (
    <header className="bg-slate-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-300 font-medium">Welcome,</span>
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="rounded-full w-10 h-10"
        />
      </div>
    </header>
  );
}

export default AdminNavbar;
