import { Middleware } from 'koa'
import { NO_PERMISSION } from '../config/error-types.config'

const verifyAdmin: Middleware = async (ctx, next) => {
  if (ctx.user?.id === 1) {
    await next()
  } else {
    ctx.fail(new Error(NO_PERMISSION))
  }
}

export { verifyAdmin }
