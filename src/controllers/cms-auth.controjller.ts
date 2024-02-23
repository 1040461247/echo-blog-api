import { DefaultContext } from 'koa'
import { signTokenCms } from '../utils/cms-authorization'

class CmsAuthController {
  async login(ctx: DefaultContext) {
    const userInfo = ctx.user!
    const token = await signTokenCms({ id: userInfo.id! })
    ctx.success({ ...userInfo, token })
  }

  async success(ctx: DefaultContext) {
    ctx.success(ctx.user)
  }
}

export default new CmsAuthController()
