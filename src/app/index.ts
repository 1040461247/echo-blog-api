import Koa from 'koa'
import cors from '@koa/cors'
import { koaSwagger } from 'koa2-swagger-ui'
import bodyparser from 'koa-bodyparser'
import useRoutes from '../routes'
import loggerHandle from '../middlewares/log4js.middleware'
import responseHandle from './response-handle'
import errorHandle from './error-handle'

const app = new Koa()

app.use(loggerHandle)
app.use(cors())
app.use(responseHandle)
app.use(bodyparser)
app.use(
  koaSwagger({
    routePrefix: '/swagger', // 访问 Swagger UI 的路径
    swaggerOptions: {
      url: '/docs',
    },
  })
)
useRoutes(app)

app.on('error', errorHandle)

export default app
