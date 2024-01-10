import type { Middleware } from 'koa'
import { NAME_OR_PASSWORD_IS_REQUIRED, USER_ALREADY_EXISTS } from '../config/error-types.config'
import usersService from '../services/users.service'
import type { IUsers } from '../types'
import getUserSystemInfo from '../utils/get-user-system-info'
import md5Encryp from '../utils/md5-encryp'

const verifyRegisterInfo: Middleware = async (ctx, next) => {
  const { name, password } = ctx.request.body as IUsers
  // 判断用户名密码不为空
  if (!name || !password) {
    return ctx.fail(new Error(NAME_OR_PASSWORD_IS_REQUIRED))
  }

  // 判断用户名是否存在
  const userRes = await usersService.getUserByName(name)
  const userExistsed = Array.isArray(userRes) && userRes.length > 0
  if (userExistsed) {
    return ctx.fail(new Error(USER_ALREADY_EXISTS))
  }

  await next()
}

const encrypPwd: Middleware = async (ctx, next) => {
  const { password } = ctx.request.body as IUsers
  ;(ctx.request.body as IUsers).password = md5Encryp(password)

  await next()
}

const updateUserSystemInfo: Middleware = async (ctx, next) => {
  try {
    const { browserInfo, osInfo, ipAddress } = getUserSystemInfo(ctx)
    const userId = ctx.user?.id
    await usersService.updateUserSystemInfo(userId!, browserInfo, osInfo, ipAddress)
    await next()
  } catch (error: any) {
    ctx.fail(error)
  }
}

export { encrypPwd, updateUserSystemInfo, verifyRegisterInfo }
