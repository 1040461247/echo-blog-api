import Koa from 'koa'
import cors from '@koa/cors'
import bodyparser from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import swaggerSpec from '../config/swagger.config'
import useRoutes from '../routers'
import loggerHandle from '../middlewares/log4js.middleware'
import responseHandle from './response-handle'
import errorHandle from './error-handle'

const app = new Koa()

app.use(loggerHandle)
app.use(cors())
app.use(responseHandle)
app.use(bodyparser())
app.use(
  koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      spec: swaggerSpec,
    },
  })
)
useRoutes(app)

app.on('error', errorHandle)

export default app
