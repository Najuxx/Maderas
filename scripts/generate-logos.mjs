import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const INPUT_LOGO = path.resolve('public/img/logo-original.png')

async function run() {
  if (!fs.existsSync(INPUT_LOGO)) {
    console.error('❌ No se encontró public/img/logo-original.png')
    process.exit(1)
  }

  console.log('🪵 Procesando logo y favicon de MADERAS...')

  // 1. Recorte del logo completo (left: 127, top: 140, width: 782, height: 393)
  const fullCrop = { left: 127, top: 140, width: 782, height: 393 }
  await sharp(INPUT_LOGO)
    .extract(fullCrop)
    .resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile('public/img/logo.webp')
  console.log('✓ Creado public/img/logo.webp (ancho 320px)')

  // 2. Recorte del isotipo "M" (left: 331, top: 140, width: 361, height: 195)
  const isotipoCrop = { left: 331, top: 140, width: 361, height: 195 }
  await sharp(INPUT_LOGO)
    .extract(isotipoCrop)
    .resize({ width: 256, withoutEnlargement: true })
    .webp({ quality: 95, effort: 6 })
    .toFile('public/img/logo-isotipo.webp')
  console.log('✓ Creado public/img/logo-isotipo.webp')

  // Función auxiliar para centrar el isotipo "M" en un canvas cuadrado con fondo transparente
  async function createSquareIcon(size, paddingRatio = 0.1) {
    const targetW = Math.round(size * (1 - paddingRatio * 2))
    const resizedM = await sharp(INPUT_LOGO)
      .extract(isotipoCrop)
      .resize({
        width: targetW,
        height: Math.round(targetW * (195 / 361)),
        fit: 'inside'
      })
      .toBuffer()

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedM, gravity: 'center' }])
      .png()
  }

  // 3. icon-512.png
  await (await createSquareIcon(512, 0.12)).toFile('public/icon-512.png')
  await sharp('public/icon-512.png').toFile('public/img/icon-512.png')
  console.log('✓ Creado icon-512.png (512×512)')

  // 4. apple-touch-icon.png (180×180)
  await (await createSquareIcon(180, 0.12)).toFile('public/apple-touch-icon.png')
  await sharp('public/apple-touch-icon.png').toFile('public/img/apple-touch-icon.png')
  console.log('✓ Creado apple-touch-icon.png (180×180)')

  // 5. favicon-32.png (32×32)
  const fav32Buffer = await (await createSquareIcon(32, 0.05)).toBuffer()
  fs.writeFileSync('public/favicon-32.png', fav32Buffer)
  fs.writeFileSync('public/img/favicon-32.png', fav32Buffer)
  console.log('✓ Creado favicon-32.png (32×32)')

  // 6. favicon.ico (formato ICO estándar conteniendo el PNG de 32x32)
  const icoHeader = Buffer.alloc(22)
  icoHeader.writeUInt16LE(0, 0) // Reserved
  icoHeader.writeUInt16LE(1, 2) // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4) // 1 image
  icoHeader.writeUInt8(32, 6)   // Width 32
  icoHeader.writeUInt8(32, 7)   // Height 32
  icoHeader.writeUInt8(0, 8)    // Color count
  icoHeader.writeUInt8(0, 9)    // Reserved
  icoHeader.writeUInt16LE(1, 10)// Color planes
  icoHeader.writeUInt16LE(32, 12)// Bits per pixel
  icoHeader.writeUInt32LE(fav32Buffer.length, 14) // Size of PNG data
  icoHeader.writeUInt32LE(22, 18) // Offset to PNG data
  const icoFile = Buffer.concat([icoHeader, fav32Buffer])
  fs.writeFileSync('public/favicon.ico', icoFile)
  fs.writeFileSync('public/img/favicon.ico', icoFile)
  console.log('✓ Creado favicon.ico')

  console.log('🎉 Todos los logos y favicons fueron generados con éxito.')
}

run()
