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
          (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ac.id) totalLikes,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url, 'browser_info', u.browser_info, 'os_info', u.os_info, 'ip_address', u.ip_address) user
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

  async getCommentById(commentId: number) {
    try {
      const statement = `
        SELECT ac.id id, ac.content content, ac.article_id article_id, ac.comment_id comment_id, ac.create_time create_time, ac.update_time update_time,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url, 'browser_info', u.browser_info, 'os_info', u.os_info, 'ip_address', u.ip_address) user
        FROM articles_comments ac
        LEFT JOIN users u ON ac.user_id = u.id
        WHERE ac.id = ?;
      `
      const [res] = await connection.execute(statement, [commentId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async addLikes(user_id: number, comment_id: number) {
    try {
      const statement = `INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?);`
      const [res] = await connection.execute(statement, [user_id, comment_id])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async remLikes(user_id: number, comment_id: number) {
    try {
      const statement = `DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?;`
      const [res] = await connection.execute(statement, [user_id, comment_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getLikesCountById(comment_id: number) {
    try {
      const statement = `SELECT COUNT(*) totalLikes FROM comment_likes WHERE comment_id = ?;`
      const [res] = await connection.execute(statement, [comment_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getLikesByUserId(userId: number) {
    try {
      const statement = `
        SELECT JSON_ARRAYAGG(comment_likes.comment_id) commentLikes
        FROM comment_likes
        WHERE comment_likes.user_id = ?
        GROUP BY comment_likes.user_id;
      `
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new ArticlesCommentsService()
