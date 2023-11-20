import KoaRouter from '@koa/router'
import swaggerJSDoc from '../config/swagger.config'

const router = new KoaRouter({ prefix: '/docs' })

router.get('/', ctx => {
  ctx.body = swaggerJSDoc
})

module.exports = router
