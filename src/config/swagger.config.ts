import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { APP_HOST, APP_PORT } from './env.config'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Echo Blog接口文档',
    version: '1.0.0'
  },
  host: `${APP_HOST}:${APP_PORT}`,
  basePath: '/'
}

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../routers/*.ts')]
}

const swaggerSpec = swaggerJSDoc(options) as Record<string, unknown>
export default swaggerSpec
