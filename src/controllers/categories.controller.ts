import categoriesService from '../services/categories.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'

class CategoriesController {
  async create(ctx: DefaultContext) {
    const { category } = ctx.request.body

    try {
      const hasCategory = await categoriesService.hasCategory(category)
      if (hasCategory) {
        return ctx.success(undefined, { msg: '分类已存在' })
      } else {
        const insertRes = (await categoriesService.create(category)) as OkPacketParams
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = await categoriesService.getList()
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async remove(ctx: DefaultContext) {
    const { categoryId } = ctx.params

    try {
      await categoriesService.remove(categoryId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new CategoriesController()
