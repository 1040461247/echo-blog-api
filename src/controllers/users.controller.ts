import userService from '../services/users.service'
import type { DefaultContext } from 'koa'

const { create, getUserList } = userService

class UsersController {
  async create(ctx: DefaultContext) {
    try {
      const insertRes = await create(ctx.request.body)
      ctx.success(insertRes, { msg: '注册成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = await getUserList()
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new UsersController()
