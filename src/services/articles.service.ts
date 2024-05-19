import connection from '../app/database'
import { APP_HOST, APP_PORT, APP_PROTOCOL } from '../config/env.config'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import sortArticles from '../utils/sort-articles'
import { IArticles } from '../types'
import {
  IDateRange,
  optToInsertQuery,
  optToSortQuery,
  optToUpdateQuery,
  optToWhereQuery,
} from '../utils/gen-query'
import { pageToOffset } from '../utils/page-to-offset'

// Types
export enum EArticleState {
  UNPUBLISHED = '0',
  PUBLISHED = '1',
}

export enum EArticleIsSticky {
  FALSE = '0',
  TRUE = '1',
}

export enum EArticleVisibility {
  NOT_VISIBLE = '0',
  VISIBLE = '1',
}

export interface IArticleListQueryOption {
  current: string
  pageSize: string
  title?: string
  category?: string
  'tags[]'?: string[]
  state?: EArticleState
  visibility?: EArticleVisibility
  isSticky?: EArticleIsSticky
  createTime?: IDateRange
  updateTime?: IDateRange
  sort?: string
}

export interface IArticleUpdateOption {
  title?: string
  content?: string
  description?: string
  categoryId?: number
  isSticky?: EArticleIsSticky
  state?: EArticleState
  visibility?: EArticleVisibility
}

export interface ICreateArticleParams {
  title: string
  content: string
  description?: string
  categoryId: number
  isSticky?: EArticleIsSticky
  state?: EArticleState
  visibility?: EArticleVisibility
  userId: number
}

