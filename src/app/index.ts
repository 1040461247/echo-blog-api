import Koa from 'koa'
import cors from '@koa/cors'
import bodyparser from 'koa-bodyparser'
import { koaSwagger } from 'koa2-swagger-ui'
import swaggerSpec from '../config/swagger.config'
import useRoutes, { BASE_PATH } from '../routers'
import loggerHandle from '../middlewares/log4js.middleware'
import responseHandle from './response-handle'
import errorHandle from './error-handle'

const app = new Koa()

// 判断请求路径是否以 '/api' 开头，如果不是则添加前缀
app.use(async (ctx, next) => {
  if (!ctx.path.startsWith(BASE_PATH)) {
    ctx.path = BASE_PATH + ctx.path
  }
  await next()
})

app.use(loggerHandle)
app.use(cors())
app.use(responseHandle)
app.use(bodyparser())
app.use(
  koaSwagger({
    routePrefix: '/api/doc',
    swaggerOptions: {
      spec: swaggerSpec,
    },
    hideTopbar: true,
  }),
)
useRoutes(app)

app.on('error', errorHandle)

export default app
