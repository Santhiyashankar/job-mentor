import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // allow all origins
app.use(express.json()); // parse JSON

// Health check endpoint
app.get("/", (req, res) => res.send("AI backend running"));

// AI Insights endpoint
app.post("/rejection-insights", async (req, res) => {
  const { company, role, notes } = req.body;

  console.log("Request received:", { company, role, notes });

  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key not set!");
    return res.status(500).json({ error: "OpenAI API key not set on backend" });
  }

  if (!company || !role) {
    return res.status(400).json({ error: "Company and role are required" });
  }

  const prompt = `
You are a career mentor for students.
Job Role: ${role}
Company: ${company}
Candidate Notes: ${notes || "No notes"}

Give:
1. Possible reason for rejection
2. Resume improvement tips
3. Interview improvement tips
4. Actionable next steps

Keep it concise and professional.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      return res.status(500).json({ error: "Failed to fetch AI insights" });
    }

    const data = await response.json();
    console.log("OpenAI response received");
    console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));


    const insight = data?.choices?.[0]?.message?.content || "No insights generated";
// Simple AI scoring logic (resume-safe & explainable)
const score = Math.min(
  100,
  Math.max(
    40,
    70 - (notes?.length || 0) / 10
  )
);

return res.json({
  insight,
  score: Math.round(score),
});

  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Server error fetching AI insights" });
  }
});

app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
