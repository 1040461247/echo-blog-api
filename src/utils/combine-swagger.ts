import fs from 'fs'
import path from 'path'
import SwaggerParser from '@apidevtools/swagger-parser'

const combineSwaggerSpecs = async () => {
  try {
    let combinedSpec = {}
    const routersPath = path.resolve(__dirname, '../routers')
    fs.readdirSync(routersPath).forEach(async (file) => {
      const filePath = path.resolve(routersPath, file)
      const fileStats = fs.statSync(filePath)

      if (fileStats.isDirectory()) {
        const moduleSwaggerConfig = await SwaggerParser.bundle(
          path.resolve(filePath, './swagger.yaml'),
        )

        combinedSpec = {
          ...combinedSpec,
          ...moduleSwaggerConfig,
        }
      }
    })
  } catch (error) {
    console.error('Error combining Swagger specs:', error)
  }
}

export default combineSwaggerSpecs
