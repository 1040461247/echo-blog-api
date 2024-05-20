import fs from 'fs/promises'
import fileService from '../services/file.service'
import userService from '../services/users.service'
import articlesService from '../services/articles.service'
import { AVATAR_PATH, ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IFileAvatar, IFileIllustration } from '../types'
import usersService from '../services/users.service'
import { MISSING_PERAMATERS } from '../config/error-types.config'

interface IResData {
  errFiles?: string[]
  succMap: Record<string, string>
}

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
        const insertRes = (await fileService.createAvatar(
          filename,
          mimetype,
          size,
          id!,
        )) as OkPacketParams
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
      const { articleId, mark } = ctx.query

      if (articleId) {
        await fileService.createIllustration(files, articleId)
      } else if (mark) {
        await fileService.createIllustrationToTemp(files, mark)
      } else {
        ctx.fail(new Error(MISSING_PERAMATERS))
      }

      const fileMap: Record<string, string> = {}
      for (const file of files) {
        const { filename, originalname } = file
        fileMap[originalname] = `${process.env.APP_BASE_URL}/articles/illustration/${filename}`
      }
      ctx.success({ succMap: fileMap } as IResData)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createIllustrationOffsite(ctx: DefaultContext) {
    try {
      const { originalURL, filename } = ctx.file
      const { articleId, mark } = ctx.query

      if (articleId) {
        await fileService.createIllustration([ctx.file], articleId)
      } else if (mark) {
        await fileService.createIllustrationToTemp([ctx.file], mark)
      } else {
        ctx.fail(new Error(MISSING_PERAMATERS))
      }

      ctx.success({
        originalURL,
        url: `${process.env.APP_BASE_URL}/articles/illustration/${filename}`,
      })
    } catch (error: any) {
      console.log(error)
      ctx.fail(error)
    }
  }

  async createCover(ctx: DefaultContext) {
    try {
      const { filename, mimetype, size } = ctx.req.file
      const { articleId } = ctx.params

      const articleCover = (await articlesService.getArticleCoverById(
        articleId,
      )) as IFileIllustration
      if (articleCover) {
        // 封面已存在，删除源文件并更新
        await fs.unlink(`${ILLUSTRATION_PATH}/${articleCover.filename}`).catch((err) => {
          console.log('原文章封面不存在', err)
        })
        await fileService.updateCover(filename, mimetype, size, articleId)
        ctx.success(null, { msg: '文章封面已更新' })
      } else {
        // 新增封面
        const insertRes = (await fileService.createCover(
          filename,
          mimetype,
          size,
          articleId,
        )) as OkPacketParams
        await articlesService.updateArticleCover(articleId)
        ctx.success({ insertId: insertRes.insertId }, { msg: '文章封面上传成功' })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeArticleCover(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const queryRes = (await articlesService.getArticleCoverById(articleId)) as IFileIllustration
      if (!queryRes) {
        return ctx.success(null, { msg: '文章封面不存在' })
      }

      const { filename } = queryRes
      const promiseList = []
      promiseList.push(fs.unlink(`${ILLUSTRATION_PATH}/${filename}`))
      promiseList.push(fileService.removeCover(articleId))
      promiseList.push(articlesService.removeArticleCover(articleId))
      await Promise.all(promiseList)

      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FileController()
