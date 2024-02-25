import fs from 'fs/promises'
import fileService from '../services/file.service'
import userService from '../services/users.service'
import articlesService from '../services/articles.service'
import { AVATAR_PATH, ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IFileAvatar, IFileIllustration } from '../types'
import usersService from '../services/users.service'

class FileController {
  async createAvatar(ctx: DefaultContext) {
    try {
      const { filename, mimetype, size } = ctx.req.file
      const { id } = ctx.user!

      const uesrAvatar = (await userService.getAvatarByUserId(id!)) as IFileAvatar
      if (uesrAvatar) {
        // 头像已存在，删除源文件并更新
        await fs.unlink(`${AVATAR_PATH}/${uesrAvatar.filename}`)
        await fileService.updateAvatar(filename, mimetype, size, id!)
        await usersService.updateAvatar(id!)
        ctx.success()
      } else {
        // 新增头像
        const insertRes = (await fileService.createAvatar(filename, mimetype, size, id!)) as OkPacketParams
        await usersService.updateAvatar(id!)
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createIllustration(ctx: DefaultContext) {
    try {
      const files = ctx.req.files
      const { articleId } = ctx.query

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
    try {
      const { filename, mimetype, size } = ctx.req.file
      const { articleId } = ctx.params

      const articleCover = (await articlesService.getArticleCoverById(articleId)) as IFileIllustration
      if (articleCover) {
        // 封面已存在，删除源文件并更新
        await fs.unlink(`${ILLUSTRATION_PATH}/${articleCover.filename}`)
        await fileService.updateCover(filename, mimetype, size, articleId)
        ctx.success()
      } else {
        // 新增封面
        const insertRes = (await fileService.createCover(filename, mimetype, size, articleId)) as OkPacketParams
        await articlesService.updateArticleCover(articleId)
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FileController()
