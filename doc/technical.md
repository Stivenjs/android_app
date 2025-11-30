INFORMACION TECNICA
===================

Este documento explica los detalles tecnicos de como funciona el proceso de ocultar
la aplicacion del menu de Android.


COMO FUNCIONA
-------------

1. AndroidManifest.xml
----------------------

La aplicacion Android define sus actividades en el archivo:
    android/app/src/main/AndroidManifest.xml

Para que una aplicacion aparezca en el menu de aplicaciones, la actividad principal
debe tener un intent-filter con:
- action: android.intent.action.MAIN
- category: android.intent.category.LAUNCHER

Ejemplo de actividad visible:
    <activity android:name=".MainActivity" ...>
        <intent-filter>
            <action android:name="android.intent.action.MAIN"/>
            <category android:name="android.intent.category.LAUNCHER"/>
        </intent-filter>
    </activity>

Para ocultar la aplicacion, simplemente se remueve la linea que contiene:
    <category android:name="android.intent.category.LAUNCHER"/>

2. Scripts de modificacion
---------------------------

Los scripts se encuentran en la carpeta scripts/:

- hide-launcher.js: Busca y remueve la categoria LAUNCHER del AndroidManifest.xml
- show-launcher.js: Restaura la categoria LAUNCHER en el AndroidManifest.xml

Ambos scripts modifican directamente el archivo XML, buscando patrones especificos
y reemplazandolos o agregandolos segun sea necesario.

3. Comandos de construccion
----------------------------

Los comandos en package.json automatizan el proceso:

- android:build-hidden:
  1. Ejecuta hide-launcher.js para ocultar la app
  2. Ejecuta gradlew.bat assembleRelease para construir el APK
  3. El APK resultante estara oculto

- android:build-visible:
  1. Ejecuta show-launcher.js para mostrar la app
  2. Ejecuta gradlew.bat assembleRelease para construir el APK
  3. El APK resultante estara visible

4. Estructura del proyecto
---------------------------

    android_app/
    ├── android/
    │   ├── app/
    │   │   └── src/
    │   │       └── main/
    │   │           └── AndroidManifest.xml  (archivo modificado por los scripts)
    │   ├── gradlew.bat                      (wrapper de Gradle para Windows)
    │   └── gradle.properties
    ├── scripts/
    │   ├── hide-launcher.js                 (script para ocultar la app)
    │   └── show-launcher.js                 (script para mostrar la app)
    ├── doc/
    │   ├── usage-guide.md                   (guia de uso)
    │   └── technical.md                     (este archivo)
    └── package.json                        (comandos npm)


LIMITACIONES TECNICAS
---------------------

1. Modificacion estatica del manifest
--------------------------------------

El AndroidManifest.xml se modifica ANTES de compilar el APK. Esto significa que:
- No se puede cambiar dinamicamente mientras la app esta ejecutandose
- Cada APK tiene un estado fijo: visible u oculto
- Para cambiar el estado, se debe recompilar el APK

2. Requisitos de Android durante desarrollo
-------------------------------------------

Android requiere que durante el desarrollo haya una actividad ejecutable con
categoria LAUNCHER. Si intentas ejecutar "npx expo run:android" sin la categoria
LAUNCHER, obtendras el error:
    "AndroidManifest.xml is missing a runnable activity element"

3. Seguridad de Android
------------------------

Android no permite que una aplicacion se oculte a si misma dinamicamente por
razones de seguridad. Esta restriccion solo puede ser superada con:
- Permisos de administrador del dispositivo
- Root del dispositivo
- Modificacion del manifest antes de compilar

Por esta razon, el metodo utilizado es modificar el manifest antes de compilar.

4. Ejecucion de aplicaciones ocultas
-------------------------------------

Una aplicacion sin categoria LAUNCHER puede:
- Ser instalada normalmente
- Ser ejecutada usando ADB
- Ser ejecutada desde gestores de aplicaciones avanzados
- NO puede ser iniciada desde el menu de aplicaciones

Para ejecutar una aplicacion oculta usando ADB:
    adb shell am start -n com.anonymous.android_app/.MainActivity

Reemplaza "com.anonymous.android_app" con el nombre del paquete de tu aplicacion.


ALTERNATIVAS CONSIDERADAS
--------------------------

1. Modificacion dinamica con PackageManager
-------------------------------------------

Se intento usar PackageManager de Android para deshabilitar componentes
dinamicamente, pero esto requiere:
- Permisos de administrador del dispositivo
- Root del dispositivo
- Aprovisionamiento especial

Esta opcion fue descartada por su complejidad y requisitos adicionales.

2. Múltiples builds con flavors
--------------------------------

Se podria usar flavors de Gradle para construir versiones visibles y ocultas
sin modificar el manifest manualmente. Esta opcion fue descartada por simplicidad
del proyecto actual, pero podria implementarse en el futuro si es necesario.

3. Plugin de Expo Config
-------------------------

Se podria crear un plugin de Expo Config que modifique el manifest automaticamente
basado en variables de entorno. Esta opcion fue considerada pero se prefirio
la simplicidad de los scripts Node.js.


SOLUCION DE PROBLEMAS
---------------------

Error: "AndroidManifest.xml is missing a runnable activity element"
- Solucion: Ejecuta "npm run show-launcher" para restaurar la categoria LAUNCHER

Error: "'.' is not recognized as an internal or external command"
- Solucion: Los scripts ya usan gradlew.bat que funciona en Windows

Error: El APK oculto no se oculta
- Verificacion: Abre el APK como archivo ZIP y revisa AndroidManifest.xml dentro
- Debe estar comentada o removida la linea con category LAUNCHER

La aplicacion oculta no se puede ejecutar
- Usa ADB: adb shell am start -n com.anonymous.android_app/.MainActivity
- O instala un gestor de aplicaciones que permita ejecutar apps sin icono


VERIFICACION DEL ESTADO
------------------------

Para verificar si la aplicacion esta oculta o visible, revisa el archivo:
    android/app/src/main/AndroidManifest.xml

Busca la actividad MainActivity y su intent-filter:

Si esta visible, encontraras:
    <category android:name="android.intent.category.LAUNCHER"/>

Si esta oculta, encontraras un comentario como:
    <!-- LAUNCHER category removida para ocultar la app del launcher -->

O simplemente no encontraras la categoria LAUNCHER.


CONFIGURACION DE GRADLE
------------------------

El archivo android/gradle.properties contiene configuraciones importantes:

- org.gradle.jvmargs: Configuracion de memoria para el proceso de compilacion
- org.gradle.java.home: NO debe estar configurado (se detecta automaticamente JAVA_HOME)

La variable de entorno JAVA_HOME debe estar configurada en el sistema apuntando
al directorio del JDK instalado (JDK 17 recomendado).

Gradle detecta automaticamente JAVA_HOME si esta configurado como variable de
entorno del sistema. No es necesario especificarlo en gradle.properties.


NOMBRE DEL PAQUETE
------------------

El nombre del paquete de la aplicacion es:
    com.anonymous.android_app

Este nombre se usa para:
- Identificar la aplicacion en el dispositivo
- Ejecutar la aplicacion oculta con ADB
- Desinstalar la aplicacion

Para cambiar el nombre del paquete, modifica:
- android/app/build.gradle (applicationId)
- android/app/src/main/AndroidManifest.xml (package)
- Y actualiza las referencias en los comandos ADB

