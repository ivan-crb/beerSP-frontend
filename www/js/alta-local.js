if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

function onDeviceReady() {
    console.log("READY")
    
    let nameField = document.getElementById("name-field")
    let dirField = document.getElementById("dir-field")
    let submitButton = document.getElementById("alta-local-button")

    let current = new Date();

    submitButton.addEventListener("click", async () => {
        if (nameField.value == "" || dirField.value == "null") {
            navigator.notification.alert("Los campos obligatorios deben estar rellenados", nothing, "Campos no válidos", "Ok")
            return
        }

        let res = await fetch(`${baseURL}/locales`, {
            method: "POST",
            body: JSON.stringify({
                nombre: nameField.value,
                direccion: dirField.value,
                fechaAlta: `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (res.status == 201) {
            navigator.notification.alert("Local creado con éxito", nothing, "Éxito", "Ok")
            window.open("main-page.html", "_self")
        }
        else {
            navigator.notification.alert("Hubo un error al crear el local", nothing, "Error", "Ok")
        }
    })
}

function nothing() {}