import * as ftp from 'basic-ftp'
import fs from 'fs'
import path from 'path'

// Opción --dry (modo simulación sin modificar el servidor)
const isDryRun = process.argv.includes('--dry')

// Leer credenciales de variables de entorno (cargadas por node --env-file=.env.local)
const host = process.env.FTP_HOST
const user = process.env.FTP_USER
const password = process.env.FTP_PASSWORD

if (!host || !user || !password) {
  console.error('\n❌ Error: Faltan credenciales FTP (FTP_HOST, FTP_USER, FTP_PASSWORD).')
  console.error('Por favor, definilas en tu archivo .env.local.')
  process.exit(1)
}

/**
 * Conexión con fallback:
 * Intenta FTPS explícito primero; si falla o no es soportado, recurre a FTP plano.
 * Nunca imprime contraseñas ni expone variables sensibles.
 */
async function getConnectedClient() {
  const client = new ftp.Client(30000)
  client.ftp.verbose = false // No exponer comandos ni credenciales

  // 1. Probar FTPS explícito
  try {
    console.log(`🔒 Probando conexión FTPS explícito a ${host}:21...`)
    await client.access({
      host,
      user,
      password,
      port: 21,
      secure: true,
      secureOptions: {
        rejectUnauthorized: false, // Soporte para certificados compartidos/self-signed
      },
    })
    console.log('✓ Conexión establecida mediante FTPS explícito.')
    return client
  } catch (ftpsErr) {
    console.log(`ℹ️ FTPS no disponible (${ftpsErr.message || 'error'}). Intentando FTP plano...`)
    try {
      client.close()
    } catch {}
  }

  // 2. Probar FTP plano
  try {
    const plainClient = new ftp.Client(30000)
    plainClient.ftp.verbose = false
    console.log(`📡 Conectando mediante FTP plano a ${host}:21...`)
    await plainClient.access({
      host,
      user,
      password,
      port: 21,
      secure: false,
    })
    console.log('✓ Conexión establecida mediante FTP plano.')
    return plainClient
  } catch (plainErr) {
    throw new Error(`Fallo de conexión al servidor FTP: ${plainErr.message || plainErr}`)
  }
}

async function runDeploy() {
  let client
  try {
    client = await getConnectedClient()

    // Acceder al directorio /htdocs
    console.log('📂 Ingresando a /htdocs...')
    try {
      await client.cd('/htdocs')
    } catch {
      await client.cd('htdocs')
    }

    // Listar contenido remoto actual
    const remoteList = await client.list()

    // MODO DRY RUN (--dry)
    if (isDryRun) {
      console.log('\n==================================================')
      console.log('📋 MODO SIMULACIÓN (--dry): Contenido actual en /htdocs')
      console.log('==================================================')
      if (remoteList.length === 0) {
        console.log(' (El directorio /htdocs está actualmente vacío)')
      } else {
        for (const item of remoteList) {
          const type = item.isDirectory ? '[DIR] ' : '[FILE]'
          const size = item.size ? `${(item.size / 1024).toFixed(1)} KB` : '-'
          const modDate = item.rawModifiedAt || ''
          console.log(` ${type}  ${item.name.padEnd(28)} ${size.padStart(10)}  ${modDate}`)
        }
      }
      console.log('==================================================')
      console.log(`Total de elementos remotos: ${remoteList.length}`)
      console.log('✓ Modo simulación finalizado. No se borró ni subió ningún archivo.')
      return
    }

    // EJECUCIÓN NORMAL
    console.log('\n🧹 Limpiando archivos obsoletos en el servidor...')

    // 1. Borrar index2.html si existe
    const hasIndex2 = remoteList.some((item) => item.name === 'index2.html')
    if (hasIndex2) {
      console.log('  → Eliminando index2.html existente...')
      await client.remove('index2.html')
    }

    // 2. Borrar SOLO la carpeta remota assets/ (para no acumular versiones viejas)
    const hasAssets = remoteList.some((item) => item.name === 'assets' && item.isDirectory)
    if (hasAssets) {
      console.log('  → Eliminando carpeta remota assets/ previa...')
      await client.removeDir('assets')
    }

    // 3. Subir contenido de dist/ (incluyendo .htaccess)
    const localDist = path.resolve('dist')
    if (!fs.existsSync(localDist)) {
      throw new Error('No se encontró la carpeta dist/. Por favor, ejecutá "npm run build" antes de desplegar.')
    }

    console.log('🚀 Subiendo todo el contenido de dist/ a /htdocs...')
    await client.uploadFromDir(localDist)

    // Confirmar que .htaccess fue subido si existe en dist
    const htaccessLocal = path.join(localDist, '.htaccess')
    if (fs.existsSync(htaccessLocal)) {
      await client.uploadFrom(htaccessLocal, '.htaccess')
    }

    // 4. Resumen final
    console.log('\n==================================================')
    console.log('🎉 Despliegue completado con éxito')
    console.log('==================================================')
    console.log('🌐 Sitio web en vivo: https://maderas.rf.gd')
    console.log('==================================================\n')
  } catch (err) {
    console.error('\n❌ Ocurrió un error durante la operación FTP:')
    console.error(err.message || err)
    console.error('\n💡 Sugerencia: Verificá que el servidor FTP esté activo y que las credenciales en .env.local sean correctas. Podés reintentar ejecutando "npm run deploy:check" o "npm run deploy".')
    process.exit(1)
  } finally {
    if (client) {
      client.close()
    }
  }
}

runDeploy()
