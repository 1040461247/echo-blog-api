import { MISSING_PERAMATERS, NAME_OR_PASSWORD_IS_REQUIRED, USER_ALREADY_EXISTS } from '../config/error-types.config'
import usersService from '../services/users.service'
import md5Encryp from '../utils/md5-encryp'
import type { Middleware } from 'koa'
import type { IUsers } from '../types'

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
    const { browser_info, os_info, ip_address } = ctx.request.body as IUsers
    const userId = ctx.user?.id
    if (browser_info && os_info && ip_address) ctx.fail(new Error(MISSING_PERAMATERS))
    await usersService.updateUserSystemInfo(userId!, browser_info!, os_info!, ip_address!)
    next()
  } catch (error: any) {
    ctx.fail(error)
  }
}

export { verifyRegisterInfo, encrypPwd, updateUserSystemInfo }
