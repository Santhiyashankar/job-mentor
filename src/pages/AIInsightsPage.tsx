// src/pages/AIInsightsPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchApplications } from "../lib/applications";
import AIInsights from "../components/AIInsights";
import type { Application } from "../lib/applications";

export default function AIInsightsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchApplications(user.id)
      .then((apps) =>
        setApplications(apps.filter((a) => a.status === "Rejected"))
      )
      .finally(() => setLoading(false));
  }, [user]);

  const filteredApps = applications.filter(
    (app) =>
      app.company_name.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🤖 AI Rejection Insights</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading rejected applications...</p>
      ) : filteredApps.length === 0 ? (
        <p className="text-gray-500">
          No rejected applications found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-xl shadow-md"
            >
              <h2 className="font-bold text-xl">
                {app.company_name}
              </h2>
              <p className="text-slate-600 mb-4">
                {app.job_title}
              </p>

              {/* AI Insight per application */}
              <AIInsights
                company={app.company_name}
                role={app.job_title}
                notes={app.notes}
                status={app.status}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
