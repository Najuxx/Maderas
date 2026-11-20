import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const INPUT_DIR = path.resolve('docs/diseno')
const OUTPUT_DIR = path.resolve('public/img/diseno')

async function run() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ No existe el directorio de entrada: ${INPUT_DIR}`)
    process.exit(1)
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`📁 Creado directorio: ${OUTPUT_DIR}`)
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'))
  console.log(`🖼️ Procesando ${files.length} wireframes de ${INPUT_DIR}...`)

  let processedCount = 0

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file)
    const baseName = path.parse(file).name
    const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`)

    try {
      const image = sharp(inputPath)
      const metadata = await image.metadata()

      // Redimensionar manteniendo proporción si excede 800px de ancho
      let transform = image
      if (metadata.width && metadata.width > 800) {
        transform = transform.resize({ width: 800, withoutEnlargement: true })
      }

      await transform
        .webp({ quality: 80, effort: 5 })
        .toFile(outputPath)

      const stats = fs.statSync(outputPath)
      const kb = (stats.size / 1024).toFixed(1)

      if (stats.size > 120 * 1024) {
        console.warn(`⚠️ ${baseName}.webp supera los 120 KB (${kb} KB). Re-comprimiendo con calidad 65...`)
        await sharp(inputPath)
          .resize({ width: 700, withoutEnlargement: true })
          .webp({ quality: 65, effort: 6 })
          .toFile(outputPath)
      }

      processedCount++
      console.log(`✓ [${processedCount}/${files.length}] ${baseName}.webp (${kb} KB)`)
    } catch (err) {
      console.error(`❌ Error procesando ${file}:`, err.message)
    }
  }

  console.log(`\n🎉 ¡Optimización completada! Se generaron ${processedCount} imágenes WebP en ${OUTPUT_DIR}.`)
}

run()
