async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const input = inputField.value.trim();

  if (!input) return; // prevents empty messages

  chatBox.innerHTML += `<div class="user-msg">${input}</div>`;
  inputField.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
  } catch (err) {
    chatBox.innerHTML += `<div class="bot-msg error">⚠️ Error: could not reach server.</div>`;
  }
}
