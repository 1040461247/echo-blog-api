import userService from '../services/users.service'
import type { DefaultContext } from 'koa'

const { create } = userService

class UsersController {
  async create(ctx: DefaultContext) {
    const insertRes = await create(ctx.request.body)
    ctx.success(insertRes, { msg: '注册成功' })
  }
}

export default new UsersController()
