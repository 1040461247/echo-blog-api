import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

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
  async updateAvatar(filename: string, mimetype: string, size: number, user_id: number) {
    try {
      const statement = `UPDATE file_avatar SET filename = ?, mimetype = ?, size = ? WHERE user_id = ?;`
      const [res] = await connection.execute(statement, [filename, mimetype, size, user_id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new FileService()
