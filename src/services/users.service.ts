import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import type { IUsers } from '../types'

class UserService {
  async getUserByName(name: string) {
    try {
      const statement = `SELECT id, name, password, avatar_url, create_time, update_time FROM users WHERE name = ?;`
      const [res] = await connection.execute(statement, [name])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserList() {
    try {
      const statement = `SELECT id, name, avatar_url, create_time, update_time FROM users;`
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async create(userInfo: IUsers) {
    const { name, password } = userInfo

    try {
      const statement = `INSERT INTO users (name, password) VALUES (?, ?);`
      const [res] = await connection.execute(statement, [name, password])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getAvatarById(userId: number): Promise<RowDataPacket | undefined> {
    try {
      const statement = `SELECT * FROM file_avatar WHERE user_id = ?;`
      const [res] = (await connection.execute(statement, [userId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new UserService()
