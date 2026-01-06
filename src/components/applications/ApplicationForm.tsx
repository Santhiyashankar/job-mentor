import { useForm } from "react-hook-form";
import { addApplication, updateApplication } from "../../lib/applications";
import type { Application } from "../../lib/applications";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

type Props = {
  existing?: Application;
  onSuccess?: () => void;
};

type FormData = {
  company_name: string;
  job_title: string;
  industry?: string;
  date_applied?: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  notes?: string;
};

export default function ApplicationForm({ existing, onSuccess }: Props) {
  const { user } = useAuth();
  const [aiInsight, setAiInsight] = useState<string>("");

  const defaultValues: FormData = existing
    ? {
        company_name: existing.company_name,
        job_title: existing.job_title,
        industry: existing.industry ?? "",
        date_applied: existing.date_applied ?? undefined,
        status: existing.status as FormData["status"],
        notes: existing.notes ?? undefined,
      }
    : {
        company_name: "",
        job_title: "",
        industry: "",
        status: "Applied",
      };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues });

  const status = watch("status");

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    try {
      if (existing) {
        await updateApplication(existing.id, data);
        alert("Application updated successfully");
      } else {
        await addApplication({ ...data, user_id: user.id });
        alert("Application added successfully");
      }
      onSuccess?.();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getAIInsights = async () => {
    setAiInsight("Generating insights...");

    const res = await fetch("http://localhost:5000/rejection-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: watch("company_name"),
        role: watch("job_title"),
        industry: watch("industry"),
        notes: watch("notes"),
      }),
    });

    const data = await res.json();
    setAiInsight(data.insight || "No insights available");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {existing ? "Edit Application" : "Add New Application"}
      </h2>

      {/* Company */}
      <input
        {...register("company_name", { required: "Company is required" })}
        placeholder="Company Name"
        className="w-full border px-3 py-2 rounded mb-3"
      />
      {errors.company_name && (
        <p className="text-red-500 text-sm">{errors.company_name.message}</p>
      )}

      {/* Role */}
      <input
        {...register("job_title", { required: "Job title is required" })}
        placeholder="Job Title"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      {/* Industry */}
      <select
        {...register("industry")}
        className="w-full border px-3 py-2 rounded mb-3"
      >
        <option value="">Select Industry</option>
        <option value="Software">Software</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
        <option value="Data">Data / AI</option>
      </select>

      {/* Date */}
      <input
        type="date"
        {...register("date_applied")}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      {/* Status */}
      <select
        {...register("status")}
        className="w-full border px-3 py-2 rounded mb-3"
      >
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>

      {/* Notes */}
      <textarea
        {...register("notes")}
        placeholder="Notes (optional)"
        className="w-full border px-3 py-2 rounded mb-4"
        rows={3}
      />

      {/* AI Button */}
      {status === "Rejected" && (
        <button
          type="button"
          onClick={getAIInsights}
          className="w-full bg-purple-600 text-white py-2 rounded mb-3 hover:bg-purple-700"
        >
          Get AI Rejection Insights
        </button>
      )}

      {aiInsight && (
        <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-line mb-3">
          {aiInsight}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {existing ? "Update Application" : "Add Application"}
      </button>
    </form>
  );
}