class ArticlesService {
  async getArticleList(offset = '0', limit = '10') {
    try {
      const statement = `
      SELECT
        atc.id,
        atc.title,
        atc.description,
        atc.cover_url coverUrl,
        atc.create_time createTime,
        atc.update_time updateTime,
        atc.is_sticky isSticky,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
        JSON_OBJECT('id', c.id, 'name', c.name) AS category,
        NULLIF(
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', tags.id, 'name', tags.name)
                ),
                '[{"id": null, "name": null}]'
            ),
            '[{"id": null, "name": null}]'
        ) AS tags
      FROM articles atc
      LEFT JOIN users u ON u.id = atc.user_id
      LEFT JOIN categories c ON c.id = atc.category_id
      LEFT JOIN articles_ref_tags art ON art.article_id = atc.id
      LEFT JOIN tags ON tags.id = art.tag_id
      WHERE state = '1' AND visibility = '1'
      GROUP BY atc.id
      ORDER BY atc.is_sticky DESC, atc.create_time DESC
      LIMIT ?, ?;
    `
      const [res] = (await connection.execute(statement, [offset, limit])) as RowDataPacket[][]
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleListQuery(queryOption: IArticleListQueryOption) {
    try {
      // 动态生成查询语句
      const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'atc')
      const sortQuery = optToSortQuery(queryOption.sort, 'atc')

      const statement = `
      SELECT
        atc.id,
        atc.title,
        atc.description,
        atc.cover_url coverUrl,
        atc.create_time createTime,
        atc.update_time updateTime,
        atc.is_sticky isSticky,
        atc.state,
        atc.visibility,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
        JSON_OBJECT('id', c.id, 'name', c.name) AS category,
        NULLIF(
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', tags.id, 'name', tags.name)
                ),
                '[{"id": null, "name": null}]'
            ),
            '[{"id": null, "name": null}]'
        ) AS tags
      FROM articles atc
      LEFT JOIN users u ON u.id = atc.user_id
      LEFT JOIN categories c ON c.id = atc.category_id
      LEFT JOIN articles_ref_tags art ON art.article_id = atc.id
      LEFT JOIN tags ON tags.id = art.tag_id
      ${whereQuery}
      GROUP BY atc.id
      ${sortQuery}
      LIMIT ?, ?;
    `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleListByCateId(categoryId: number) {
    try {
      const statement = `
        SELECT
          atc.id,
          atc.title,
          atc.description,
          atc.cover_url coverUrl,
          atc.create_time createTime,
          atc.update_time updateTime,
          atc.is_sticky isSticky,
          atc.state,
          atc.visibility,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
          JSON_OBJECT('id', c.id, 'name', c.name) AS category,
          NULLIF(
            COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT('id', tags.id, 'name', tags.name)
              ),
              '[{"id": null, "name": null}]'
            ),
            '[{"id": null, "name": null}]'
          ) AS tags
        FROM categories c
        LEFT JOIN articles atc ON atc.category_id = c.id
        LEFT JOIN users u ON u.id = atc.user_id
        LEFT JOIN articles_ref_tags art ON art.article_id = atc.id
        LEFT JOIN tags ON tags.id = art.tag_id
        WHERE c.id = 1 AND atc.state != '0' AND atc.visibility != '0'
        GROUP BY atc.id, c.id
        ORDER BY atc.is_sticky DESC, atc.id
      `
      const [res] = (await connection.execute(statement, [categoryId])) as RowDataPacket[][]
      return sortArticles(res as IArticles[])
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleListByTagId(tagId: number) {
    try {
      const statement = `
        SELECT
          atc.id,
          atc.title,
          atc.description,
          atc.cover_url coverUrl,
          atc.create_time createTime,
          atc.update_time updateTime,
          atc.is_sticky isSticky,
          atc.state,
          atc.visibility,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
          JSON_OBJECT('id', c.id, 'name', c.name) AS category,
          NULLIF(
              COALESCE(
                  JSON_ARRAYAGG(
                      JSON_OBJECT('id', tags.id, 'name', tags.name)
                  ),
                  '[{"id": null, "name": null}]'
              ),
              '[{"id": null, "name": null}]'
          ) AS tags
        FROM articles_ref_tags art
        LEFT JOIN articles atc ON atc.id = art.article_id
        LEFT JOIN users u ON u.id = atc.user_id
        LEFT JOIN categories c ON c.id = atc.category_id
        LEFT JOIN tags ON tags.id = art.tag_id
        WHERE art.tag_id = ? AND atc.state != '0' AND atc.visibility != '0'
        GROUP BY atc.id
        ORDER BY atc.is_sticky DESC, atc.id;
      `
      const [res] = (await connection.execute(statement, [tagId])) as RowDataPacket[][]
      return sortArticles(res as IArticles[])
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleById(articleId: number) {
    try {
      const statement = `
      SELECT
        atc.id,
        atc.title,
        atc.content,
        atc.description,
        atc.cover_url coverUrl,
        atc.create_time createTime,
        atc.update_time updateTime,
        atc.is_sticky isSticky,
        atc.state,
        atc.visibility,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
        JSON_OBJECT('id', c.id, 'name', c.name) AS category,
        NULLIF(
            COALESCE(
                JSON_ARRAYAGG(
                    JSON_OBJECT('id', tags.id, 'name', tags.name)
                ),
                '[{"id": null, "name": null}]'
            ),
            '[{"id": null, "name": null}]'
        ) AS tags
      FROM articles atc
      LEFT JOIN users u ON u.id = atc.user_id
      LEFT JOIN categories c ON c.id = atc.category_id
      LEFT JOIN articles_ref_tags art ON art.article_id = atc.id
      LEFT JOIN tags ON tags.id = art.tag_id
      WHERE atc.id = ?
      GROUP BY atc.id;
      `
      const [res] = await connection.execute(statement, [articleId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getIllustrationByFilename(filename: string) {
    try {
      const statement = `
        SELECT fi.mimetype mimetype, fi.filename filename FROM file_illustration fi
        WHERE filename = ?
        UNION
        SELECT fit.mimetype mimetype, fit.filename filename FROM file_illustration_temp fit
        WHERE filename = ?;
      `
      const [res] = (await connection.execute(statement, [filename, filename])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleCoverById(articleId: number) {
    try {
      const statement = `SELECT * FROM file_illustration WHERE article_id = ? AND is_cover = 1;`
      const [res] = (await connection.execute(statement, [articleId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticlesTotal(queryOption: IArticleListQueryOption) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'a')

      const statement = `
        SELECT COUNT(*) articlesTotal
        FROM articles a
        LEFT JOIN articles_ref_tags art ON art.article_id = a.id
        ${whereQuery};
      `
      const [res] = (await connection.execute(statement, whereVals)) as any
      return res[0].articlesTotal
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createArticle(insertOption: ICreateArticleParams) {
    const { insertQuery, insertVals } = optToInsertQuery(insertOption)
    const valPlaceholder = insertVals.map(() => '?').join(', ')

    try {
      const statement = `INSERT INTO articles (${insertQuery}) VALUES (${valPlaceholder});`
      const [res] = await connection.execute(statement, insertVals)
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async createTagsToAtc(articleId: number, tagIds: number[]) {
    const insertVals: number[] = []
    const valPlaceHolder = tagIds
      .map((item) => {
        insertVals.push(articleId, item)
        return '(?, ?)'
      })
      .join(', ')

    try {
      const statement = `INSERT IGNORE INTO articles_ref_tags (article_id, tag_id) VALUES ${valPlaceHolder};`
      const [res] = await connection.execute(statement, insertVals)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateArticleCover(articleId: number) {
    const coverUrl = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/articles/${articleId}/cover`
    try {
      const statement = `
        UPDATE articles
        SET cover_url = ?
        WHERE id = ?;
      `
      const [res] = (await connection.execute(statement, [coverUrl, articleId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateArticleById(articleId: number, updateOption: IArticleUpdateOption) {
    const { updateQuery, updateVals } = optToUpdateQuery(updateOption)

    try {
      const statement = `
        UPDATE articles
        SET ${updateQuery}
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [...updateVals, articleId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeArticleCover(articleId: number) {
    try {
      const statement = `
        UPDATE articles
        SET cover_url = null
        WHERE id = ?;
      `
      const [res] = (await connection.execute(statement, [articleId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async clearTags(articleId: number) {
    try {
      const statement = `DELETE FROM articles_ref_tags WHERE article_id = ?;`
      const [res] = await connection.execute(statement, [articleId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeArticleById(articleId: number) {
    try {
      const statement = `DELETE FROM articles WHERE id = ?;`
      const [res] = (await connection.execute(statement, [articleId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new ArticlesService()
