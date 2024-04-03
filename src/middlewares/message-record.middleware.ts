import { Middleware } from 'koa'
import articlesCommentsService from '../services/articles-comments.service'
import { RowDataPacket } from 'mysql2'
import messageRecordService from '../services/message-record.service'
import articlesService from '../services/articles.service'

// 记录消息-评论点赞
const recordMessageOfLikeComment: Middleware = async (ctx, next) => {
  const { commentId } = ctx.request.body as any
  const { id } = ctx.user!

  const [comment] = (await articlesCommentsService.getCommentById(commentId)) as RowDataPacket[]
  const { user, content, articleId } = comment
  const msgContent = `“${content}”`

  if (id === user.id) return await next()

  await messageRecordService.createMessage('0', id!, user.id, msgContent, articleId)
  await next()
}

// 记录消息-评论回复
const recordMessageOfReply: Middleware = async (ctx, next) => {
  const { commentId } = ctx.params
  const { id } = ctx.user!
  const { content, articleId } = ctx.request.body as any

  const [comment] = (await articlesCommentsService.getCommentById(commentId)) as RowDataPacket[]
  const { user } = comment

  if (id === user.id) return await next()

  await messageRecordService.createMessage('1', id!, user.id, content, articleId)
  await next()
}

// 记录消息-文章评论
const recordMessageOfComment: Middleware = async (ctx, next) => {
  const { id } = ctx.user!
  const { content, articleId } = ctx.request.body as any

  const [{ author }] = (await articlesService.getArticleById(articleId)) as RowDataPacket[]

  if (id === author.id) return await next()

  await messageRecordService.createMessage('4', id!, author.id, content, articleId)
  await next()
}

export { recordMessageOfLikeComment, recordMessageOfReply, recordMessageOfComment }
