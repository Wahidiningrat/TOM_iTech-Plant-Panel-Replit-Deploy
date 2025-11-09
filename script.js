// === Konfigurasi OpenAI API ===
const OPENAI_API_KEY = "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";

// Elemen DOM
const cardsEl = document.getElementById("cards");
const chatContainer = document.getElementById("chat-container");
const chatMessages = document.getElementById("chat-messages");
const inputForm = document.getElementById("input-area");
const userInput = document.getElementById("user-input");

// Tampilkan pesan di chat
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + (sender === "user" ? "user" : "ai");
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  // Auto-scroll ke bawah
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fungsi panggil OpenAI API (Chat Completion)
async function askOpenAI(question) {
  addMessage(question, "user");

  // Tampilkan pesan loading sementara menunggu respons
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message ai";
  loadingMsg.textContent = "Thinking...";
  chatMessages.appendChild(loadingMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful assistant called SayHalo." },
          { "role": "user", "content": question }
        ],
        max_tokens: 700,
        temperature: 0.7,
        n: 1,
        stop: null,
      }),
    });

    const data = await response.json();
    chatMessages.removeChild(loadingMsg);

    if (data.error) {
      addMessage("Error: " + data.error.message, "ai");
      return;
    }

    const answer = data.choices[0].message.content.trim();
    addMessage(answer, "ai");
  } catch (err) {
    chatMessages.removeChild(loadingMsg);
    addMessage("Failed to get response: " + err.message, "ai");
  }
}

// Tangani klik pada cards untuk direct prompt
cardsEl.addEventListener("click", (e) => {
  let card = e.target.closest(".card");
  if (!card) return;
  const question = card.dataset.prompt;

  // Kosongkan chat dan langsung ajukan pertanyaan
  chatMessages.innerHTML = "";

  // Fokus ke input
  userInput.focus();

  askOpenAI(question);
});

// Tangani submit form input user (chat)
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  // Nonaktifkan input saat mengirim
  userInput.disabled = true;
  askOpenAI(text).finally(() => {
    // Aktifkan kembali input setelah respons diterima/error
    userInput.disabled = false;
    userInput.value = "";
    userInput.focus();
  });
});