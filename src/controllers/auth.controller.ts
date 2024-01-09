import { DefaultContext } from 'koa'
import redis from '../app/redis'
import { signToken } from '../utils/authorization'

const OTPS_HASH = 'otps'

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
      const redisClient = await redis.connect()
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
}

export default new AuthController()
