import fs from 'fs'
import articlesService from '../services/articles.service'
import fileService from '../services/file.service'
import { ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IArticles, IFileIllustration } from '../types'

function mapTagsToJson(queryRes: any) {
  return queryRes.map((item: any) => {
    const articleList = { ...item }
    articleList.tags = JSON.parse(item.tags)
    return articleList
  })
}

class ArticlesController {
  async getArticleList(ctx: DefaultContext) {
    try {
      const { offset, limit } = ctx.query
      const queryRes = (await articlesService.getArticleList(offset, limit)) as any[]
      const articleList = mapTagsToJson(queryRes)
      ctx.success(articleList)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleListAllStatus(ctx: DefaultContext) {
    try {
      const { offset, limit } = ctx.query
      const queryRes = (await articlesService.getArticleListAllStatus(offset, limit)) as any[]
      const articleList = mapTagsToJson(queryRes)
      const articlesTotal = await articlesService.getArticlesTotal()
      ctx.success(articleList, { total: articlesTotal })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleListByCateId(ctx: DefaultContext) {
    try {
      const { categoryId } = ctx.params
      const queryRes = await articlesService.getArticleListByCateId(categoryId)
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleListByTagId(ctx: DefaultContext) {
    try {
      const { tagId } = ctx.params
      const queryRes = await articlesService.getArticleListByTagId(tagId)
      ctx.success(queryRes)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleById(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const queryRes = (await articlesService.getArticleById(articleId)) as any[]
      const articleList = mapTagsToJson(queryRes)
      ctx.success(articleList[0])
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getIllustration(ctx: DefaultContext) {
    try {
      const { filename } = ctx.params
      const queryRes = (await articlesService.getIllustrationByFilename(
        filename,
      )) as IFileIllustration

      if (queryRes) {
        ctx.response.set('content-type', queryRes.mimetype)
        ctx.body = fs.createReadStream(`${ILLUSTRATION_PATH}/${filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getArticleCover(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const queryRes = (await articlesService.getArticleCoverById(articleId)) as IFileIllustration

      if (queryRes) {
        ctx.response.set('content-type', queryRes.mimetype)
        ctx.body = fs.createReadStream(`${ILLUSTRATION_PATH}/${queryRes.filename}`)
      }
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createArticle(ctx: DefaultContext) {
    try {
      const { title, content, categoryId, coverUrl, isSticky, description } = ctx.request
        .body as IArticles
      const { id } = ctx.user!

      const insertRes = (await articlesService.createArticle(
        title,
        content,
        id!,
        categoryId,
        coverUrl,
        isSticky,
        description,
      )) as OkPacketParams
      ctx.success({ insertId: insertRes.insertId }, { msg: '文章新增成功' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createTagsToAtc(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const { tagIds } = ctx.request.body
      const promiseList = []

      await articlesService.clearTags(articleId)
      for (const tagId of tagIds) {
        promiseList.push(articlesService.createTagToAtc(articleId, tagId))
      }
      await Promise.all(promiseList)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateAtcCategory(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const { categoryId } = ctx.request.body
      await articlesService.updateAtcCategory(articleId, categoryId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeArticleCover(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const queryRes = (await articlesService.getArticleCoverById(articleId)) as IFileIllustration
      if (!queryRes) {
        return ctx.success(null, { msg: '文章封面不存在' })
      }

      const { filename } = queryRes
      const promiseList = []
      promiseList.push(fs.promises.unlink(`${ILLUSTRATION_PATH}/${filename}`))
      promiseList.push(fileService.removeCover(articleId))
      promiseList.push(articlesService.removeArticleCover(articleId))
      await Promise.all(promiseList)

      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesController()
