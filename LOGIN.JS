// Variabel untuk menyimpan status login
let isLoggedIn = false;
let currentUser = "";

// Custom Message Box Function (Menggantikan alert bawaan)
function showMessage(text) {
    document.getElementById('customMessageText').innerText = text;
    document.getElementById('customMessageBox').style.display = 'flex';
}

function closeMessageBox() {
    document.getElementById('customMessageBox').style.display = 'none';
}

// Language Modal Functions
function openLangModal() {
    document.getElementById('languageModalOverlay').style.display = 'flex';
}

function closeLangModal() {
    document.getElementById('languageModalOverlay').style.display = 'none';
}

// Logic Baru untuk Klik Akun (Mengecek sudah login atau belum)
function handleAkunClick() {
    if (isLoggedIn) {
        document.getElementById('logoutModalOverlay').style.display = 'flex';
    } else {
        openLoginModal();
    }
}

function openLoginModal() {
    document.getElementById('loginModalOverlay').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModalOverlay').style.display = 'none';
}

function closeLogoutModal() {
    document.getElementById('logoutModalOverlay').style.display = 'none';
}

function processLogout() {
    isLoggedIn = false;
    currentUser = "";
    document.getElementById('akunToggle').innerHTML = `👤 Akun`;
    document.getElementById('loginPhoneInput').value = ''; // Kosongkan input nomor HP
    closeLogoutModal();
    showMessage("Anda telah berhasil keluar (Logout).");
}

function closeModalOnOutsideClick(event) {
    if (event.target.id === 'languageModalOverlay') {
        closeLangModal();
    }
    if (event.target.id === 'loginModalOverlay') {
        closeLoginModal();
    }
    if (event.target.id === 'googleLoginOverlay') {
        closeGoogleModal();
    }
    if (event.target.id === 'logoutModalOverlay') {
        closeLogoutModal();
    }
}

function processLogin() {
    const phone = document.getElementById('loginPhoneInput').value.trim();
    if(!phone) {
        showMessage("Silakan masukkan nomor telepon Anda.");
        return;
    }
    
    // Set status login menjadi true dengan nomor telepon
    isLoggedIn = true;
    currentUser = `+62 ${phone}`;
    document.getElementById('akunToggle').innerHTML = `👤 ${currentUser}`;
    
    closeLoginModal();
    showMessage(`Berhasil login dengan nomor:\n+62 ${phone}`);
}

function processGoogleLogin() {
    // Tutup modal login pertama
    closeLoginModal();
    // Buka modal simulasi google
    document.getElementById('googleLoginOverlay').style.display = 'flex';
}

function closeGoogleModal() {
    document.getElementById('googleLoginOverlay').style.display = 'none';
}

function selectGoogleAccount(userName) {
    // Set status login menjadi true dengan akun Google
    isLoggedIn = true;
    currentUser = userName;
    
    // Tutup modal google
    closeGoogleModal();
    
    // Ubah text di Navbar Akun menjadi nama user
    document.getElementById('akunToggle').innerHTML = `👤 ${userName}`;
    
    // Tampilkan notifikasi sukses
    showMessage(`Berhasil login menggunakan akun Google:\n${userName}`);
}

function confirmLanguage() {
    // Ambil bahasa yang dipilih dari radio button
    const selectedLang = document.querySelector('input[name="language"]:checked').value;
    
    // Ubah teks di Navbar
    document.getElementById('currentLang').innerText = selectedLang;
    
    // Tutup Modal
    closeLangModal();
    
    // Tampilkan pesan konfirmasi
    const langName = selectedLang === 'ID' ? 'Indonesia' : 'English';
    showMessage(`Bahasa berhasil diubah menjadi: ${langName}`);
}

// Destination Dropdown Functions
function toggleAsalDropdown() {
    const dropdown = document.getElementById('asalDropdown');
    // Menutup dropdown tujuan jika sedang terbuka
    document.getElementById('tujuanDropdown').style.display = 'none';
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectOrigin(value) {
    document.getElementById('asal').value = value;
    document.getElementById('asalDropdown').style.display = 'none';
}

function toggleDestDropdown() {
    const dropdown = document.getElementById('tujuanDropdown');
    // Menutup dropdown asal jika sedang terbuka
    document.getElementById('asalDropdown').style.display = 'none';
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectDestination(value) {
    document.getElementById('tujuan').value = value;
    document.getElementById('tujuanDropdown').style.display = 'none';
}

// Menutup dropdown jika user mengklik area di luar dropdown
document.addEventListener('click', function(event) {
    const tujuanDropdown = document.getElementById('tujuanDropdown');
    const inputTujuan = document.getElementById('tujuan');
    if (tujuanDropdown && event.target !== inputTujuan && !tujuanDropdown.contains(event.target)) {
        tujuanDropdown.style.display = 'none';
    }

    const asalDropdown = document.getElementById('asalDropdown');
    const inputAsal = document.getElementById('asal');
    if (asalDropdown && event.target !== inputAsal && !asalDropdown.contains(event.target)) {
        asalDropdown.style.display = 'none';
    }
});

// Script bawaan yang sudah dimodifikasi untuk menghindari alert()
document.addEventListener('DOMContentLoaded', function() {
    // 1. Otomatis mengisi tanggal pergi ke tanggal hari ini
    const tglPergiInput = document.getElementById('tglPergi');
    if (tglPergiInput) {
        const hariIni = new Date().toISOString().split('T')[0];
        tglPergiInput.value = hariIni;
    }

    // 2. klik pada tombol "Cari Bus"
    const btnCari = document.getElementById('btnCari');
    if (btnCari) {
        btnCari.addEventListener('click', function() {
            const asal = document.getElementById('asal').value.trim();
            const tujuan = document.getElementById('tujuan').value.trim();
            const tanggal = document.getElementById('tglPergi').value;

            // Validasi input jika kosong
            if (!asal || !tujuan) {
                showMessage('Silakan masukkan lokasi Asal dan Tujuan terlebih dahulu!');
                return;
            }

            // Simulasi proses pencarian tiket menggunakan custom message box
            showMessage(`Mencari tiket bus aktif...\n\nRute: ${asal} ➔ ${tujuan}\nTanggal Keberangkatan: ${tanggal}`);
        });
    }
});