const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = message;
  chatContainer.appendChild(userMsg);
  userInput.value = "";

  // Display "typing..."
  const botMsg = document.createElement("div");
  botMsg.className = "message bot";
  botMsg.textContent = "Martha is typing...";
  chatContainer.appendChild(botMsg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    botMsg.textContent = data.reply || "⚠️ No reply from Martha.";
  } catch (err) {
    botMsg.textContent = "❌ Error connecting to server.";
    console.error("Error:", err);
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
