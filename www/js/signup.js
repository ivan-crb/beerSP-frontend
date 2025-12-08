if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

function onDeviceReady() {
    console.log("READY")

    let birthdateField = document.getElementById("birthdate-field");
    let usernameField = document.getElementById("username-field");
    let passwordField = document.getElementById("password-field");
    let passwordRepeatField = document.getElementById("password-repeat-field");
    let emailField = document.getElementById("email-field");
    let nameField = document.getElementById("name-field");
    let surnameField = document.getElementById("surname-field");
    let imageField = document.getElementById("image-field");
    let originField = document.getElementById("origin-field");
    let introField = document.getElementById("intro-field");
    let submitButton = document.getElementById("create-account-button")

    let foto = null;
    
    birthdateField.addEventListener("input", () => {
        let birthdate = new Date(birthdateField.value)
        let current = new Date()
        let age = (current - birthdate) / (1000 * 60 * 60 * 24 * 365)
        if (age >= 18) {
            birthdateField.disabled = true;
            for (let elem of document.getElementsByClassName("field-container")) {
                elem.classList.remove("hidden")
            }
            submitButton.classList.remove("hidden")
        }
        else {
            if (window.cordova) navigator.notification.alert("Tienes que ser mayor de edad para crear una cuenta en BeerSP", nothing, "Verificación de la edad", "Ok")
            else alert("Tienes que ser mayor de edad para crear una cuenta en BeerSP")
            window.open("index.html", "_self")
        }
    })

    imageField.addEventListener("click", () => {
        navigator.camera.getPicture(pictureSuccess, pictureFail,
            {destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
    })
    
    submitButton.addEventListener("click", async () => {
        if (usernameField.value == "" || passwordField.value == "" ||
                passwordRepeatField.value == "" || emailField.value == "") {
            if (window.cordova) navigator.notification.alert("Los campos obligatorios deben estar rellenados", nothing, "Campos no válidos", "Ok")
            else alert("Los campos obligatorios deben estar rellenados")
            return
        }

        let res = await fetch(`${baseURL}/usuarios/username/${usernameField.value}`)
        if (res.status != 404) {
            if (window.cordova) navigator.notification.alert("Ya existe un usuario con ese nombre de usuario", nothing, "Campos no válidos", "Ok")
            else alert("Ya existe un usuario con ese nombre de usuario")
            return
        }

        if (passwordField.value != passwordRepeatField.value) {
            if (window.cordova) navigator.notification.alert("Las contraseñas deben coincidir", nothing, "Campos no válidos", "Ok")
            else alert("Las contraseñas deben coincidir")
            return
        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            if (window.cordova) navigator.notification.alert("El correo electrónico debe tener un formato válido", nothing, "Campos no válidos", "Ok")
            else alert("El correo electrónico debe tener un formato válido")
            return
        }

        res = await fetch(`${baseURL}/usuarios`, {
            method: "POST",
            body: JSON.stringify({
                nombreUsuario: usernameField.value,
                contrasena: passwordField.value,
                fechaNacimiento: birthdateField.value,
                email: emailField.value,
                nombre: nameField.value != "" ? nameField.value : null,
                apellidos: surnameField.value != "" ? surnameField.value : null,
                foto: foto,
                procedencia: originField.value != "" ? originField.value : null,
                introduccion: introField.value != "" ? introField.value : null,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (res.status == 201) {
            if (window.cordova) navigator.notification.alert("Cuenta creada con éxito", nothing, "Bienvenido", "Ok")
            else alert("Cuenta creada con éxito")
            window.open("index.html", "_self")
        }
        else {
            if (window.cordova) navigator.notification.alert("Hubo un error al crear la cuenta", nothing, "Error", "Ok")
            else alert("Hubo un error al crear la cuenta")
        }
    })

    let pictureSuccess = (image) => {
        foto = image;        
        imageField.classList.add("hidden")
        let imageElement = document.getElementById("image")
        imageElement.src = foto;
        imageElement.classList.remove("hidden")
    }

    let pictureFail = (err) => {
        if (window.cordova) navigator.notification.alert("Hubo un error al seleccionar la imagen", nothing, "Error", "Ok")
        else alert("Hubo un error al seleccionar la imagen")
    }
}

function nothing() {}