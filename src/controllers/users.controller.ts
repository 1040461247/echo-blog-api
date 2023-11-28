import fs from 'fs'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'

const { create, getUserList, getAvatarById } = userService

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

  async getAvatarById(ctx: DefaultContext) {
    const { userId } = ctx.params

    try {
      const queryInfo = await getAvatarById(userId)
      if (queryInfo) {
        const { mimetype, filename } = queryInfo
        ctx.response.set('content-type', mimetype)
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${filename}`)
      } else {
        ctx.success(undefined, { msg: '用户头像不存在' })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new UsersController()
