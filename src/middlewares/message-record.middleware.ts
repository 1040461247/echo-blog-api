import { Middleware } from 'koa'
import articlesCommentsService from '../services/articles-comments.service'
import { RowDataPacket } from 'mysql2'
import messageRecordService from '../services/message-record.service'
import articlesService from '../services/articles.service'

const recordMessageOfLikeComment: Middleware = async (ctx, next) => {
  const { comment_id } = ctx.request.body as any
  const { id } = ctx.user!

  const [comment] = (await articlesCommentsService.getCommentById(comment_id)) as RowDataPacket[]
  const { user, content, article_id } = comment
  const msgContent = `“${content}”`

  if (id === user.id) return await next()

  await messageRecordService.createMessage('0', id!, user.id, msgContent, article_id)
  await next()
}

const recordMessageOfReply: Middleware = async (ctx, next) => {
  const { commentId } = ctx.params
  const { id } = ctx.user!
  const { content, article_id } = ctx.request.body as any

  const [comment] = (await articlesCommentsService.getCommentById(commentId)) as RowDataPacket[]
  const { user } = comment

  if (id === user.id) return await next()

  await messageRecordService.createMessage('1', id!, user.id, content, article_id)
  await next()
}

const recordMessageOfComment: Middleware = async (ctx, next) => {
  const { id } = ctx.user!
  const { content, article_id } = ctx.request.body as any

  const [{ author }] = (await articlesService.getArticleById(article_id)) as RowDataPacket[]

  if (id === author.id) return await next()

  await messageRecordService.createMessage('4', id!, author.id, content, article_id)
  await next()
}

export { recordMessageOfLikeComment, recordMessageOfReply, recordMessageOfComment }
