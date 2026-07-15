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

function closeModalOnOutsideClick(event) {
    if (event.target.id === 'languageModalOverlay') {
        closeLangModal();
    }
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