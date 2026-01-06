import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchApplications} from "../lib/applications";
import type { Application } from "../lib/applications";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function Analytics() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchApplications(user.id) // <-- Pass user ID
      .then(setApplications)
      .catch(err => alert(err.message));
  }, [user]);

  const total = applications.length;
  const offers = applications.filter(a => a.status === "Offer").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;
  const interviews = applications.filter(a => a.status === "Interview").length;

  const pieData = [
    { name: "Applied", value: total - offers - rejected - interviews },
    { name: "Interview", value: interviews },
    { name: "Offer", value: offers },
    { name: "Rejected", value: rejected },
  ];

  const lineData = applications
    .map(a => ({ date: a.date_applied || a.created_at?.split("T")[0], status: a.status }))
    .reduce((acc: any[], curr) => {
      const existing = acc.find(d => d.date === curr.date);
      if (existing) {
        existing.total += 1;
      } else {
        acc.push({ date: curr.date, total: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-sm text-slate-500">Total Applications</h2>
          <p className="text-xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-sm text-slate-500">Interviews</h2>
          <p className="text-xl font-bold">{interviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-sm text-slate-500">Offers</h2>
          <p className="text-xl font-bold">{offers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h2 className="text-sm text-slate-500">Rejected</h2>
          <p className="text-xl font-bold">{rejected}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-2">Status Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Applications Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
