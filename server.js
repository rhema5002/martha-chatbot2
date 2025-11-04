import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Load the Gemini API key from Render Environment Variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Martha is live and connected to Gemini AI!");
});

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage)
    return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Log full Gemini response for debugging
    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    let reply = "No response from Gemini 😔";
    if (data?.candidates?.length > 0) {
      const parts = data.candidates[0]?.content?.parts;
      if (parts && parts.length > 0 && parts[0]?.text) {
        reply = parts[0].text;
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
