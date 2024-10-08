// Sélectionne l'élément HTML avec la classe "cp"
const inputCP = document.querySelector(".cp");
// Séléctionne l'élément HTML avec la classe "ville"
const selectVille = document.querySelector(".ville");

var map = L.map('map', {
    center: [46.7944125670863, 2.5347100800075673], // lat, lng
    zoom: 5 // 10 for big cities, 15 for villages
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale().addTo(map);



// Ajoute un écouteur d'événement "input" (pendant la saisie) au champ de code postal
inputCP.addEventListener("input", () => {
    // Récupère la valeur entrée dans le champ de code postal
    let value = inputCP.value;
    // Vide le contenu actuel de la liste de sélection de ville
    selectVille.innerText = null;

    let markers = [];

    // Effectue une requête fetch vers l'API de géolocalisation avec le code postal saisi
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${value}&fields=region,nom,code,codesPostaux,centre,codeRegionéformat=json&geometry=centre`)
        // Convertit la réponse en format JSON
        .then((response) => response.json())
        // Une fois que les données JSON sont disponibles
        .then((data) => {
            // Affiche les données dans la console (pour debug si besoin)
            console.log(data)
            // Parcours de chaque objet "ville" dans les données récupérées
            data.forEach((ville) => {
                // Crée un nouvel élément d'option HTML
                let option = document.createElement("option")

                // Définit la valeur de l'option comme le code de la ville
                option.value = `${ville.code}`;

                // Définit le texte affiché de l'option comme le nom de la ville
                option.innerHTML = `${ville.nom}`;
                // Ajoute l'option à la liste de sélection de ville
                selectVille.appendChild(option);

                const coor = ville.centre.coordinates; // coor = array

                console.log("Coordonnées " + ville.nom + ": " + coor);

                var marker = L.marker([coor[1], coor[0]]).addTo(map).bindPopup(ville.nom);

                markers.push(marker);

                var group = new L.featureGroup(markers);



                map.fitBounds(group.getBounds(), {padding: [20, 20]});
            })
            console.log(markers);
        })

});