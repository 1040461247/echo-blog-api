import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class ArticlesCommentsService {
  async getCommentsByAtcId(articleId: number) {
    try {
      const statement = `
        SELECT ac.id id, ac.content content, ac.comment_id commentId, ac.create_time createTime, ac.update_time updateTime,
          (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ac.id) totalLikes,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url, 'browserInfo', u.browser_info, 'osInfo', u.os_info, 'ipAddress', u.ip_address) user
        FROM articles_comments ac
        LEFT JOIN users u ON ac.user_id = u.id
        WHERE ac.article_id = ?;
      `
      const [res] = await connection.execute(statement, [articleId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getLikesCountByCmtId(commentId: number) {
    try {
      const statement = `SELECT COUNT(*) totalLikes FROM comment_likes WHERE comment_id = ?;`
      const [res] = await connection.execute(statement, [commentId])
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

  async getCommentById(commentId: number) {
    try {
      const statement = `
        SELECT ac.id id, ac.content content, ac.article_id articleId, ac.comment_id commentId, ac.create_time createTime, ac.update_time updateTime,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url, 'browserInfo', u.browser_info, 'osInfo', u.os_info, 'ipAddress', u.ip_address) user
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

  async createComment(content: string, articleId: number, userId: number) {
    try {
      const statement = `INSERT INTO articles_comments (content, article_id, user_id) VALUES (?, ?, ?);`
      const [res] = await connection.execute(statement, [content, articleId, userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createReply(content: string, articleId: number, userId: number, commentId: number) {
    try {
      const statement = `INSERT INTO articles_comments (content, article_id, user_id, comment_id) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [content, articleId, userId, commentId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createLikes(userId: number, commentId: number) {
    try {
      const statement = `INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?);`
      const [res] = await connection.execute(statement, [userId, commentId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateComment(content: string, commentId: number) {
    try {
      const statement = `UPDATE articles_comments SET content = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [content, commentId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeComment(commentId: number) {
    try {
      const statement = `DELETE FROM articles_comments WHERE id = ?;`
      const [res] = await connection.execute(statement, [commentId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeLikes(userId: number, commentId: number) {
    try {
      const statement = `DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?;`
      const [res] = await connection.execute(statement, [userId, commentId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new ArticlesCommentsService()
