import { DefaultContext } from 'koa'
import getRedisClient, { OTPS_HASH } from '../app/redis'
import authService from '../services/auth.service'
import usersService from '../services/users.service'
import { signToken } from '../utils/authorization'
import getUserSystemInfo from '../utils/get-user-system-info'

class AuthController {
  async login(ctx: DefaultContext) {
    const userInfo = ctx.user!
    const token = signToken(userInfo)
    ctx.success({ id: userInfo.id, name: userInfo.name, token })
  }

  async success(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }

  async sended(ctx: DefaultContext) {
    try {
      const otpCode = ctx.otp
      const { phone } = ctx.request.body

      // 存儲驗證碼，并在5分鐘后刪除驗證碼
      const redisClient = await getRedisClient()
      await redisClient.hSet(OTPS_HASH, phone, otpCode)
      setTimeout(async () => {
        await redisClient.hDel(OTPS_HASH, phone)
        redisClient.disconnect()
      }, 5 * 60 * 60 * 1000)

      ctx.success(undefined, { msg: '发送成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async loginPhone(ctx: DefaultContext) {
    try {
      const { phone } = ctx.request.body
      const hasUser = await authService.hasUserByPhone(phone)

      if (hasUser) {
        // 根据phone获取用户id、name
        const queryRes = await usersService.getUserByPhone(phone)
        let userInfo: Record<string, any> = {}
        if (Array.isArray(queryRes) && queryRes.length !== 0) {
          userInfo = queryRes[0]
        }

        // 更新用户的system信息
        const { browserInfo, osInfo, ipAddress } = getUserSystemInfo(ctx)
        usersService.updateUserSystemInfo(userInfo.id, browserInfo, osInfo, ipAddress)
        const token = signToken({ id: userInfo.id, name: userInfo.name })
        ctx.success({ status: 1, msg: '登陆成功', user: { id: userInfo.id, name: userInfo.name, token: token } })
      } else {
        // 将信息存储在redis中，等待用户注册
        ctx.success({ status: 0, msg: '用户未注册' })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new AuthController()
