import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'

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

  async createTag(tag: string) {
    try {
      const statement = `INSERT INTO tags (name) VALUES (?);`
      const [res] = await connection.execute(statement, [tag])
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
