import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold text-blue-600">JobMentor</h1>

        <div className="space-x-6">
          <Link to="/login" className="text-slate-600 hover:text-blue-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}
