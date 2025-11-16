if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

function onDeviceReady() {
    console.log("READY")

    let usernameField = document.getElementById("username-field");
    let passwordField = document.getElementById("password-field");

    let submitButton = document.getElementById("log-in-button")


    submitButton.addEventListener("click", async () => {

        let res = await fetch(`${baseURL}/usuarios/username/${usernameField.value}`)
        let body = await res.json()

        if (res.status != 200 || body.contrasena != passwordField.value) {
            navigator.notification.alert("Usuario o contraseña incorrecto", nothing, "Fallo al iniciar sesión", "Ok")
            return
        }
        else {
            sessionStorage.setItem('user', JSON.stringify(body))
            window.open("main-page.html", "_self")
        }
    })
}

function nothing() {}