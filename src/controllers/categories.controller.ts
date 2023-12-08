import categoriesService from '../services/categories.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { ICategories } from '../types'

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
      const queryRes = (await categoriesService.getList()) as ICategories[]
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

  async getCategoryById(ctx: DefaultContext) {
    const { categoryId } = ctx.params

    try {
      const queryRes = (await categoriesService.getCategoryById(categoryId)) as ICategories[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticlesByCateId(ctx: DefaultContext) {
    const { categoryId } = ctx.params
    try {
      const queryRes = await categoriesService.getArticlesByCateId(categoryId)
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new CategoriesController()
