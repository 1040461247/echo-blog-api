import categoriesService from '../services/categories.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'

class TagsController {
  async create(ctx: DefaultContext) {
    const { tag } = ctx.request.body

    try {
      const hasTag = await categoriesService.hasTag(tag)
      if (hasTag) {
        return ctx.success(undefined, { msg: '分类已存在' })
      } else {
        const insertRes = (await categoriesService.create(tag)) as OkPacketParams
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
    const { tag } = ctx.request.body

    try {
      await categoriesService.remove(tag)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new TagsController()
