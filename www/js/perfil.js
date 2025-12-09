if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

async function onDeviceReady() {
    console.log("READY")

    let imageElement = document.getElementById("profile-image")
    let usernameElement = document.getElementById("profile-username")
    let emailElement = document.getElementById("profile-email")
    let nameElement = document.getElementById("profile-name")
    let surnameElement = document.getElementById("profile-surname")
    let birthdateElement = document.getElementById("profile-birthdate")
    let originElement = document.getElementById("profile-origin")
    let introElement = document.getElementById("profile-intro")
    let degustacionesRecientes = document.getElementById("degustaciones-recientes")    
    let localesRecientes = document.getElementById("locales-recientes")  

    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user.foto != null) imageElement.src = `${user.foto}`
    else imageElement.classList.add("hidden")
    usernameElement.innerText = user.nombreUsuario
    emailElement.innerText = user.email
    if (user.nombre != null) nameElement.innerText = user.nombre
    else nameElement.classList.add("hidden")
    if (user.apellidos != null) surnameElement.innerText = user.apellidos
    else surnameElement.classList.add("hidden")
    let birthdateArray = user.fechaNacimiento.split("-")
    birthdateElement.innerText = birthdateArray[2] + "/" + birthdateArray[1] + "/" + birthdateArray[0]
    if (user.procedencia != null) originElement.innerText = user.procedencia
    else originElement.classList.add("hidden")
    if (user.introduccion != null) introElement.innerText = user.introduccion
    else introElement.classList.add("hidden")

    let res = await fetch(`${baseURL}/degustaciones/usuarios/${user.id}/ultimos`, {
        method: "GET"
    })

    if (res.status != 200) {
        if (window.cordova) navigator.notification.alert("Hubo un error al cargar las degustaciones recientes", nothing, "Error", "Ok")
        else alert("Hubo un error al cargar las degustaciones recientes")
        return
    }

    let body = await res.json()

    for (let i = 0; i < body.length; i++) {
        let itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")

        let beer = document.createElement("div")
        beer.classList.add("tasting-beer")
        beer.classList.add("highlight")
        beer.innerText = body[i].cerveza.nombre
    
        let score = document.createElement("div")
        score.classList.add("tasting-score")
        if (body[i].calificacion != null) score.innerText = `Calificación: ${body[i].calificacion}`
        else score.classList.add("hidden")

        let date = document.createElement("div")
        date.classList.add("tasting-date")
        let dateArray = body[i].fechaAlta.split("-")
        date.innerText = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]

        itemContainer.appendChild(beer)
        itemContainer.appendChild(score)
        itemContainer.appendChild(date)

        degustacionesRecientes.appendChild(itemContainer)
    }

    res = await fetch(`${baseURL}/locales/usuarios/${user.id}/ultimos`, {
        method: "GET"
    })

    if (res.status != 200) {
        if (window.cordova) navigator.notification.alert("Hubo un error al cargar los locales recientes", nothing, "Error", "Ok")
        else alert("Hubo un error al cargar los locales recientes")
        return
    }

    body = await res.json()

    for (let i = 0; i < body.length; i++) {
        let itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")

        let name = document.createElement("div")
        name.classList.add("bar-name")
        name.classList.add("highlight")
        name.innerText = body[i].nombre
    
        let dir = document.createElement("div")
        dir.classList.add("bar-dir")
        dir.innerText = body[i].direccion

        let date = document.createElement("div")
        date.classList.add("beer-date")
        let dateArray = body[i].fechaAlta.split("-")
        date.innerText = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]

        itemContainer.appendChild(name)
        itemContainer.appendChild(dir)
        itemContainer.appendChild(date)

        localesRecientes.appendChild(itemContainer)
    }
}