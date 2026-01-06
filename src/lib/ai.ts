// src/lib/getRejectionInsight.ts

export type AIInsightResponse = {
  insight: string;
  score: number;
};

export const getRejectionInsight = async (
  company: string,
  role: string,
  notes?: string
): Promise<AIInsightResponse> => {
  try {
    const res = await fetch("http://localhost:5000/rejection-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, notes }),
    });

    if (!res.ok) {
      throw new Error(`AI server error: ${res.status}`);
    }

    const data = await res.json();

    return {
      insight: data.insight ?? "No insights available",
      score: typeof data.score === "number" ? data.score : 0,
    };
  } catch (err: any) {
    console.error("Error fetching AI insight:", err);

    return {
      insight: "Failed to load AI insights. Please try again.",
      score: 0,
    };
  }
};
