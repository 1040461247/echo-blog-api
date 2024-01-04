import { DefaultContext } from 'koa'
import { signToken } from '../utils/authorization'

class AuthController {
  async login(ctx: DefaultContext) {
    const userInfo = ctx.user!
    const token = signToken(userInfo)
    ctx.success({ id: userInfo.id, name: userInfo.name, token })
  }

  async success(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }
}

export default new AuthController()
