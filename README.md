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
1. `npm -g install cordova`
2. `cordova platform add android`
3. `cordova build`
4. `cordova run android` (con Android Studio abierto y un emulador ejecutándose)
