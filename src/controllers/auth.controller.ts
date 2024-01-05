import { DefaultContext } from 'koa'
import { signToken } from '../utils/authorization'
import AliyunSMSClient from '../utils/send-sms'

class AuthController {
  async login(ctx: DefaultContext) {
    const userInfo = ctx.user!
    const token = signToken(userInfo)
    ctx.success({ id: userInfo.id, name: userInfo.name, token })
  }

  async success(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }

  async sendOpt(ctx: DefaultContext) {
    try {
      AliyunSMSClient.main()
      ctx.success(undefined, { msg: '发送成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new AuthController()
