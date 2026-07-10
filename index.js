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
                alert('Silakan masukkan lokasi Asal dan Tujuan terlebih dahulu!');
                return;
            }

            // Simulasi proses pencarian tiket
            alert(`Mencari tiket bus aktif...\nRute: ${asal} ➔ ${tujuan}\nTanggal Keberangkatan: ${tanggal}`);
        });
    }
});
