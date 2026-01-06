import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchApplications, deleteApplication } from "../lib/applications";
import type { Application } from "../lib/applications";
import ApplicationForm from "../components/applications/ApplicationForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Application | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadApplications = () => {
    if (!user) return;
    setLoading(true);
    fetchApplications(user.id)
      .then(setApplications)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this application?")) {
      await deleteApplication(id);
      loadApplications();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Applications</h1>

      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        Add New Application
      </button>

      {showForm && (
        <ApplicationForm
          existing={editing ?? undefined}
          onSuccess={() => {
            setShowForm(false);
            loadApplications();
          }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 mt-4">
          {applications.map(app => (
            <div
              key={app.id}
              onClick={() => navigate(`/dashboard/applications/${app.id}`)}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:ring-2 hover:ring-blue-500"
            >
              <div>
                <h2 className="font-bold">{app.company_name}</h2>
                <p>{app.job_title}</p>
                <p
                  className={`text-sm font-medium ${
                    app.status === "Applied"
                      ? "text-blue-600"
                      : app.status === "Interview"
                      ? "text-yellow-600"
                      : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {app.status}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(app);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="text-red-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(app.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <p className="text-slate-500">No applications yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
