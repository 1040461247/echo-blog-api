import type { DefaultContext, Middleware } from 'koa'
import getRedisClient, { OTPS_HASH } from '../app/redis'
import {
  MISSING_PERAMATERS,
  NAME_OR_PASSWORD_IS_REQUIRED,
  NO_PERMISSION,
  PASSWORD_ERROR,
  UNAUTHORIZATION,
  USER_DOES_NOT_EXISTS,
} from '../config/error-types.config'
import authService from '../services/auth.service'
import userService from '../services/users.service'
import type { IUsers, TResources } from '../types'
import { verifyToken } from '../utils/authorization'
import md5Encryp from '../utils/md5-encryp'
import AliyunSMSClient from '../utils/send-sms'

// 校验账号
const verifyAccount: Middleware = async (ctx, next) => {
  // 验证用户名密码是否为空
  const { name, password } = ctx.request.body as IUsers
  if (!name || !password) {
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
  ctx.user = { id: userInfo.id, name: userInfo.name }

  await next()
}

// token鉴权
const verifyAuth: Middleware = async (ctx, next) => {
  try {
    const token = ctx.header.authorization?.replace('Bearer ', '')
    if (!token) ctx.fail(new Error(UNAUTHORIZATION))

    const user = await verifyToken(token!)
    ctx.user! = user
    await next()
  } catch (error: any) {
    ctx.fail(error)
  }
}

// 检查用户是否有某资源的操作权限
const verifyPermission = (resourceName: TResources, filed?: string) => {
  return async (ctx: DefaultContext, next: () => Promise<any>) => {
    try {
      const paramsKeys = Object.keys(ctx.params)
      const resourceFiledId = ctx.params[paramsKeys[0]]
      const userId = ctx.user!.id!

      let hasPermision: boolean
      if (filed) {
        // 联合主键，表中没有id字段时
        hasPermision = await authService.hasPermissionRef(
          resourceName,
          resourceFiledId,
          userId,
          filed,
        )
      } else {
        // 非联合主键，表中有id字段时
        hasPermision = await authService.hasPermission(resourceName, resourceFiledId, userId)
      }

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

// 手机号格式验证
const verifyPhone: Middleware = async (ctx, next) => {
  const { phone } = ctx.request.body as { phone: string }
  const phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/g

  if (!phone) {
    ctx.fail(new Error(MISSING_PERAMATERS))
    return
  }

  if (!phoneReg.test(phone)) {
    ctx.fail(new Error('手机号格式错误'))
    return
  }

  await next()
}

// 发送验证码
const sendOtp: Middleware = async (ctx, next) => {
  try {
    const { phone } = ctx.request.body as { phone: string }
    const sendRes = await AliyunSMSClient.main(phone)
    if (sendRes.status === 1) {
      ctx.otp = sendRes.msg
      await next()
    } else {
      ctx.fail(new Error(sendRes.msg as string))
    }
  } catch (error: any) {
    ctx.fail(error)
  }
}

// 校验验证码
const verifyOtp: Middleware = async (ctx, next) => {
  const { phone, otp } = ctx.request.body as any
  const redisClient = await getRedisClient()
  const correctOtp = await redisClient.hGet(OTPS_HASH, phone)
  redisClient.quit()

  if (otp === correctOtp) {
    await next()
  } else {
    ctx.fail(new Error('验证码错误'))
  }
}

export { sendOtp, verifyAccount, verifyAuth, verifyOtp, verifyPermission, verifyPhone }
