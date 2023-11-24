import articlesService from '../services/articles.service'
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
}

export default new ArticlesController()
