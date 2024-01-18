import articlesCommentsService from '../services/articles-comments.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
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

  async update(ctx: DefaultContext) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body

    try {
      await articlesCommentsService.update(content, commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async remove(ctx: DefaultContext) {
    const { commentId } = ctx.params

    try {
      await articlesCommentsService.remove(commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getCommentsById(ctx: DefaultContext) {
    const { article_id } = ctx.query

    try {
      const queryRes = (await articlesCommentsService.getCommentsById(article_id)) as IArticlesComments[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async addLikes(ctx: DefaultContext) {
    const { comment_id } = ctx.request.body
    const { id } = ctx.user!

    try {
      await articlesCommentsService.addLikes(id!, comment_id)
      ctx.success(null, { msg: '点赞成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async remLikes(ctx: DefaultContext) {
    const { commentId } = ctx.params
    const { id } = ctx.user!

    try {
      await articlesCommentsService.remLikes(id!, commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getLikesCountById(ctx: DefaultContext) {
    const { commentId } = ctx.params

    try {
      const [queryRes] = (await articlesCommentsService.getLikesCountById(commentId)) as RowDataPacket[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesCommentsController()
