import connection from '../app/database'
import { APP_HOST, APP_PORT, APP_PROTOCOL } from '../config/env.config'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import sortArticles from '../utils/sort-articles'
import { IArticles } from '../types'

class ArticlesService {
  async getArticleList(offset = '0', limit = '1') {
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
      LIMIT ?, ?;
    `
      const [res] = (await connection.execute(statement, [offset, limit])) as RowDataPacket[][]
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleListAllStatus(offset = '0', limit = '10') {
    try {
      const statement = `
      SELECT
        atc.id,
        atc.title,
        atc.description,
        atc.cover_url coverUrl,
        atc.state,
        atc.visibility,
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
      GROUP BY atc.id
      LIMIT ?, ?;
    `
      const [res] = (await connection.execute(statement, [offset, limit])) as RowDataPacket[][]
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
        WHERE c.id = ?
        GROUP BY atc.id, c.id;
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
        WHERE art.tag_id = ?
        GROUP BY atc.id;
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
      const statement = `SELECT * FROM file_illustration WHERE filename = ?;`
      const [res] = (await connection.execute(statement, [filename])) as RowDataPacket[]
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

  async getArticlesTotal() {
    try {
      const statement = `SELECT COUNT(*) articlesTotal FROM articles;`
      const [res] = (await connection.execute(statement)) as any
      return res[0].articlesTotal
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createArticle(
    title: string,
    content: string,
    userId: number,
    categoryId: number,
    coverUrl = '',
    isSticky = 0,
    description: string,
  ) {
    try {
      const statement = `INSERT INTO articles (title, content, user_id, cover_url, category_id, is_sticky, description) VALUES (?, ?, ?, ?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [
        title,
        content,
        userId,
        coverUrl,
        categoryId,
        isSticky,
        description,
      ])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createTagToAtc(articleId: number, tagId: number) {
    try {
      const statement = `INSERT INTO articles_ref_tags (article_id, tag_id) VALUES(?, ?);`
      const [res] = await connection.execute(statement, [articleId, tagId])
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

  async updateAtcCategory(articleId: number, categoryId: number) {
    try {
      const statement = `
        UPDATE articles
        SET category_id = ?
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [categoryId, articleId])
      return res
    } catch (error) {
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
}

export default new ArticlesService()
