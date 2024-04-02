import { Middleware } from 'koa'
import categoriesService from '../services/categories.service'

export const checkForCategoryExists: Middleware = async (ctx, next) => {
  const { category } = ctx.request.body as any
  const hasCategory = await categoriesService.hasCategory(category)

  if (hasCategory) {
    ctx.fail(new Error('分类已存在'))
  } else {
    await next()
  }
}
