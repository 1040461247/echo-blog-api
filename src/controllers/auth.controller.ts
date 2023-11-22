import { DefaultContext } from 'koa'
import { signToken } from '../utils/authorization'

class AuthController {
  async login(ctx: DefaultContext) {
    const { id, name, avatar_url } = ctx.user!
    const token = signToken({ id, name, avatar_url })
    ctx.success({ id, name, token })
  }

  async success(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }
}

export default new AuthController()
