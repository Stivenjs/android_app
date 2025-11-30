REFERENCIA RAPIDA
=================

Comandos esenciales para ocultar/mostrar la aplicacion y construir APKs.


COMANDOS PRINCIPALES
--------------------

Desarrollo normal (app visible):
    npm run show-launcher
    npm start

Ocultar la app del menu:
    npm run hide-launcher

Mostrar la app en el menu:
    npm run show-launcher

Construir APK OCULTO (para produccion):
    npm run android:build-hidden

Construir APK VISIBLE (para desarrollo):
    npm run android:build-visible


UBICACION DEL APK
-----------------

Una vez construido, el APK se encuentra en:
    android/app/build/outputs/apk/release/app-release.apk


FLUJO RAPIDO
------------

Para construir APK oculto para el cliente:

1. npm run android:build-hidden
2. Ubicar APK en android/app/build/outputs/apk/release/
3. npm run show-launcher (para poder seguir desarrollando)
4. Probar el APK en un dispositivo antes de entregarlo


ESTADO DE LA APLICACION
-----------------------

Verificar si la app esta visible u oculta:
    Revisar android/app/src/main/AndroidManifest.xml
    
    Buscar: <category android:name="android.intent.category.LAUNCHER"/>
    
    - Si esta presente: APP VISIBLE
    - Si esta comentada o ausente: APP OCULTA


EJECUTAR APP OCULTA
-------------------

Si instalaste un APK oculto y quieres ejecutarlo:

    adb shell am start -n com.anonymous.android_app/.MainActivity


SOLUCION RAPIDA DE ERRORES
---------------------------

Error: "missing a runnable activity element"
    Solucion: npm run show-launcher

Error: No puedo desarrollar con la app oculta
    Solucion: npm run show-launcher (siempre visible para desarrollo)

El APK oculto no funciona
    Verificar: Abre el APK como ZIP y revisa AndroidManifest.xml
    Usar ADB para ejecutar la aplicacion

