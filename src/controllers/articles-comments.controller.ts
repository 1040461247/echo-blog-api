import articlesCommentsService from '../services/articles-comments.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { IArticlesComments } from '../types'

class ArticlesCommentsController {
  async getCommentsByAtcId(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.query
      const queryRes = (await articlesCommentsService.getCommentsByAtcId(
        articleId,
      )) as IArticlesComments[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getLikesCountByCmtId(ctx: DefaultContext) {
    try {
      const { commentId } = ctx.params
      const [queryRes] = (await articlesCommentsService.getLikesCountByCmtId(
        commentId,
      )) as RowDataPacket[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getLikesByUserId(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params
      const [{ commentLikes }] = (await articlesCommentsService.getLikesByUserId(
        userId,
      )) as RowDataPacket[]
      ctx.success(commentLikes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createComment(ctx: DefaultContext) {
    try {
      const { content, articleId, userId } = ctx.request.body as IArticlesComments
      const insertRes = (await articlesCommentsService.createComment(
        content,
        articleId,
        userId,
      )) as OkPacketParams
      ctx.success({ inesrtId: insertRes.insertId }, {})
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createLikes(ctx: DefaultContext) {
    try {
      const { commentId } = ctx.request.body
      const { id } = ctx.user!
      await articlesCommentsService.createLikes(id!, commentId)
      ctx.success(null, { msg: '点赞成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createReply(ctx: DefaultContext) {
    try {
      const { content, articleId, userId } = ctx.request.body as IArticlesComments
      const { commentId } = ctx.params
      const insertRes = (await articlesCommentsService.createReply(
        content,
        articleId,
        userId,
        commentId!,
      )) as OkPacketParams
      ctx.success({ inesrtId: insertRes.insertId }, {})
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateComment(ctx: DefaultContext) {
    try {
      const { commentId } = ctx.params
      const { content } = ctx.request.body
      await articlesCommentsService.updateComment(content, commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeComment(ctx: DefaultContext) {
    try {
      const { commentId } = ctx.params
      await articlesCommentsService.removeComment(commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeLikes(ctx: DefaultContext) {
    try {
      const { commentId } = ctx.params
      const { id } = ctx.user!

      await articlesCommentsService.removeLikes(id!, commentId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesCommentsController()
