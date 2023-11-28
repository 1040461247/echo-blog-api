import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class ArticlesCommentsService {
  async create(content: string, article_id: number, user_id: number) {
    try {
      const statement = `INSERT INTO articles_comments (content, article_id, user_id) VALUES (?, ?, ?);`
      const [res] = await connection.execute(statement, [content, article_id, user_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async reply(content: string, article_id: number, user_id: number, comment_id: number) {
    try {
      const statement = `INSERT INTO articles_comments (content, article_id, user_id, comment_id) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [content, article_id, user_id, comment_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async update(content: string, comment_id: number) {
    try {
      const statement = `UPDATE articles_comments SET content = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [content, comment_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async remove(comment_id: number) {
    try {
      const statement = `DELETE FROM articles_comments WHERE id = ?;`
      const [res] = await connection.execute(statement, [comment_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getCommentsById(article_id: number) {
    try {
      const statement = `
        SELECT ac.id id, ac.content content, ac.comment_id comment_id, ac.create_time create_time, ac.update_time update_time,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) user
        FROM articles_comments ac
        LEFT JOIN users u ON ac.user_id = u.id
        WHERE ac.article_id = ?;
      `
      const [res] = await connection.execute(statement, [article_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new ArticlesCommentsService()
