# Documentación de Scripts de Launcher

Esta documentación explica cómo funcionan los scripts para ocultar y mostrar la aplicación en el menú de aplicaciones de Android, y cómo utilizarlos correctamente.

## Requisitos Previos

### Java JDK 17

Antes de ejecutar cualquier script de compilación, es necesario tener instalado **Java JDK 17** (LTS). 

**Descarga e instalación:**
- Visita: https://adoptium.net/temurin/releases/?version=17&os=any&arch=any
- Descarga la versión correspondiente a tu sistema operativo
- Instala el JDK y configura la variable de entorno `JAVA_HOME` apuntando a la instalación

**Verificar instalación:**
```bash
java -version
# Debe mostrar versión 17.x.x
```

## Proceso de Compilación

### Paso 1: Compilar la aplicación

**IMPORTANTE:** Antes de ejecutar los scripts de launcher, primero debes compilar la aplicación Android:

```bash
npx expo run:android
```

Este comando:
- Genera la estructura nativa de Android en la carpeta `android/`
- Compila la aplicación por primera vez
- Crea el archivo `AndroidManifest.xml` necesario para los scripts

**Nota:** Este paso solo es necesario la primera vez o cuando se regenera el proyecto nativo.

### Paso 2: Ejecutar scripts de launcher

Una vez compilada la aplicación, puedes usar los scripts para controlar la visibilidad de la app en el menú de aplicaciones.

## Scripts Disponibles

### 1. `hide-launcher.js`

**Propósito:** Oculta la aplicación del menú de aplicaciones de Android.

**Funcionamiento:**
- Lee el archivo `android/app/src/main/AndroidManifest.xml`
- Busca la categoría `android.intent.category.LAUNCHER` en los intent-filters
- Reemplaza la categoría LAUNCHER con un comentario XML
- Guarda los cambios en el manifest

**Código clave:**
```javascript
// Busca y reemplaza la categoría LAUNCHER
manifestContent = manifestContent.replace(
  /(\s*)<category android:name="android.intent.category.LAUNCHER"\/>/g,
  '$1<!-- LAUNCHER category removida para ocultar la app del launcher -->'
);
```

**Ejecución:**
```bash
npm run hide-launcher
```

**Resultado:** La aplicación no aparecerá en el menú de aplicaciones del dispositivo Android, pero seguirá siendo instalable y ejecutable mediante comandos ADB o intents directos.

---

### 2. `show-launcher.js`

**Propósito:** Restaura la visibilidad de la aplicación en el menú de aplicaciones.

**Funcionamiento:**
- Lee el archivo `android/app/src/main/AndroidManifest.xml`
- Verifica si la categoría LAUNCHER ya está presente
- Busca el intent-filter con `android.intent.action.MAIN`
- Agrega la categoría `android.intent.category.LAUNCHER` después de la acción MAIN
- Guarda los cambios en el manifest

**Código clave:**
```javascript
// Restaura la categoría LAUNCHER después de MAIN action
manifestContent = manifestContent.replace(
  /(\s*)<action android:name="android.intent.action.MAIN"\/>/,
  '$1<action android:name="android.intent.action.MAIN"/>$1<category android:name="android.intent.category.LAUNCHER"/>'
);
```

**Ejecución:**
```bash
npm run show-launcher
```

**Resultado:** La aplicación volverá a aparecer en el menú de aplicaciones del dispositivo Android.

---

## Scripts de Compilación Completa

El `package.json` incluye dos scripts que combinan la modificación del launcher con la compilación del APK:

### `android:build-hidden`

Compila un APK con la aplicación oculta del menú de aplicaciones.

```bash
npm run android:build-hidden
```

**Proceso:**
1. Ejecuta `hide-launcher` para ocultar la app
2. Cambia al directorio `android/`
3. Ejecuta `gradlew.bat assembleRelease` para generar el APK de release

**Ubicación del APK generado:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

### `android:build-visible`

Compila un APK con la aplicación visible en el menú de aplicaciones.

```bash
npm run android:build-visible
```

**Proceso:**
1. Ejecuta `show-launcher` para mostrar la app
2. Cambia al directorio `android/`
3. Ejecuta `gradlew.bat assembleRelease` para generar el APK de release

**Ubicación del APK generado:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Flujo de Trabajo Recomendado

### Para desarrollo normal (app visible):

```bash
# 1. Compilar la aplicación (solo primera vez o después de cambios nativos)
npx expo run:android

# 2. Si necesitas ocultar temporalmente para pruebas
npm run hide-launcher

# 3. Para restaurar la visibilidad
npm run show-launcher
```

### Para generar APK de release visible:

```bash
# 1. Asegúrate de haber compilado antes
npx expo run:android

# 2. Generar APK visible
npm run android:build-visible
```

### Para generar APK de release oculta:

```bash
# 1. Asegúrate de haber compilado antes
npx expo run:android

# 2. Generar APK oculta
npm run android:build-hidden
```

---

## Estructura del AndroidManifest.xml

### Estado Normal (Visible):
```xml
<intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
</intent-filter>
```

### Estado Oculto (Después de hide-launcher):
```xml
<intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <!-- LAUNCHER category removida para ocultar la app del launcher -->
</intent-filter>
```

---

## Manejo de Errores

Los scripts incluyen validaciones para manejar errores comunes:

1. **AndroidManifest.xml no encontrado:**
   - Error: `AndroidManifest.xml no encontrado en: [ruta]`
   - Solución: Ejecuta `npx expo run:android` primero para generar la estructura nativa

2. **LAUNCHER ya está presente/removido:**
   - Los scripts verifican el estado actual y salen silenciosamente si no hay cambios necesarios

3. **No se pudo encontrar/restaurar LAUNCHER:**
   - Error: El formato del manifest puede ser diferente al esperado
   - Solución: Revisa manualmente el `AndroidManifest.xml` y ajusta los scripts si es necesario

---

## Notas Importantes

- Los scripts modifican directamente el archivo `AndroidManifest.xml` en `android/app/src/main/`
- Si regeneras el proyecto nativo con `npx expo prebuild`, los cambios se perderán
- Los scripts son específicos para Windows (usan `gradlew.bat`). Para Linux/Mac, modifica los scripts de compilación para usar `./gradlew` en lugar de `gradlew.bat`
- Los scripts son idempotentes: puedes ejecutarlos múltiples veces sin problemas
- Los cambios se pueden revertir manualmente editando el `AndroidManifest.xml` si es necesario

---

## Referencias

- [Eclipse Temurin JDK 17](https://adoptium.net/temurin/releases/?version=17&os=any&arch=any)
- [Android Intent Filters](https://developer.android.com/guide/components/intents-filters)
- [Expo Android Build](https://docs.expo.dev/build/introduction/)

