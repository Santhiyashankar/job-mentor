import { Outlet , useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-8">
          JobMentor
        </h2>
        <nav className="space-y-4">
  <p className="font-medium cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</p>
  <p className="text-slate-500 cursor-pointer" onClick={() => navigate("/dashboard/analytics")}>Analytics</p>
  <p className="text-slate-500 cursor-pointer"onClick={() => navigate("/dashboard/ai_insights")} >AI Insights</p>
  <p className="text-slate-500 cursor-pointer"onClick={() => navigate("/dashboard/settings")}
>Settings</p>
</nav>

      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <header className="flex justify-end bg-white shadow px-6 py-4">
          <button
            onClick={logout}
            className="text-red-600 font-medium"
          >
            Logout
          </button>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
