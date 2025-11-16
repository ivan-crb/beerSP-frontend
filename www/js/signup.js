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
            navigator.notification.alert("Tienes que ser mayor de edad para crear una cuenta en BeerSP", nothing, "Verificación de la edad", "Ok")
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
            navigator.notification.alert("Los campos obligatorios deben estar rellenados", nothing, "Campos no válidos", "Ok")
            return
        }

        let res = await fetch(`${baseURL}/usuarios/username/${usernameField.value}`)
        if (res.status != 404) {
            navigator.notification.alert("Ya existe un usuario con ese nombre de usuario", nothing, "Campos no válidos", "Ok")
            return
        }

        if (passwordField.value != passwordRepeatField.value) {
            navigator.notification.alert("Las contraseñas deben coincidir", nothing, "Campos no válidos", "Ok")
            return
        }

        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            navigator.notification.alert("El correo electrónico debe tener un formato válido", nothing, "Campos no válidos", "Ok")
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
            navigator.notification.alert("Cuenta creada con éxito", nothing, "Bienvenido", "Ok")
            window.open("index.html", "_self")
        }
        else {
            navigator.notification.alert("Hubo un error al crear la cuenta", nothing, "Error", "Ok")
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
        navigator.notification.alert("Hubo un error al seleccionar la imagen", nothing, "Error", "Ok")
    }
}

function nothing() {}