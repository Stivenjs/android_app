GUIA DE USO DE LA APLICACION
============================

Esta documentacion explica como ocultar y mostrar la aplicacion en el menu de aplicaciones de Android, asi como construir los APKs correspondientes.

INDICE
------

1. Conceptos basicos
2. Ocultar la aplicacion del menu
3. Mostrar la aplicacion en el menu
4. Construir APKs
5. Flujo de trabajo recomendado
6. Limitaciones importantes


1. CONCEPTOS BASICOS
--------------------

La aplicacion se puede compilar en dos versiones:
- Version VISIBLE: Aparece en el menu de aplicaciones del dispositivo Android
- Version OCULTA: No aparece en el menu de aplicaciones

Esto se logra modificando el archivo AndroidManifest.xml antes de compilar el APK.
La modificacion consiste en remover o agregar la categoria LAUNCHER del intent-filter
de la actividad principal.

IMPORTANTE: La aplicacion debe estar VISIBLE durante el desarrollo normal.
Solo se debe ocultar al construir el APK de produccion que se entregara al cliente.


2. OCULTAR LA APLICACION DEL MENU
----------------------------------

Para ocultar la aplicacion del menu de aplicaciones, ejecuta:

    npm run hide-launcher

Este comando modifica el AndroidManifest.xml para remover la categoria LAUNCHER.
Despues de ejecutarlo, la aplicacion NO aparecera en el menu cuando se instale.

NOTA: Despues de ejecutar este comando, NO podras usar "npx expo run:android" 
para desarrollo porque Android requiere una actividad ejecutable durante el desarrollo.
Si necesitas seguir desarrollando, primero ejecuta "npm run show-launcher" para
restaurar la visibilidad.


3. MOSTRAR LA APLICACION EN EL MENU
------------------------------------

Para mostrar la aplicacion en el menu de aplicaciones nuevamente, ejecuta:

    npm run show-launcher

Este comando restaura la categoria LAUNCHER en el AndroidManifest.xml.
Despues de ejecutarlo, la aplicacion volvera a aparecer en el menu.

Usa este comando cuando:
- Termines de construir el APK oculto
- Necesites continuar desarrollando la aplicacion
- Quieras probar la aplicacion normalmente


4. CONSTRUIR APKs
-----------------

La aplicacion incluye dos comandos automatizados para construir APKs:

4.1 Construir APK OCULTO (para produccion)

    npm run android:build-hidden

Este comando:
1. Ejecuta automaticamente "hide-launcher" para ocultar la app
2. Construye el APK de release
3. Genera el archivo en: android/app/build/outputs/apk/release/app-release.apk

El APK generado NO aparecera en el menu de aplicaciones cuando se instale.

4.2 Construir APK VISIBLE (para desarrollo o testing)

    npm run android:build-visible

Este comando:
1. Ejecuta automaticamente "show-launcher" para mostrar la app
2. Construye el APK de release
3. Genera el archivo en: android/app/build/outputs/apk/release/app-release.apk

El APK generado SÍ aparecera en el menu de aplicaciones cuando se instale.

IMPORTANTE: Despues de construir un APK oculto, siempre ejecuta 
"npm run show-launcher" antes de continuar desarrollando.


5. FLUJO DE TRABAJO RECOMENDADO
--------------------------------

Para desarrollo normal:
1. Asegurate de que la app este visible (ejecuta "npm run show-launcher" si es necesario)
2. Desarrolla normalmente con "npm start" o "npx expo run:android"
3. Realiza tus pruebas y ajustes

Para construir APK de produccion oculto:
1. Verifica que tu codigo este listo y probado
2. Ejecuta "npm run android:build-hidden"
3. Encuentra el APK en: android/app/build/outputs/apk/release/app-release.apk
4. Ejecuta "npm run show-launcher" para restaurar el estado de desarrollo
5. Instala y prueba el APK oculto en un dispositivo antes de entregarlo

Para construir APK visible (si es necesario):
1. Ejecuta "npm run android:build-visible"
2. Encuentra el APK en: android/app/build/outputs/apk/release/app-release.apk


6. LIMITACIONES IMPORTANTES
----------------------------

6.1 No se puede ocultar dinamicamente
--------------------------------------
La aplicacion NO puede ocultarse a si misma mientras esta ejecutandose.
El ocultamiento debe hacerse ANTES de compilar el APK.

6.2 Desarrollo requiere visibilidad
------------------------------------
Durante el desarrollo, la aplicacion DEBE estar visible. Android requiere
una actividad con categoria LAUNCHER para poder ejecutar la aplicacion en
modo de desarrollo.

6.3 Permisos del dispositivo
----------------------------
La aplicacion oculta puede instalarse normalmente. Sin embargo, para ejecutarla
despues de instalada, el usuario necesitara usar ADB o un gestor de aplicaciones
que permita iniciar aplicaciones sin icono en el launcher.

6.4 No se puede volver a mostrar dinamicamente
----------------------------------------------
Una vez instalado el APK oculto, no hay forma de hacer que la aplicacion
aparezca en el menu sin desinstalar y reinstalar una version visible.

6.5 Instalacion del APK oculto
-------------------------------
Para instalar un APK oculto:
- Usa ADB: adb install -r app-release.apk
- O abre el archivo APK directamente desde el dispositivo

6.6 Ejecutar la aplicacion oculta
----------------------------------
Para ejecutar una aplicacion instalada que esta oculta:
- Usa ADB: adb shell am start -n com.anonymous.android_app/.MainActivity
- O usa un gestor de aplicaciones como "App Manager" que liste todas las apps


COMANDOS RESUMIDOS
------------------

Ocultar la app del menu:
    npm run hide-launcher

Mostrar la app en el menu:
    npm run show-launcher

Construir APK oculto:
    npm run android:build-hidden

Construir APK visible:
    npm run android:build-visible

Ubicacion del APK generado:
    android/app/build/outputs/apk/release/app-release.apk


NOTAS ADICIONALES
-----------------

- Los scripts modifican temporalmente el AndroidManifest.xml
- Siempre verifica el estado del manifest antes de construir
- Manten la aplicacion visible durante el desarrollo
- Solo oculta la aplicacion al construir el APK final de produccion
- Prueba siempre el APK oculto en un dispositivo antes de entregarlo

