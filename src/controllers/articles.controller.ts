import fs from 'fs'
import articlesService, {
  EArticleIsSticky,
  ICreateArticleParams,
} from '../services/articles.service'
import { ILLUSTRATION_PATH } from '../config/filepath.config'
import type { DefaultContext } from 'koa'
import type { OkPacketParams } from 'mysql2'
import type { IFileIllustration } from '../types'
import objectFilter from '../utils/object-filter'
import fileService from '../services/file.service'

// Types
enum ECommitArticleType {
  SAVE = 'save',
  PUBLISH = 'publish',
}

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

  async getArticleListQuery(ctx: DefaultContext) {
    try {
      const queryRes = (await articlesService.getArticleListQuery(ctx.query)) as any[]
      const articleList = mapTagsToJson(queryRes)
      const articlesTotal = await articlesService.getArticlesTotal(ctx.query)
      ctx.success(articleList, { total: articlesTotal })
    } catch (error: any) {
      console.log(error)
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

  async commitArticle(ctx: DefaultContext) {
    try {
      const { id: articleId, tags, mark, type } = ctx.request.body
      const { id: userId } = ctx.user!
      const createArticleOpt = objectFilter({ ...ctx.request.body, userId }, [
        'id',
        'tags',
        'mark',
        'type',
      ])

      // 根据文章提交类型，设置文章状态
      let successMsg = '保存成功'
      if (type === ECommitArticleType.SAVE) {
        createArticleOpt.state = '0'
        createArticleOpt.visibility = '0'
      } else if (type === ECommitArticleType.PUBLISH) {
        createArticleOpt.state = '1'
        createArticleOpt.visibility = '1'
        successMsg = '发布成功'
      }

      // 校验isSticky类型，为boolean值时转为枚举类型
      if (typeof createArticleOpt.isSticky === 'boolean') {
        createArticleOpt.isSticky = createArticleOpt.isSticky
          ? EArticleIsSticky.TRUE
          : EArticleIsSticky.FALSE
      }

      // 文章已创建时更新文章内容，否则新增文章并返回id
      let insertId: number | undefined
      if (articleId) {
        await articlesService.updateArticleById(articleId, createArticleOpt)
      } else {
        insertId = (
          (await articlesService.createArticle(
            createArticleOpt as ICreateArticleParams,
          )) as OkPacketParams
        ).insertId
        // 根据文章id，将临时表的文章配图转移到主表中
        insertId && (await fileService.saveIllustrationFromTemp(mark, insertId))
      }
      // 更新tags
      tags && (await articlesService.createTagsToAtc(articleId ?? insertId, tags))

      ctx.success(insertId ? { insertId } : null, { msg: successMsg })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateArticleById(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      const modifiedData = ctx.request.body
      if (Object.keys(modifiedData).length === 0) {
        return ctx.fail(new Error('请指定需要更新的参数'))
      }

      await articlesService.updateArticleById(articleId, modifiedData)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeArticleById(ctx: DefaultContext) {
    try {
      const { articleId } = ctx.params
      await articlesService.removeArticleById(articleId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new ArticlesController()
