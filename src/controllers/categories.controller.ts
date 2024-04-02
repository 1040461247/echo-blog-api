import categoriesService from '../services/categories.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { ICategories } from '../types'

class CategoriesController {
  async getCategoryList(ctx: DefaultContext) {
    try {
      const { isAllAtcCount } = ctx.query
      const queryAllCount = isAllAtcCount === ('true' || 'TRUE')
      const queryRes = (await categoriesService.getCategoryList(queryAllCount)) as ICategories[]
      ctx.success(queryRes, { total: queryRes.length })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getCategoryListQuery(ctx: DefaultContext) {
    try {
      const cateList = await categoriesService.getCategoryListQuery(ctx.query)
      const cateTotal = await categoriesService.getCategoriesTotal(ctx.query)
      ctx.success(cateList, { total: cateTotal })
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
      const insertRes = (await categoriesService.createCategory(category)) as OkPacketParams
      ctx.success({ insertId: insertRes.insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateCategoryById(ctx: DefaultContext) {
    try {
      const { categoryId } = ctx.params
      const { category } = ctx.request.body
      await categoriesService.updateCategoryById(categoryId, category)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeCategoryById(ctx: DefaultContext) {
    try {
      // 当有关联文章时，无法删除
      const { categoryId } = ctx.params
      const relatedAtcCount = await categoriesService.getRelatedAtcCount(categoryId)
      if (relatedAtcCount !== 0) {
        ctx.fail(new Error('请先移除关联文章！'))
      } else {
        await categoriesService.removeCategory(categoryId)
        ctx.success()
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new CategoriesController()
