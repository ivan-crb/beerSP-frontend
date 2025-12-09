if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

async function onDeviceReady() {
    console.log("READY")

    let user = JSON.parse(sessionStorage.getItem('user'));
    
    let usernameElement = document.getElementById("profile-username")
    let imageElement = document.getElementById("profile-image")
    let cervezasFavoritas = document.getElementById("cervezas-favoritas")

    usernameElement.innerText = user.nombreUsuario
    if (user.foto != null) imageElement.src = `${user.foto}`
    else imageElement.classList.add("hidden")

    let res = await fetch(`${baseURL}/cervezas/usuarios/${user.id}`, {
        method: "GET"
    })

    if (res.status != 200) {
        if (window.cordova) navigator.notification.alert("Hubo un error al cargar las cervezas favoritas", nothing, "Error", "Ok")
        else alert("Hubo un error al cargar las cervezas favoritas")
        return
    }

    let body = await res.json()
    
    for (let i = 0; i < body.length; i++) {
        let itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")
        itemContainer.classList.add("beer-container")

        let beerText = document.createElement("div")
        beerText.classList.add("beer-text")

        let beer = document.createElement("div")
        beer.classList.add("beer-name")
        beer.classList.add("highlight")
        beer.innerText = body[i].nombre

        let mean = document.createElement("div")
        mean.classList.add("beer-mean")
        if (body[i].promedio != null) mean.innerText = `Promedio: ${Math.round(body[i].promedio*100)/100}`
        else mean.classList.add("hidden")

        let img = document.createElement("img")
        img.classList.add("beer-image")
        if (body[i].foto != null) img.src = `${body[i].foto}`
        else img.classList.add("hidden")

        beerText.appendChild(beer)
        beerText.appendChild(mean)

        itemContainer.appendChild(beerText)
        itemContainer.appendChild(img)
        
        cervezasFavoritas.appendChild(itemContainer)
    }


}