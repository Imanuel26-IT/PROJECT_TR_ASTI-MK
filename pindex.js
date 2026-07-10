const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function(){

    const keyword = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".bus-card");

    cards.forEach(card => {

        const isi = card.textContent.toLowerCase();

        if(isi.includes(keyword)){
            card.style.display = "flex";
        }
        else{
            card.style.display = "none";
        }

    });

});