import tagsService from '../services/tags.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { ITags } from '../types'

class TagsController {
  async getTagList(ctx: DefaultContext) {
    try {
      const queryRes = (await tagsService.getTagList()) as ITags[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getTagListQuery(ctx: DefaultContext) {
    try {
      const tagList = await tagsService.getTagListQuery(ctx.query)
      const tagTotal = await tagsService.getTagsTotal(ctx.query)
      ctx.success(tagList, { total: tagTotal })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getTagById(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      const queryRes = (await tagsService.getTagById(tagId)) as ITags[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createTag(ctx: DefaultContext) {
    try {
      const { tag } = ctx.request.body
      const insertRes = (await tagsService.createTag(tag)) as OkPacketParams
      ctx.success({ insertId: insertRes.insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateTagById(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      const { tag } = ctx.request.body
      await tagsService.updateCategoryById(tagId, tag)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeTag(ctx: DefaultContext) {
    try {
      // 当有关联文章时，无法删除
      const { tagId } = ctx.params
      const relatedAtcCount = await tagsService.getRelatedAtcCount(tagId)
      if (relatedAtcCount !== 0) {
        ctx.fail(new Error('请先移除关联文章！'))
      } else {
        await tagsService.removeTagById(tagId)
        ctx.success()
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new TagsController()
