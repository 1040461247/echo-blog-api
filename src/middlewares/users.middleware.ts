import type { Middleware } from 'koa'
import { NAME_OR_PASSWORD_IS_REQUIRED, USER_ALREADY_EXISTS } from '../config/error-types.config'
import usersService from '../services/users.service'
import type { IUsers } from '../types'
import getUserSystemInfo from '../utils/get-user-system-info'
import md5Encryp from '../utils/md5-encryp'
import getRedisClient, { REGISTERING_SET } from '../app/redis'

const checkForUserName: Middleware = async (ctx, next) => {
  const { name } = ctx.request.body as IUsers
  if (!name) {
    // 当没有name时放行（只在有name的情况下校验）
    await next()
  } else {
    const userRes = await usersService.getUserByName(name)
    const userExistsed = Array.isArray(userRes) && userRes.length > 0
    if (userExistsed) {
      ctx.fail(new Error(USER_ALREADY_EXISTS))
    } else {
      await next()
    }
  }
}

const verifyRegisterInfo: Middleware = async (ctx, next) => {
  const { name, password, phoneNum } = ctx.request.body as IUsers
  // 判断用户名密码不为空
  if (!name || !password) {
    return ctx.fail(new Error(NAME_OR_PASSWORD_IS_REQUIRED))
  }

  // 判断用户名是否存在
  // const userRes = await usersService.getUserByName(name)
  // const userExistsed = Array.isArray(userRes) && userRes.length > 0
  // if (userExistsed) {
  //   return ctx.fail(new Error(USER_ALREADY_EXISTS))
  // }

  // 判断手机号是否经过验证
  const redisClient = await getRedisClient()
  const isMember = await redisClient.sIsMember(REGISTERING_SET, phoneNum!)
  if (!isMember) {
    return ctx.fail(new Error('手机号未验证'))
  }
  await redisClient.sRem(REGISTERING_SET, phoneNum!)
  redisClient.quit()

  await next()
}

const encrypPwd: Middleware = async (ctx, next) => {
  const { password } = ctx.request.body as IUsers
  if (password) {
    const body = ctx.request.body as IUsers
    body.password = md5Encryp(password!)
  }
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

const updateUserLoginTime: Middleware = async (ctx, next) => {
  try {
    const nowDate = new Date()
    const userId = ctx.user?.id
    await usersService.updateUserLoginTime(nowDate, userId!)
    await next()
  } catch (error: any) {
    ctx.fail(error)
  }
}

export {
  encrypPwd,
  updateUserSystemInfo,
  verifyRegisterInfo,
  updateUserLoginTime,
  checkForUserName,
}
