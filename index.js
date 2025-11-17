document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const userProfileDiv = document.getElementById('user-profile');
    
    // Cek status login dari Local Storage.
    // Status ini disetel di halaman loginpage.html setelah berhasil login.
    const statusLogin = localStorage.getItem('isLoggedIn');

    function updateHeaderStatus() {
        if (statusLogin === 'true') {
            // Jika statusnya true (Pengguna telah login)
            if (loginLink) {
                loginLink.style.display = 'none'; // Sembunyikan tombol 'Login'
            }
            if (userProfileDiv) {
                // Gunakan 'flex' atau 'block' sesuai display aslinya di CSS
                userProfileDiv.style.display = 'flex'; // Tampilkan 'Profile Pengguna'
            }
        } else {
            // Jika statusnya false atau belum ada
            if (loginLink) {
                loginLink.style.display = 'block'; // Tampilkan tombol 'Login'
            }
            if (userProfileDiv) {
                userProfileDiv.style.display = 'none'; // Sembunyikan 'Profile Pengguna'
            }
        }
    }

    updateHeaderStatus();
});