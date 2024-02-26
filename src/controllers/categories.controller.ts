import categoriesService from '../services/categories.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { ICategories } from '../types'

class CategoriesController {
  async getCategoryList(ctx: DefaultContext) {
    try {
      const queryRes = (await categoriesService.getCategoryList()) as ICategories[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getCategoryById(ctx: DefaultContext) {
    try {
      const { categoryId } = ctx.params
      const queryRes = (await categoriesService.getCategoryById(categoryId)) as ICategories[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createCategory(ctx: DefaultContext) {
    try {
      const { category } = ctx.request.body
      const hasCategory = await categoriesService.hasCategory(category)
      if (hasCategory) {
        return ctx.success(undefined, { msg: '分类已存在' })
      } else {
        const insertRes = (await categoriesService.createCategory(category)) as OkPacketParams
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeCategory(ctx: DefaultContext) {
    try {
      const { categoryId } = ctx.params
      await categoriesService.removeCategory(categoryId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new CategoriesController()
