import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

// Types
interface ICreateIllustrations {
  filename: string
  mimetype: string
  size: number
}

class FileService {
  async createAvatar(filename: string, mimetype: string, size: number, user_id: number) {
    try {
      const statement = `INSERT INTO file_avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [filename, mimetype, size, user_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createIllustration(files: ICreateIllustrations[], articleId: number) {
    const insertVals: any[] = []
    const valPlaceHolder = files
      .map((item) => {
        insertVals.push(item.filename, item.mimetype, item.size, articleId)
        return '(?, ?, ?, ?)'
      })
      .join(', ')

    try {
      const statement = `INSERT INTO file_illustration (filename, mimetype, size, article_id) VALUES ${valPlaceHolder};`
      const [res] = await connection.execute(statement, insertVals)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createIllustrationToTemp(files: ICreateIllustrations[], mark: string) {
    const insertVals: any[] = []
    const valPlaceHolder = files
      .map((item) => {
        insertVals.push(item.filename, item.mimetype, item.size, mark)
        return '(?, ?, ?, ?)'
      })
      .join(', ')

    try {
      const statement = `INSERT INTO file_illustration_temp (filename, mimetype, size, mark) VALUES ${valPlaceHolder};`
      const [res] = await connection.execute(statement, insertVals)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async saveIllustrationFromTemp(mark: string, articleId: number) {
    try {
      const statement = `
        INSERT INTO file_illustration (filename, mimetype, size, article_id)
        SELECT filename, mimetype, size, ${articleId} FROM file_illustration_temp
        WHERE mark = ?;
      `
      const [res] = await connection.execute(statement, [mark])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createCover(filename: string, mimetype: string, size: number, articleId: number) {
    try {
      const statement = `INSERT INTO file_illustration (filename, mimetype, size, article_id, is_cover) VALUES (?, ?, ?, ?, 1);`
      const [res] = await connection.execute(statement, [filename, mimetype, size, articleId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateAvatar(filename: string, mimetype: string, size: number, user_id: number) {
    try {
      const statement = `UPDATE file_avatar SET filename = ?, mimetype = ?, size = ? WHERE user_id = ?;`
      const [res] = await connection.execute(statement, [filename, mimetype, size, user_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateCover(filename: string, mimetype: string, size: number, articleId: number) {
    try {
      const statement = `
        UPDATE file_illustration
        SET filename = ?, mimetype = ?, size = ?
        WHERE article_id = ? AND is_cover = 1;
      `
      const [res] = await connection.execute(statement, [filename, mimetype, size, articleId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeCover(articleId: number) {
    try {
      const statement = `DELETE FROM file_illustration WHERE article_id = ? AND is_cover = 1;`
      const [res] = await connection.execute(statement, [articleId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new FileService()
