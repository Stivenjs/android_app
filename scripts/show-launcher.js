#!/usr/bin/env node

/**
 * Script para restaurar LAUNCHER en el AndroidManifest
 * Esto muestra la app en el menú de aplicaciones nuevamente
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.error('   AndroidManifest.xml no encontrado en:', manifestPath);
  process.exit(1);
}

let manifestContent = fs.readFileSync(manifestPath, 'utf-8');

// Verificar si LAUNCHER ya está presente
if (manifestContent.includes('<category android:name="android.intent.category.LAUNCHER"')) {
  console.log('   LAUNCHER ya está presente en el manifest');
  process.exit(0);
}

// Restaurar LAUNCHER category
const originalContent = manifestContent;
manifestContent = manifestContent.replace(
  /(\s*)<action android:name="android.intent.action.MAIN"\/>/,
  '$1<action android:name="android.intent.action.MAIN"/>$1<category android:name="android.intent.category.LAUNCHER"/>'
);

// Si no funciona, buscar el intent-filter completo
if (manifestContent === originalContent) {
  manifestContent = manifestContent.replace(
    /(<intent-filter>\s*<action android:name="android.intent.action.MAIN"\/>)/,
    '$1\n        <category android:name="android.intent.category.LAUNCHER"/>'
  );
}

if (manifestContent === originalContent) {
  console.error('   No se pudo restaurar LAUNCHER en el manifest');
  process.exit(1);
}

fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
console.log('   LAUNCHER restaurado en el AndroidManifest.xml');
console.log('   La app aparecerá en el menú de aplicaciones');



