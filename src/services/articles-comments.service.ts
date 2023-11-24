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
}

export default new ArticlesCommentsService()
