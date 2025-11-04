const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createMessage(content, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = role === "user" ? "user.png" : "martha.png";
  avatar.alt = role;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  div.appendChild(avatar);
  div.appendChild(bubble);
  chatBox.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "message assistant";

  const avatar = document.createElement("img");
  avatar.src = "martha.png";
  avatar.className = "avatar";

  const typing = document.createElement("div");
  typing.className = "bubble typing";
  typing.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;

  div.appendChild(avatar);
  div.appendChild(typing);
  chatBox.appendChild(div);
  scrollToBottom();
  return div;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  createMessage(text, "user");
  input.value = "";

  const typing = showTyping();

  try {
    const res = await fetch("/chat", {  // ✅ fixed endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })  // ✅ matches server.js
    });

    const data = await res.json();
    typing.remove();

    if (data.reply) {  // ✅ matches server.js
      createMessage(data.reply, "assistant");
    } else {
      createMessage("Sorry — something went wrong.", "assistant");
    }
  } catch (err) {
    typing.remove();
    createMessage("Error connecting to server.", "assistant");
    console.error(err);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});
