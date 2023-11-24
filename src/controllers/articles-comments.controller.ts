import articlesCommentsService from '../services/articles-comments.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IArticlesComments } from '../types'

class ArticlesCommentsController {
  async create(ctx: DefaultContext) {
    const { content, article_id, user_id } = ctx.request.body as IArticlesComments

    try {
      const insertRes = (await articlesCommentsService.create(content, article_id, user_id)) as OkPacketParams
      ctx.success({ inesrtId: insertRes.insertId }, {})
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async reply(ctx: DefaultContext) {
    const { content, article_id, user_id } = ctx.request.body as IArticlesComments
    const { commentId } = ctx.params

    try {
      const insertRes = (await articlesCommentsService.reply(
        content,
        article_id,
        user_id,
        commentId!
      )) as OkPacketParams
      ctx.success({ inesrtId: insertRes.insertId }, {})
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesCommentsController()
