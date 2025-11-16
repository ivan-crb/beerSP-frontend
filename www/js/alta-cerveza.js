if (window.cordova) document.addEventListener('deviceready', onDeviceReady, false);
if (!window.cordova) document.addEventListener('DOMContentLoaded', onDeviceReady, false);

let baseURL = "https://beersp-latest.onrender.com";

function onDeviceReady() {
    console.log("READY")
    
    let nameField = document.getElementById("name-field")
    let imageField = document.getElementById("image-field")
    let descriptionField = document.getElementById("description-field")
    let styleField = document.getElementById("style-field")
    let countryField = document.getElementById("country-field")
    let sizeField = document.getElementById("size-field")
    let formatField = document.getElementById("format-field")
    let alcoholField = document.getElementById("alcohol-field")
    let ibuField = document.getElementById("ibu-field")
    let colorField = document.getElementById("color-field")
    let submitButton = document.getElementById("alta-cerveza-button")

    let foto = null;
    let current = new Date();
    
    countries = JSON.parse(countries)
    for (let country of countries) {
        countryField.add(new Option(country, country))
    }

    imageField.addEventListener("click", () => {
        navigator.camera.getPicture(pictureSuccess, pictureFail,
            {destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
    })

    submitButton.addEventListener("click", async () => {
        if (nameField.value == "" || foto == null || descriptionField.value == "" || alcoholField.value == "" || ibuField.value == "") {
            navigator.notification.alert("Los campos obligatorios deben estar rellenados", nothing, "Campos no válidos", "Ok")
            return
        }

        if (alcoholField.value < 0 || alcoholField.value > 100) {
            navigator.notification.alert("El porcentaje de alcohol debe estar entre 0 y 100", nothing, "Campos no válidos", "Ok")
            return
        }

        if (ibuField.value < 0) {
            navigator.notification.alert("El calificador de amargor (IBU) debe ser a partir de 0", nothing, "Campos no válidos", "Ok")
            return
        }

        let res = await fetch(`${baseURL}/cervezas`, {
            method: "POST",
            body: JSON.stringify({
                nombre: nameField.value,
                foto: foto,
                descripcion: descriptionField.value,
                estilo: styleField.value,
                procedencia: countryField.value,
                tamaño: sizeField.value,
                formato: formatField.value,
                porcentajeAlcohol: alcoholField.value,
                amargor: ibuField.value,
                color: colorField.value,
                fechaAlta: `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (res.status == 201) {
            navigator.notification.alert("Cerveza creada con éxito", nothing, "Éxito", "Ok")
            window.open("main-page.html", "_self")
        }
        else {
            navigator.notification.alert("Hubo un error al crear la cerveza", nothing, "Error", "Ok")
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