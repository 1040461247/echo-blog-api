import { Middleware } from 'koa'
import { NO_PERMISSION, UNAUTHORIZATION } from '../config/error-types.config'
import { verifyTokenCms } from '../utils/cms-authorization'
import menuService from '../services/menu.service'
import { RowDataPacket } from 'mysql2'

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

// 验证用户是否有登陆中台权限
const verifyAdmin: Middleware = async (ctx, next) => {
  const { id } = ctx.user!

  // 若用户无任何菜单权限，无法登录中台
  const menus = (await menuService.getMenusByUserId(id!)) as RowDataPacket[]
  if (menus.length === 0) {
    return ctx.fail(new Error(NO_PERMISSION))
  }

  await next()
}

export { verifyAuthCms, verifyAdmin }
