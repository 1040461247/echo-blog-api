import type { RowDataPacket } from 'mysql2'
import connection from '../app/database'
import { APP_HOST, APP_PORT, APP_PROTOCOL } from '../config/env.config'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { IUsers } from '../types'
import { IUserSystemInfo } from '../utils/get-user-system-info'
import { IDateRange, optToSortQuery, optToWhereQuery } from '../utils/gen-query'
import { pageToOffset } from '../utils/page-to-offset'

// Types
interface IGetUserListOpt {
  id?: string
  name?: string
  phoneNum?: string
  loginTime: IDateRange
  createTime: IDateRange
  current: string
  pageSize: string
  sort?: string
}

class UserService {
  async getUserList(queryOption: IGetUserListOpt) {
    const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
    const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'users')
    const sortQuery = optToSortQuery(queryOption.sort, 'users')

    try {
      const statement = `
      SELECT
        u.id,
        u.name,
        u.avatar_url AS avatarUrl,
        u.phone_num AS phoneNum,
        u.motto,
        u.browser_info AS browserInfo,
        u.os_info AS osInfo,
        u.ip_address AS ipAddress,
        u.login_time AS loginTime,
        NULLIF(
          COALESCE(
              JSON_ARRAYAGG(JSON_OBJECT(
                'id', r.id,
                'name', r.name,
                'level', r.level,
                'desc', r.\`desc\`,
                'createTime', r.create_time,
                'updateTime', r.update_time
              )),
              '[{"id": null, "desc": null, "name": null, "level": null, "createTime": null, "updateTime": null}]'
          ),
          '[{"id": null, "desc": null, "name": null, "level": null, "createTime": null, "updateTime": null}]'
        ) AS roles,
        u.update_time AS updateTime,
        u.create_time AS createTime
      FROM
        users u
      LEFT JOIN roles_ref_users rru ON rru.user_id = u.id
      LEFT JOIN roles r ON rru.role_id = r.id
      ${whereQuery}
      GROUP BY
        u.id, u.name, u.avatar_url, u.phone_num, u.motto, u.browser_info, u.os_info, u.ip_address, u.login_time, u.update_time, u.create_time
      ${sortQuery}
      LIMIT ?, ?;
    `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUsersTotal(queryOption: IGetUserListOpt) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'users')

      const statement = `
        SELECT COUNT(*) usersTotal
        FROM users
        ${whereQuery};
      `
      const [res] = (await connection.execute(statement, whereVals)) as any
      return res[0].usersTotal
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUserByName(name: string) {
    try {
      const statement = `
        SELECT
          id,
          name,
          password,
          avatar_url avatarUrl,
          phone_num phoneNum,
          motto,
          browser_info browserInfo,
          os_info osInfo,
          ip_address ipAddress,
          login_time loginTime,
          update_time updateTime,
          create_time createTime
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
        SELECT
          id,
          name,
          password,
          avatar_url avatarUrl,
          phone_num phoneNum,
          motto,
          browser_info browserInfo,
          os_info osInfo,
          ip_address ipAddress,
          login_time loginTime,
          update_time updateTime,
          create_time createTime
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
        SELECT
          id,
          name,
          password,
          avatar_url avatarUrl,
          phone_num phoneNum,
          motto,
          browser_info browserInfo,
          os_info osInfo,
          ip_address ipAddress,
          login_time loginTime,
          update_time updateTime,
          create_time createTime
        FROM users
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [userId])
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

  async getRolesByUserId(userId: number) {
    try {
      const statement = `
        SELECT r.id id, r.name name, r.level level, r.\`desc\` \`desc\`, r.create_time createTime, r.update_time updateTime
        FROM roles_ref_users rru
        LEFT JOIN roles r ON rru.role_id = r.id
        WHERE rru.user_id = ?;
      `
      const [res] = await connection.execute(statement, [userId])
      return res
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

  async updateUserLoginTime(loginTime: Date, userId: number) {
    try {
      const statement = `UPDATE users SET login_time = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [loginTime, userId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new UserService()
