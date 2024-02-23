import { Middleware } from 'koa'
import { UNAUTHORIZATION } from '../config/error-types.config'
import { verifyTokenCms } from '../utils/cms-authorization'

const verifyAuthCms: Middleware = async (ctx, next) => {
  const token = ctx.header.authorization?.replace('Bearer ', '')
  if (!token) ctx.fail(new Error(UNAUTHORIZATION))

  try {
    const user = await verifyTokenCms(token!)
    ctx.user! = user
    await next()
  } catch (error: any) {
    console.log(error)
    ctx.fail(error)
  }
}

export { verifyAuthCms }
