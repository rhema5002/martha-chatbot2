import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Serve static files (HTML, CSS, JS, images)
app.use(express.static("public"));
app.use(express.json());

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Martha, a friendly and helpful AI assistant created by Rhema." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    // Get reply safely
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn’t reply right now.";

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "⚠️ Server error. Please try again later." });
  }
});

// Render or local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
