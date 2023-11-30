import fs from 'fs/promises'
import fileService from '../services/file.service'
import userService from '../services/users.service'
import articlesService from '../services/articles.service'
import { AVATAR_PATH, ILLUSTRATION_PATH } from '../config/filepath.config'
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

  async createIllustration(ctx: DefaultContext) {
    const files = ctx.req.files
    const { articleId } = ctx.query

    try {
      for (const file of files) {
        const { filename, mimetype, size } = file
        await fileService.createIllustration(filename, mimetype, size, articleId)
      }
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createCover(ctx: DefaultContext) {
    const { filename, mimetype, size } = ctx.req.file
    const { articleId } = ctx.params

    try {
      const articleCover = await articlesService.getArticleCoverById(articleId)
      if (articleCover) {
        // 头像已存在，删除源文件并更新
        await fs.unlink(`${ILLUSTRATION_PATH}/${articleCover.filename}`)
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
