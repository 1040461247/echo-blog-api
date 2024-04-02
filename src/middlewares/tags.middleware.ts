import { Middleware } from 'koa'
import tagsService from '../services/tags.service'

export const checkForTagExists: Middleware = async (ctx, next) => {
  const { tag } = ctx.request.body as any
  const hasTag = await tagsService.hasTag(tag)

  if (hasTag) {
    ctx.fail(new Error('标签已存在'))
  } else {
    await next()
  }
}
