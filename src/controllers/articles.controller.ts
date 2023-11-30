import fs from 'fs'
import articlesService from '../services/articles.service'
import { ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { IArticles } from '../types'

class ArticlesController {
  async create(ctx: DefaultContext) {
    const { title, content, album_url } = ctx.request.body as IArticles
    const { id } = ctx.user!

    try {
      const insertRes = (await articlesService.create(title, content, id!, album_url)) as OkPacketParams
      ctx.success({ insertId: insertRes.insertId }, { msg: '文章新增成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    const { offset, limit } = ctx.query

    try {
      const queryRes = await articlesService.getList(offset, limit)
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleById(ctx: DefaultContext) {
    const { articleId } = ctx.params

    try {
      const queryRes = (await articlesService.getArticleById(articleId)) as RowDataPacket[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async illustration(ctx: DefaultContext) {
    const { filename } = ctx.params

    try {
      const queryRes = (await articlesService.getIllustrationByFilename(filename)) as RowDataPacket
      ctx.response.set('content-type', queryRes.mimetype)
      ctx.body = fs.createReadStream(`${ILLUSTRATION_PATH}/${filename}`)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async articleCover(ctx: DefaultContext) {

  }
}

export default new ArticlesController()
