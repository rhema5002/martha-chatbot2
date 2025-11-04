const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  createMessage(text, "user");
  input.value = "";

  const typing = showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are Martha, a helpful assistant." },
          { role: "user", content: text }
        ]
      }),
    });

    const data = await res.json();
    typing.remove();

    if (data.assistant?.content) {
      createMessage(data.assistant.content, "assistant");
    } else {
      createMessage("Sorry — something went wrong.", "assistant");
    }
  } catch (err) {
    typing.remove();
    createMessage("Error connecting to server.", "assistant");
    console.error(err);
  }
});



