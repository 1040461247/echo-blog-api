import {
  NAME_OR_PASSWORD_IS_REQUIRED,
  NO_PERMISSION,
  PASSWORD_ERROR,
  UNAUTHORIZATION,
  USER_DOES_NOT_EXISTS
} from '../config/error-types.config'
import userService from '../services/users.service'
import authService from '../services/auth.service'
import md5Encryp from '../utils/md5-encryp'
import { verifyToken } from '../utils/authorization'
import type { DefaultContext, Middleware } from 'koa'
import type { IUsers, TResources } from '../types'
import { IMiddleware } from 'koa-router'
import { ISuccessOption } from '../app/response-handle'

const verifyAccount: Middleware = async (ctx, next) => {
  // 验证用户名密码是否为空
  const { name, password } = ctx.request.body as IUsers
  if (!name || !password) {
    console.log(name, password)
    return ctx.fail(new Error(NAME_OR_PASSWORD_IS_REQUIRED))
  }

  // 验证用户名是否存在
  const userRes = await userService.getUserByName(name)
  let userInfo: any = null
  if (Array.isArray(userRes)) {
    userInfo = userRes[0]
  }
  if (!userInfo) {
    return ctx.fail(new Error(USER_DOES_NOT_EXISTS))
  }

  // 判断密码是否正确
  const encryptedPwd = md5Encryp(password)
  if (encryptedPwd !== userInfo.password) {
    return ctx.fail(new Error(PASSWORD_ERROR))
  }

  ctx.user = userInfo
  await next()
}

const verifyAuth: Middleware = async (ctx, next) => {
  const token = ctx.header.authorization?.replace('Bearer ', '')
  if (!token) ctx.fail(new Error(UNAUTHORIZATION))

  try {
    const user = verifyToken(token!)
    ctx.user! = user
    await next()
  } catch (error: any) {
    ctx.fail(error)
  }
}

const verifyPermission = (resourceName: TResources) => {
  // 检查用户是否有某资源的操作权限
  return async (ctx: DefaultContext, next: () => Promise<any>) => {
    const paramsKeys = Object.keys(ctx.params)
    const resourceFiledId = ctx.params[paramsKeys[0]]
    const userId = ctx.user!.id!

    try {
      const hasPermision = await authService.hasPermission(resourceName, resourceFiledId, userId)
      if (hasPermision) {
        await next()
      } else {
        ctx.fail(new Error(NO_PERMISSION))
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export { verifyAccount, verifyAuth, verifyPermission }
