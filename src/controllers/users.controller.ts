import fs from 'fs'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { IFileAvatar, IUsers } from '../types'
import getUserSystemInfo from '../utils/get-user-system-info'
import { signToken } from '../utils/authorization'

const { create, getUserList, getAvatarById, getUserByName } = userService

class UsersController {
  async create(ctx: DefaultContext) {
    try {
      const userSystemInfo = getUserSystemInfo(ctx)
      const insertRes = (await create(ctx.request.body, userSystemInfo)) as OkPacketParams
      const [{ id, name }] = (await getUserByName(ctx.request.body.name)) as IUsers[]

      // 注册成功后，登录用户
      const token = signToken({ id, name })
      ctx.success({ id, name, token })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = (await getUserList()) as IUsers[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getAvatarById(ctx: DefaultContext) {
    const { userId } = ctx.params

    try {
      const queryInfo = (await getAvatarById(userId)) as IFileAvatar
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
