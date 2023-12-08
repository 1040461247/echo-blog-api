import tagsService from '../services/tags.service'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { ITags } from '../types'

class TagsController {
  async create(ctx: DefaultContext) {
    const { tag } = ctx.request.body

    try {
      const hasTag = await tagsService.hasTag(tag)
      if (hasTag) {
        return ctx.success(undefined, { msg: '标签已存在' })
      } else {
        const insertRes = (await tagsService.create(tag)) as OkPacketParams
        ctx.success({ insertId: insertRes.insertId })
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    try {
      const queryRes = (await tagsService.getList()) as ITags[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async remove(ctx: DefaultContext) {
    const { tagId } = ctx.params

    try {
      await tagsService.remove(tagId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getTagById(ctx: DefaultContext) {
    const { tagId } = ctx.params

    try {
      const queryRes = (await tagsService.getTagById(tagId)) as ITags[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticlesByTagId(ctx: DefaultContext) {
    const { tagId } = ctx.params

    try {
      const queryRes = (await tagsService.getArticlesByTagId(tagId)) as RowDataPacket[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new TagsController()
