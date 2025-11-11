// === Konfigurasi Gemini API ===
// PENTING: Untuk penggunaan dalam platform Canvas, biarkan nilai ini kosong.
// Kunci API akan disediakan secara otomatis saat runtime.
const GEMINI_API_KEY = "AIzaSyAXHlWtD4FluVjN1n3-nYzCr-ed46F6jiQ";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

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

// Fungsi panggil Gemini API dengan Exponential Backoff
async function askGemini(question, maxRetries = 5) {
  addMessage(question, "user");

  // Tampilkan pesan loading sementara menunggu respons
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message ai";
  loadingMsg.textContent = "Berpikir...";
  chatMessages.appendChild(loadingMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const payload = {
        contents: [{ parts: [{ text: question }] }],
        systemInstruction: {
            parts: [{ text: "Anda adalah asisten yang membantu dan ramah bernama SayHalo. Jawablah pertanyaan pengguna dengan jelas dan ringkas." }]
        },
        // Contoh penggunaan Google Search Grounding. Hapus baris di bawah jika tidak diperlukan.
        // tools: [{ "google_search": {} }],
      };

      const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Jika respons OK, keluar dari loop retry
      if (response.ok) {
        const data = await response.json();
        chatMessages.removeChild(loadingMsg);

        const candidate = data.candidates?.[0];
        const answer = candidate?.content?.parts?.[0]?.text?.trim();

        if (answer) {
            addMessage(answer, "ai");
        } else {
            addMessage("Error: Respons API kosong atau tidak valid.", "ai");
        }
        return; 
      } else if (response.status === 429 && attempt < maxRetries - 1) {
        // Handle Rate Limiting (429 Too Many Requests)
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        // Lanjutkan ke iterasi berikutnya untuk retry
      } else {
        // Handle status error lainnya
        const errorText = await response.text();
        throw new Error(`Gagal memanggil API: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      if (attempt === maxRetries - 1) {
        // Jika ini adalah percobaan terakhir, tampilkan error ke user
        chatMessages.removeChild(loadingMsg);
        addMessage(`Gagal mendapatkan respons setelah ${maxRetries} percobaan: ${err.message}`, "ai");
        return;
      }
      // Untuk error lain, coba lagi setelah delay
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
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

  // Ganti ke fungsi Gemini
  askGemini(question);
});

// Tangani submit form input user (chat)
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  // Nonaktifkan input saat mengirim
  userInput.disabled = true;
  
  // Ganti ke fungsi Gemini
  askGemini(text).finally(() => {
    // Aktifkan kembali input setelah respons diterima/error
    userInput.disabled = false;
    userInput.value = "";
    userInput.focus();
  });
});