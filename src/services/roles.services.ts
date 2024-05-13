import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import { IDateRange, optToSortQuery, optToWhereQuery } from '../utils/gen-query'
import { pageToOffset } from '../utils/page-to-offset'

// Types
interface IGetRoleListOpt {
  id?: string
  name?: string
  level?: string
  desc?: string
  createTime?: IDateRange
  sort?: string
  current: string
  pageSize: string
}

class RolesService {
  async getRoleList(queryOption: IGetRoleListOpt) {
    const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
    const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'roles')
    const sortQuery = optToSortQuery(queryOption.sort, 'roles')

    try {
      const statement = `
        SELECT id, name, level, \`desc\`, create_time createTime, update_time updateTime
        FROM roles
        ${whereQuery}
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

  async getRoleTotal(queryOption: IGetRoleListOpt) {
    const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'r')

    try {
      const statement = `
        SELECT COUNT(*) rolesTotal
        FROM roles r
        ${whereQuery};
      `
      const [res] = (await connection.execute(statement, [...whereVals])) as any
      return res[0].rolesTotal
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getMenuKeysByRoleId(roleId: number) {
    try {
      const statement = `
        SELECT JSON_ARRAYAGG(menu_id) menuKeys
        FROM roles_ref_menus
        WHERE role_id = ?;
      `
      const [res] = (await connection.execute(statement, [roleId])) as any
      return res[0].menuKeys
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateMenusByRoleId(roleId: number, menuKeys: number[]) {
    const insertVals: number[] = []
    const valPlaceHolder = menuKeys
      .map((item) => {
        insertVals.push(roleId, item)
        return '(?, ?)'
      })
      .join(', ')

    try {
      const statement = `INSERT IGNORE INTO roles_ref_menus (role_id, menu_id) VALUES ${valPlaceHolder}`
      const [res] = (await connection.execute(statement, insertVals)) as any
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeMenusByRoleId(roleId: number) {
    try {
      const statement = `DELETE FROM roles_ref_menus WHERE role_id = ?;`
      const [res] = await connection.execute(statement, [roleId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new RolesService()
