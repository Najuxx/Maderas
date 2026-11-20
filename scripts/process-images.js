import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const BRAIN_DIR = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\f57db04e-4f91-4079-b5e3-22453bf6d167'
const OUT_DIR = path.resolve('public/img/productos')

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

const targetMap = {
  'tabla_de_picar_nogal': 'tabla-de-picar-nogal.webp',
  'set_cucharas': 'set-cucharas.webp',
  'bowl_algarrobo': 'bowl-algarrobo.webp',
  'posavasos': 'posavasos.webp',
  'estante_pino': 'estante-pino.webp',
  'perchero_pared': 'perchero-pared.webp',
  'portallaves': 'portallaves.webp',
  'banquito': 'banquito.webp',
  'caja_organizadora': 'caja-organizadora.webp',
  'organizador_escritorio': 'organizador-escritorio.webp',
  'macetero': 'macetero.webp',
  'bandeja_desayuno': 'bandeja-desayuno.webp',
}

async function processAll() {
  if (!fs.existsSync(BRAIN_DIR)) {
    console.log('Brain dir does not exist');
    return;
  }

  const files = fs.readdirSync(BRAIN_DIR);
  console.log('Found files in brain dir:', files.length);

  for (const [key, outName] of Object.entries(targetMap)) {
    // Find matching file
    const matched = files.find(f => f.startsWith(key) && (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')));
    if (matched) {
      const srcPath = path.join(BRAIN_DIR, matched);
      const destPath = path.join(OUT_DIR, outName);

      try {
        await sharp(srcPath)
          .resize(800, 800, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 82 })
          .toFile(destPath);

        const stats = fs.statSync(destPath);
        const kb = (stats.size / 1024).toFixed(1);
        console.log(`✓ Processed ${outName} (${kb} KB)`);
      } catch (err) {
        console.error(`Error processing ${matched}:`, err);
      }
    } else {
      console.log(`Pending image for: ${key}`);
    }
  }
}

processAll();
