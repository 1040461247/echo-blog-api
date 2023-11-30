import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'

class ArticlesService {
  async create(title: string, content: string, user_id: number, album_url = '') {
    try {
      const statement = `INSERT INTO articles (title, content, user_id, album_url) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [title, content, user_id, album_url])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getList(offset = 0, limit = 10) {
    try {
      const statement = `
      SELECT atc.id, atc.title, atc.content, atc.album_url, atc.create_time, atc.update_time,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) author
      FROM articles atc
      LEFT JOIN users u ON u.id = atc.user_id
      LIMIT ?, ?;
    `
      const [res] = await connection.execute(statement, [offset, limit])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticleById(articleId: number) {
    try {
      const statement = `
        SELECT atc.id, atc.title, atc.content, atc.album_url, atc.create_time, atc.update_time,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) author
        FROM articles atc
        LEFT JOIN users u ON u.id = atc.user_id
        WHERE atc.id = ?;
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

  }
}

export default new ArticlesService()
