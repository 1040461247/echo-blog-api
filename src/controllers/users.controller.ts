import fs from 'fs'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { RowDataPacket } from 'mysql2'
import type { IFileAvatar, IUsers } from '../types'
import getUserSystemInfo from '../utils/get-user-system-info'
import { signToken } from '../utils/authorization'

class UsersController {
  async getUserList(ctx: DefaultContext) {
    try {
      const queryRes = (await userService.getUserList()) as IUsers[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getAvatarByUserId(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params
      const queryInfo = (await userService.getAvatarByUserId(userId)) as IFileAvatar

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
    try {
      const { userId } = ctx.params
      const [userInfo] = (await userService.getUserById(userId)) as RowDataPacket[]
      delete userInfo.password
      ctx.success(userInfo)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createUser(ctx: DefaultContext) {
    try {
      const userSystemInfo = getUserSystemInfo(ctx)
      await userService.createUser(ctx.request.body, userSystemInfo)
      const [{ id, name }] = (await userService.getUserByName(ctx.request.body.name)) as IUsers[]

      // 注册成功后，登录用户
      const token = await signToken({ id: id! })
      ctx.success({ id, name, token })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateUser(ctx: DefaultContext) {
    try {
      const { name, password } = ctx.request.body
      const userId = ctx.user?.id
      await userService.updateUserById(userId!, name, password)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new UsersController()
