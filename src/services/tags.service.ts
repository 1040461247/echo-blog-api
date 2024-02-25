import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import sortArticles from '../utils/sort-articles'

class TagsService {
  async getTagList() {
    try {
      const statement = `
        SELECT id, name, create_time createTime, update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles_ref_tags art
            WHERE tags.id = art.tag_id
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

  async getArticlesByTagId(tagId: number) {
    try {
      const statement = `
        SELECT atc.id,
              atc.title,
              atc.content,
              atc.description,
              atc.cover_url coverUrl,
              atc.create_time createTime,
              atc.update_time updateTime,
              atc.is_sticky isSticky,
              JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) AS author,
              JSON_OBJECT('id', c.id, 'name', c.name) AS category,
              JSON_ARRAYAGG(JSON_OBJECT('id', tags.id, 'name', tags.name)) AS tags
        FROM articles_ref_tags art
        LEFT JOIN articles atc ON atc.id = art.article_id
        LEFT JOIN users u ON u.id = atc.user_id
        LEFT JOIN categories c ON c.id = atc.category_id
        LEFT JOIN tags ON tags.id = art.tag_id
        WHERE art.tag_id = ?
        GROUP BY atc.id;
      `
      const [res] = (await connection.execute(statement, [tagId])) as RowDataPacket[][]
      return sortArticles(res)
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
