if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

function onDeviceReady() {
    console.log("READY")

    let user = JSON.parse(sessionStorage.getItem('user'));
    
    let usernameElement = document.getElementById("profile-username")
    let imageElement = document.getElementById("profile-image")

    usernameElement.innerText = user.nombreUsuario
    imageElement.src = `${user.foto}`
}