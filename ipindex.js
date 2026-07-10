const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", function(e){

    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const tanggalLahir = document.getElementById("tanggalLahir").value;
    const kontak = document.getElementById("kontak").value;
    const email = document.getElementById("email").value;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if(
        nama === "" ||
        tanggalLahir === "" ||
        kontak === "" ||
        email === "" ||
        !gender
    ){
        alert("Mohon lengkapi semua data!");
        return;
    }

    alert(
        "Data berhasil disimpan!\n\n" +
        "Nama: " + nama +
        "\nTanggal Lahir: " + tanggalLahir +
        "\nJenis Kelamin: " + gender.value +
        "\nKontak: " + kontak +
        "\nEmail: " + email
    );

});