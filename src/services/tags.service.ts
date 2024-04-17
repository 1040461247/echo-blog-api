import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import { pageToOffset } from '../utils/page-to-offset'
import { optToSortQuery, optToWhereQuery } from '../utils/gen-query'

// Types
interface IDateRange {
  startTime: string
  endTime: string
}
interface ITagListQueryOption {
  current: string
  pageSize: string
  id?: string | number
  name?: string
  createTime?: IDateRange
  updateTime?: IDateRange
  sort?: string
}

class TagsService {
  async getTagList() {
    try {
      const statement = `
        SELECT id, name, create_time createTime, update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles_ref_tags art
            LEFT JOIN articles a ON a.id = art.article_id
            WHERE tags.id = art.tag_id AND a.state != '0' AND a.visibility != '0'
          ) articleCount
        FROM tags;
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getTagListQuery(queryOption: ITagListQueryOption) {
    // 动态生成查询语句
    const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
    const { whereQuery, whereVals } = optToWhereQuery(queryOption, 't')
    const sortQuery = optToSortQuery(queryOption.sort, 't', ['articleCount'])

    try {
      const statement = `
        SELECT t.id, t.name, t.create_time createTime, t.update_time updateTime,
        (
          SELECT COUNT(*)
          FROM articles_ref_tags art
          LEFT JOIN articles a ON a.id = art.article_id
          WHERE t.id = art.tag_id
        ) articleCount
        FROM tags t
        ${whereQuery}
        ${sortQuery}
        LIMIT ?, ?;
      `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
      return res
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getTagById(tagId: number) {
    try {
      const statement = `
        SELECT id, name, create_time createTime, update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles_ref_tags art
            WHERE tags.id = art.tag_id
          ) articleCount
        FROM tags
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [tagId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getTagsTotal(queryOption: ITagListQueryOption) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'tags')
      const statement = `SELECT COUNT(*) tagsTotal FROM tags ${whereQuery};`
      const [res] = (await connection.execute(statement, whereVals)) as RowDataPacket[]
      return res[0].tagsTotal
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getRelatedAtcCount(tagId: number) {
    try {
      const statement = `SELECT COUNT(*) relatedAtcCount FROM articles_ref_tags WHERE tag_id = ?;`
      const [res] = (await connection.execute(statement, [tagId])) as RowDataPacket[]
      return res[0].relatedAtcCount
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createTag(tag: string) {
    try {
      const statement = `INSERT INTO tags (name) VALUES (?);`
      const [res] = await connection.execute(statement, [tag])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateCategoryById(categoryId: number, tag: string) {
    try {
      const statement = `UPDATE tags SET name = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [tag, categoryId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeTagById(tagId: number) {
    try {
      const statement = `DELETE FROM tags WHERE id = ?;`
      const [res] = await connection.execute(statement, [tagId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async hasTag(tag: string) {
    try {
      const statement = `SELECT * FROM tags WHERE name = ?;`
      const [res] = (await connection.execute(statement, [tag])) as RowDataPacket[]
      return !!res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new TagsService()
