import fs from 'fs'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { IFileAvatar, IUsers } from '../types'
import getUserSystemInfo from '../utils/get-user-system-info'
import { remTokenFromWhiteList, signToken } from '../utils/authorization'

// Types
interface IUpdateBody {
  name?: string
  password?: string
}

class UsersController {
  async create(ctx: DefaultContext) {
    try {
      const userSystemInfo = getUserSystemInfo(ctx)
      const insertRes = (await userService.create(ctx.request.body, userSystemInfo)) as OkPacketParams
      const [{ id, name }] = (await userService.getUserByName(ctx.request.body.name)) as IUsers[]

      // 注册成功后，登录用户
      const token = signToken({ id: id! })
      ctx.success({ id, name, token })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = (await userService.getUserList()) as IUsers[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getAvatarById(ctx: DefaultContext) {
    const { userId } = ctx.params

    try {
      const queryInfo = (await userService.getAvatarById(userId)) as IFileAvatar
      if (queryInfo) {
        const { mimetype, filename } = queryInfo
        ctx.response.set('content-type', mimetype)
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getUserById(ctx: DefaultContext) {
    const { userId } = ctx.params

    try {
      const [userInfo] = (await userService.getUserById(userId)) as RowDataPacket[]
      delete userInfo.password
      ctx.success(userInfo)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async update(ctx: DefaultContext) {
    const { name, password } = ctx.request.body as IUpdateBody
    const userId = ctx.user?.id
    try {
      await userService.updateUserById(userId!, name, password)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new UsersController()
