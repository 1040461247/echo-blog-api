import fs from 'fs/promises'
import fileService from '../services/file.service'
import userService from '../services/users.service'
import { AVATAR_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'

class FileController {
  async createAvatar(ctx: DefaultContext) {
    const { filename, mimetype, size } = ctx.req.file
    const { id } = ctx.user!

    try {
      const uesrAvatar = await userService.getAvatarById(id!)
      console.log(uesrAvatar)
      if (uesrAvatar) {
        // 头像已存在，删除源文件并更新
        await fs.unlink(`${AVATAR_PATH}/${uesrAvatar.filename}`)
        await fileService.updateAvatar(filename, mimetype, size, id!)
        ctx.success()
      } else {
        // 新增头像
        const insertRes = (await fileService.createAvatar(filename, mimetype, size, id!)) as OkPacketParams
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FileController()
