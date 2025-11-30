#!/usr/bin/env node

/**
 * Script para quitar LAUNCHER del AndroidManifest antes de compilar el APK
 * Esto oculta la app del menú de aplicaciones
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.error('   AndroidManifest.xml no encontrado en:', manifestPath);
  process.exit(1);
}

let manifestContent = fs.readFileSync(manifestPath, 'utf-8');

// Verificar si LAUNCHER ya está removido
if (!manifestContent.includes('android.intent.category.LAUNCHER')) {
  console.log('   LAUNCHER ya está removido del manifest');
  process.exit(0);
}

// Remover LAUNCHER category
const originalContent = manifestContent;
manifestContent = manifestContent.replace(
  /(\s*)<category android:name="android.intent.category.LAUNCHER"\/>/g,
  '$1<!-- LAUNCHER category removida para ocultar la app del launcher -->'
);

// Si no cambió, intentar otro patrón
if (manifestContent === originalContent) {
  manifestContent = manifestContent.replace(
    /<category\s+android:name="android.intent.category.LAUNCHER"\s*\/>/g,
    '<!-- LAUNCHER category removida para ocultar la app del launcher -->'
  );
}

if (manifestContent === originalContent) {
  console.error('   No se pudo encontrar LAUNCHER en el manifest');
  process.exit(1);
}

fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
console.log('   LAUNCHER removido del AndroidManifest.xml');
console.log('   La app NO aparecerá en el menú de aplicaciones');



