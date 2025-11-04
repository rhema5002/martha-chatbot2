async function sendMessage() {
  const input = document.getElementById("userInput").value;
  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `<div class="user-msg">${input}</div>`;
  document.getElementById("userInput").value = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  });

  const data = await response.json();
  chatBox.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
}
