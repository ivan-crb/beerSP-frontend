Requisitos:
- Node
- Npm
- JDK
- Gradle
- Android Studio
    - Android 13.0 ("Tiramisu")
    - Android SDK Build-Tools 
    - Android SDK Command-line Tools (y sus binarios añadidos al PATH)
    - An Android Emulator
    - Android SDK Platform-Tools
    - Variable de entorno ANDROID_HOME con direccion a la carpeta Sdk root de Android

Instrucciones:
- Una vez:
1. `npm -g install cordova`
2. `cordova platform add android`
- Cada vez que se quiera ejecutar:
4. `cordova build`
5. `cordova run android` (con Android Studio abierto y un emulador ejecutándose)
