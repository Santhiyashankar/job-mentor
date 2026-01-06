import { useEffect, useState } from "react";
import { getRejectionInsight } from "../lib/ai";

interface AIInsightResponse {
  insight: string;
}

interface Props {
  company: string;
  role: string;
  notes?: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
}

export default function AIInsights({ company, role, notes, status }: Props) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status !== "Rejected") return;

    setLoading(true);

    getRejectionInsight(company, role, notes)
      .then((response: AIInsightResponse) => {
        setInsight(response.insight);
      })
      .catch(() => {
        setInsight("No insights available.");
      })
      .finally(() => setLoading(false));
  }, [company, role, notes, status]);

  if (status !== "Rejected") return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
      <h3 className="font-bold text-red-700 mb-2">
        🤖 AI Rejection Insights
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">Analyzing rejection...</p>
      ) : (
        <pre className="whitespace-pre-wrap text-sm text-gray-700">
          {insight}
        </pre>
      )}
    </div>
  );
}
