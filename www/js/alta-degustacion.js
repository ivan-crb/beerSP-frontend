if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

async function onDeviceReady() {
    console.log("READY")
    
    let beerField = document.getElementById("beer-field")
    let searchButton = document.getElementById("search-button")
    let beerSearchResults = document.getElementsByClassName("beer-search-results")[0]
    let altaCervezaButton = document.getElementById("alta-cerveza")
    let scoreField = document.getElementById("score-field")
    let localField = document.getElementById("local-field")
    let localLabel = document.getElementById("local-field-label")
    let todosLocalesButton = document.getElementById("local-field-button")
    let altaLocalButton = document.getElementById("alta-local")
    let countryField = document.getElementById("country-field")
    let submitButton = document.getElementById("alta-degustacion-button")

    let user = JSON.parse(sessionStorage.getItem('user'));
    let current = new Date();
    let selectedCerveza = null;

    searchButton.addEventListener("click", async () => {
        if (beerField.value != "") {
            let res = await fetch(`${baseURL}/cervezas/buscar/${beerField.value}`, {
                method: "GET"
            })

            if (res.status != 200) {
                if (window.cordova) navigator.notification.alert("Hubo un error en la búsqueda", nothing, "Error", "Ok")
                else alert("Hubo un error en la búsqueda")
                return
            }

            let body = await res.json()
            beerSearchResults.innerHTML = ""

            for (let i = 0; i < body.length; i++) {
                let beerContainer = document.createElement("div")
                beerContainer.classList.add("beer-container")

                let beerText = document.createElement("div")
                beerText.classList.add("beer-text")

                let img = document.createElement("img")
                img.classList.add("beer-image")
                if (body[i].foto != null) img.src = `${body[i].foto}`
                else img.classList.add("hidden")

                let name = document.createElement("p")
                name.classList.add("beer-name")
                name.classList.add("highlight")
                name.innerText = body[i].nombre

                let description = document.createElement("p")
                description.classList.add("beer-description")
                description.innerText = body[i].descripcion

                let mean = document.createElement("p")
                mean.classList.add("beer-mean")
                if (body[i].promedio != null) mean.innerText = `Promedio: ${Math.round(body[i].promedio*100)/100}`
                else mean.innerText = ""
                
                beerText.appendChild(name)
                beerText.appendChild(description)
                beerText.appendChild(mean)
                beerContainer.appendChild(beerText)
                beerContainer.appendChild(img)
                
                beerSearchResults.appendChild(beerContainer)
            }

            let beerContainers = document.getElementsByClassName("beer-container")

            for (let i = 0; i < beerContainers.length; i++) {
                beerContainers[i].addEventListener("click", async () => {
                    selectedCerveza = body[i];

                    for (let j = 0; j < beerContainers.length; j++) {
                        if (i == j) beerContainers[j].style.backgroundColor = "#94849B"
                        else beerContainers[j].style.backgroundColor = "#A0AAB2"
                    }
                })
            }
        }
    })

    altaCervezaButton.addEventListener("click", async () => {
        window.open("alta-cerveza.html", "_self")
    })

    altaLocalButton.addEventListener("click", async () => {
        window.open("alta-local.html", "_self")
    })

    let res = await fetch(`${baseURL}/locales/usuarios/${user.id}/recientes`, {
        method: "GET"
    })

    if (res.status != 200) {
        if (window.cordova) navigator.notification.alert("Hubo un error al obtener los locales", nothing, "Error", "Ok")
        else alert("Hubo un error al obtener los locales")
        return
    }

    let body = await res.json()

    for (let i = 0; i < body.length; i++) {
        let opt = new Option(body[i].nombre, body[i].nombre)
        opt.value = body[i].id
        localField.add(opt)
    }
    
    todosLocalesButton.addEventListener("click", async () => {
        localLabel.innerText = "Locales"
        todosLocalesButton.style.display = "none"
        localField.innerHTML = ""

        let res = await fetch(`${baseURL}/locales`, {
            method: "GET"
        })

        if (res.status != 200) {
            if (window.cordova) navigator.notification.alert("Hubo un error al obtener los locales", nothing, "Error", "Ok")
            else alert("Hubo un error al obtener los locales")
            return
        }

        let body = await res.json()

        for (let i = 0; i < body.length; i++) {
            localField.add(new Option(body[i].nombre, body[i].id))
        }


    })

    
    countries = JSON.parse(countries)
    for (let country of countries) {
        countryField.add(new Option(country, country))
    }


    submitButton.addEventListener("click", async () => {
        if (selectedCerveza == null) {
            if (window.cordova) navigator.notification.alert("Los campos obligatorios deben estar rellenados", nothing, "Campos no válidos", "Ok")
            else alert("Los campos obligatorios deben estar rellenados")
            return
        }

        if (scoreField.value != null && (scoreField.value < 0 || scoreField.value > 5)) {
            if (window.cordova) navigator.notification.alert("La calificacion debe estar entre 0 y 5", nothing, "Campos no válidos", "Ok")
            else alert("La calificacion debe estar entre 0 y 5")
            return
        }

        let score = null;
        if (scoreField.value != "") score = Number(scoreField.value)

        let res = await fetch(`${baseURL}/degustaciones`, {
            method: "POST",
            body: JSON.stringify({
                usuario: user.id,
                cerveza: selectedCerveza.id,
                local: Number(localField.value),
                calificacion: score,
                pais: countryField.value,
                fechaAlta: `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (res.status == 201) {
            if (window.cordova) navigator.notification.alert("Degustación registrada con éxito", nothing, "Éxito", "Ok")
            else alert("Degustación registrada con éxito")
            window.open("main-page.html", "_self")
        }
        else {
            if (window.cordova) navigator.notification.alert("Hubo un error al registrar la degustacion", nothing, "Error", "Ok")
            else alert("Hubo un error al registrar la degustacion")
        }
    })

}

function nothing() {}