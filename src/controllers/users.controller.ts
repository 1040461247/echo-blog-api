import fs from 'fs'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IFileAvatar, IUsers } from '../types'

const { create, getUserList, getAvatarById } = userService

class UsersController {
  async create(ctx: DefaultContext) {
    try {
      const insertRes = await create(ctx.request.body) as OkPacketParams
      ctx.success(insertRes, { msg: '注册成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = await getUserList() as IUsers[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getAvatarById(ctx: DefaultContext) {
    const { userId } = ctx.params

    try {
      const queryInfo = await getAvatarById(userId) as IFileAvatar
      if (queryInfo) {
        const { mimetype, filename } = queryInfo
        ctx.response.set('content-type', mimetype)
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new UsersController()
