import { DefaultContext } from 'koa'
import getRedisClient, { OTPS_HASH, REGISTERING_SET } from '../app/redis'
import authService from '../services/auth.service'
import usersService from '../services/users.service'
import { remTokenFromWhiteList, signToken } from '../utils/authorization'
import getUserSystemInfo from '../utils/get-user-system-info'
import redisExpire from '../utils/redis-expire'

class AuthController {
  async validated(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }

  async loginByAccount(ctx: DefaultContext) {
    const userInfo = ctx.user!
    const token = await signToken({ id: userInfo.id! })
    ctx.success({ ...userInfo, token })
  }

  async loginByPhone(ctx: DefaultContext) {
    try {
      const { phone } = ctx.request.body
      const hasUser = await authService.hasUserByPhone(phone)

      if (hasUser) {
        // 根据phone获取用户信息
        const queryRes = await usersService.getUserByPhone(phone)
        let userInfo: Record<string, any> = {}
        if (Array.isArray(queryRes) && queryRes.length !== 0) {
          userInfo = queryRes[0]
        }

        // 更新用户的system信息
        const { browserInfo, osInfo, ipAddress } = getUserSystemInfo(ctx)
        usersService.updateUserSystemInfo(userInfo.id, browserInfo, osInfo, ipAddress)
        const token = await signToken({ id: userInfo.id })

        // 更新用户登录信息
        const nowDate = new Date()
        await usersService.updateUserLoginTime(nowDate, userInfo.id)

        ctx.success({
          status: 1,
          msg: '登录成功',
          user: { id: userInfo.id, name: userInfo.name, token: token },
        })
      } else {
        // 将信息存储在redis中，等待用户注册，30分钟后过期
        const redisClient = await getRedisClient()
        await redisClient.sAdd(REGISTERING_SET, phone)
        redisExpire('set', REGISTERING_SET, phone, 30 * 60 * 60 * 1000)
        redisClient.quit()

        ctx.success({ status: 0, msg: '用户未注册' })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async sendedOtp(ctx: DefaultContext) {
    try {
      const otpCode = ctx.otp
      const { phone } = ctx.request.body

      // 存储已发送的验证码，5分钟后删除
      const redisClient = await getRedisClient()
      await redisClient.hSet(OTPS_HASH, phone, otpCode)
      redisExpire('hash', OTPS_HASH, phone, 5 * 60 * 60 * 1000)
      redisClient.quit()
      ctx.success(undefined, { msg: '发送成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async logout(ctx: DefaultContext) {
    const userId = ctx.user?.id
    try {
      userId && (await remTokenFromWhiteList(String(userId)))
      ctx.success(null, { msg: '用户已登出' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new AuthController()
