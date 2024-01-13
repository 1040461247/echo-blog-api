import type { RowDataPacket } from 'mysql2'
import connection from '../app/database'
import { APP_HOST, APP_PORT, APP_PROTOCOL } from '../config/env.config'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { IUsers } from '../types'
import { IUserSystemInfo } from '../utils/get-user-system-info'

class UserService {
  async getUserByName(name: string) {
    try {
      const statement = `SELECT * FROM users WHERE name = ?;`
      const [res] = await connection.execute(statement, [name])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserByPhone(phone: string) {
    try {
      const statement = `SELECT * FROM users WHERE phone_num = ?;`
      const [res] = await connection.execute(statement, [phone])
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

  async create(userInfo: IUsers, systemInfo: IUserSystemInfo) {
    const { name, password, phone_num } = userInfo
    const { browser_info, os_info, ip_address } = systemInfo

    try {
      const statement = `INSERT INTO users (name, password, phone_num, browser_info, os_info, ip_address) VALUES (?, ?, ?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [name, password, phone_num, browser_info, os_info, ip_address])
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

  async updateAvatar(userId: number) {
    const avatar_url = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/users/${userId}/avatar`
    try {
      const statement = `
        UPDATE users
        SET avatar_url = ?
        WHERE id = ?;
      `
      const [res] = (await connection.execute(statement, [avatar_url, userId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateUserSystemInfo(userId: number, browser_info: string, os_info: string, ip_address: string) {
    try {
      const statement = `UPDATE users SET browser_info = ?, os_info = ?, ip_address = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [browser_info, os_info, ip_address, userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new UserService()
