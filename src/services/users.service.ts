import type { RowDataPacket } from 'mysql2'
import connection from '../app/database'
import { APP_HOST, APP_PORT, APP_PROTOCOL } from '../config/env.config'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { IUsers } from '../types'
import { IUserSystemInfo } from '../utils/get-user-system-info'

class UserService {
  async getUserByName(name: string) {
    try {
      const statement = `
        SELECT id, name, password, avatar_url avatarUrl, phone_num phoneNum, browser_info browserInfo, os_info osInfo, ip_address ipAddress, update_time updateTime, create_time createTime
        FROM users
        WHERE name = ?;`
      const [res] = await connection.execute(statement, [name])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserByPhone(phone: string) {
    try {
      const statement = `
        SELECT id, name, password, avatar_url avatarUrl, phone_num phoneNum, browser_info browserInfo, os_info osInfo, ip_address ipAddress, update_time updateTime, create_time createTime
        FROM users
        WHERE phone_num = ?;
      `
      const [res] = await connection.execute(statement, [phone])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserById(userId: number) {
    try {
      const statement = `
        SELECT id, name, password, avatar_url avatarUrl, phone_num phoneNum, browser_info browserInfo, os_info osInfo, ip_address ipAddress, update_time updateTime, create_time createTime
        FROM users
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserList() {
    try {
      const statement = `
        SELECT id, name, avatar_url avatarUrl, create_time createTime, update_time updateTime
        FROM users;
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getAvatarByUserId(userId: number): Promise<RowDataPacket | undefined> {
    try {
      const statement = `SELECT * FROM file_avatar WHERE user_id = ?;`
      const [res] = (await connection.execute(statement, [userId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createUser(userInfo: IUsers, systemInfo: IUserSystemInfo) {
    try {
      const { name, password, phoneNum } = userInfo
      const { browserInfo, osInfo, ipAddress } = systemInfo
      const statement = `INSERT INTO users (name, password, phone_num, browser_info, os_info, ip_address) VALUES (?, ?, ?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [
        name,
        password,
        phoneNum,
        browserInfo,
        osInfo,
        ipAddress,
      ])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateAvatar(userId: number) {
    try {
      const avatarUrl = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/users/${userId}/avatar?ref=${Date.now()}`
      const statement = `
        UPDATE users
        SET avatar_url = ?
        WHERE id = ?;
      `
      const [res] = (await connection.execute(statement, [avatarUrl, userId])) as RowDataPacket[]
      return res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateUserSystemInfo(
    userId: number,
    browserInfo: string,
    osInfo: string,
    ipAddress: string,
  ) {
    try {
      const statement = `UPDATE users SET browser_info = ?, os_info = ?, ip_address = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [browserInfo, osInfo, ipAddress, userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateUserById(userId: number, name?: string | undefined, password?: string | undefined) {
    try {
      const setStateArr: string[] = []
      name && setStateArr.push('name = ?')
      password && setStateArr.push('password = ?')

      const setState = setStateArr.join(', ')
      const values = [...[name], ...[password], userId].filter((item) => item)

      const statement = `UPDATE users SET ${setState} WHERE id = ?;`
      const [res] = await connection.execute(statement, values)
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new UserService()
