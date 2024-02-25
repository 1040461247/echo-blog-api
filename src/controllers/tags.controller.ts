import tagsService from '../services/tags.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
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

  async getTagById(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      const queryRes = (await tagsService.getTagById(tagId)) as ITags[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticlesByTagId(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      const queryRes = (await tagsService.getArticlesByTagId(tagId)) as RowDataPacket[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createTag(ctx: DefaultContext) {
    try {
      const { tag } = ctx.request.body
      const hasTag = await tagsService.hasTag(tag)

      if (hasTag) {
        ctx.success(undefined, { msg: '标签已存在' })
      } else {
        const insertRes = (await tagsService.createTag(tag)) as OkPacketParams
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeTag(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      await tagsService.removeTagById(tagId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new TagsController()
