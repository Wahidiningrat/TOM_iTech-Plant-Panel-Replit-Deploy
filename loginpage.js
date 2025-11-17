// Logika untuk Tombol Toggle Passcode
const toggleBtn = document.querySelector('.toggle-passcode');
const passInput = document.getElementById('passcode');

if (toggleBtn && passInput) {
  toggleBtn.addEventListener('click', () => {
    if (passInput.type === 'password') {
      passInput.type = 'text';
      toggleBtn.textContent = 'Show';
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      passInput.type = 'password';
      toggleBtn.textContent = 'Hide';
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  });
}

// LOGIKA VERIFIKASI LOGIN
const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const passcodeInput = document.getElementById('passcode');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const emailValue = emailInput.value.trim();
    const passcodeValue = passcodeInput.value.trim();

    // Kredensial yang Diharapkan
    const REQUIRED_USER = "admin_TOM";
    const REQUIRED_PASS = "admin_TOM";

    // Logika Verifikasi
    if (emailValue === REQUIRED_USER && passcodeValue === REQUIRED_PASS) {
        
        // --- LOGIN BERHASIL ---
        alert("Login Berhasil! Mengarahkan ke halaman utama...");
        
        // 1. SET STATUS LOGIN di Local Storage
        localStorage.setItem('isLoggedIn', 'true');
        
        // 2. REDIRECT ke index.html (halaman utama)
        window.location.href = "index.html"; 
        
    } else {
        
        // --- LOGIN GAGAL ---
        alert("Login Gagal! Email/Phone No atau Passcode salah. Gunakan 'admin_TOM' untuk keduanya.");
    }
});