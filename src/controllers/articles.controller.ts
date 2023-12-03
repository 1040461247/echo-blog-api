import fs from 'fs'
import articlesService from '../services/articles.service'
import fileService from '../services/file.service'
import tagsService from '../services/tags.service'
import { ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams, RowDataPacket } from 'mysql2'
import type { IArticles, IFileIllustration } from '../types'

class ArticlesController {
  async create(ctx: DefaultContext) {
    const { title, content, category_id, cover_url, is_sticky } = ctx.request.body as IArticles
    const { id } = ctx.user!

    try {
      const insertRes = (await articlesService.create(title, content, id!, cover_url, category_id, is_sticky)) as OkPacketParams
      ctx.success({ insertId: insertRes.insertId }, { msg: '文章新增成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async list(ctx: DefaultContext) {
    const { offset, limit } = ctx.query

    try {
      const queryRes = await articlesService.getList(offset, limit) as IArticles[]
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleById(ctx: DefaultContext) {
    const { articleId } = ctx.params

    try {
      const queryRes = (await articlesService.getArticleById(articleId)) as IArticles[]
      ctx.success(queryRes[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async illustration(ctx: DefaultContext) {
    const { filename } = ctx.params

    try {
      const queryRes = (await articlesService.getIllustrationByFilename(filename)) as IFileIllustration
      if (queryRes) {
        ctx.response.set('content-type', queryRes.mimetype)
        ctx.body = fs.createReadStream(`${ILLUSTRATION_PATH}/${filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async articleCover(ctx: DefaultContext) {
    const { articleId } = ctx.params

    try {
      const queryRes = await articlesService.getArticleCoverById(articleId) as IFileIllustration
      if (queryRes) {
        ctx.response.set('content-type', queryRes.mimetype)
        ctx.body = fs.createReadStream(`${ILLUSTRATION_PATH}/${queryRes.filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeCover(ctx: DefaultContext) {
    const { articleId } = ctx.params
    const promiseList = []

    try {
      const queryRes = await articlesService.getArticleCoverById(articleId) as IFileIllustration
      if (!queryRes) return ctx.success(undefined, { msg: '文章封面不存在' })

      const { filename, article_id } = queryRes
      promiseList.push( fs.promises.unlink(`${ILLUSTRATION_PATH}/${filename}`) )
      promiseList.push( fileService.removeCover(articleId) )
      promiseList.push( articlesService.removeArticleCover(articleId) )
      await Promise.all(promiseList)

      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateCategory(ctx: DefaultContext) {
    const { articleId } = ctx.params
    const { categoryId } = ctx.request.body

    try {
      await articlesService.updateCategory(articleId, categoryId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createTags(ctx: DefaultContext) {
    const { articleId } = ctx.params
    const { tagIds } = ctx.request.body
    const promiseList = []

    try {
      await articlesService.clearTags(articleId)

      for (const tagId of tagIds) {
        promiseList.push( articlesService.createTag(articleId, tagId) )
      }
      await Promise.all(promiseList)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesController()
