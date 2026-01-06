import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AIInsights from "../components/AIInsights";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Application not found");
        navigate("/dashboard");
        return;
      }

      setApplication(data);
      setLoading(false);
    };

    loadApplication();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!application) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-2">
        {application.job_title}
      </h1>
      <p className="text-slate-600 mb-4">
        {application.company_name}
      </p>

      <div className="grid gap-3 text-sm">
        <p><strong>Status:</strong> {application.status}</p>
        <p><strong>Date Applied:</strong> {application.date_applied || "N/A"}</p>
        <p><strong>Notes:</strong> {application.notes || "No notes"}</p>
      </div>

      {/* 🔥 AI Insights */}
      {application.status === "Rejected" && (
        <AIInsights
          company={application.company_name}
          role={application.job_title}
          notes={application.notes}
          status={application.status}
        />
      )}
    </div>
  );
}
