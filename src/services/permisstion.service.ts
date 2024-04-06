import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import {
  optToInsertQuery,
  optToSortQuery,
  optToUpdateQuery,
  optToWhereQuery,
} from '../utils/gen-query'
import { pageToOffset } from '../utils/page-to-offset'

// Types
interface IDateRange {
  startTime: string
  endTime: string
}

interface IGetPermissionListOption {
  current: string
  pageSize: string
  sort: string
  id: string
  mark: string
  markName: string
  name: string
  url: string
  action: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  state: '0' | '1'
  authentication: '0' | '1'
  authorization: '0' | '1'
  createTime: IDateRange
  updateTime: IDateRange
}

export type TPermissionAction = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface ICreatePermissionOption {
  mark: string
  markName: string
  name: string
  url: string
  action: TPermissionAction
  state: '0' | '1'
  authentication: '0' | '1'
  authorization: '0' | '1'
}

export interface IUpdatePermissionOption {
  mark?: string
  markName?: string
  name?: string
  url?: string
  action?: TPermissionAction
  state?: '0' | '1'
  authentication?: '0' | '1'
  authorization?: '0' | '1'
}

class PermissionService {
  async getPermissionList(queryOption: IGetPermissionListOption) {
    try {
      // 动态生成查询语句
      const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'p')
      const sortQuery = optToSortQuery(queryOption.sort, 'p')

      const statement = `
        SELECT
          p.id,
          p.mark,
          p.mark_name markName,
          p.name,
          p.url,
          p.action,
          p.state,
          p.authentication,
          p.authorization,
          p.description,
          p.create_time createTime,
          p.update_time updateTime
        FROM permission p
        ${whereQuery}
        ${sortQuery}
        LIMIT ?, ?
      `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
      return res
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async getPermissionsTotal(queryOption: IGetPermissionListOption) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'p')

      const statement = `
        SELECT COUNT(*) permissionsTotal
        FROM permission p
        ${whereQuery};
      `
      const [res] = (await connection.execute(statement, whereVals)) as any
      return res[0].permissionsTotal
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async createPermission(insertOption: ICreatePermissionOption) {
    try {
      // 动态获取插入语句
      const { insertQuery, insertVals } = optToInsertQuery(insertOption)
      const valPlaceholder = insertVals.map(() => '?').join(', ')

      const statement = `INSERT INTO permission (${insertQuery}) VALUES (${valPlaceholder})`
      const [res] = await connection.execute(statement, insertVals)
      return res
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async updatePermissionById(permissionId: number, updateOption: IUpdatePermissionOption) {
    try {
      // 动态获取更新语句
      const { updateQuery, updateVals } = optToUpdateQuery(updateOption)

      const statement = `
        UPDATE permission
        SET ${updateQuery}
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [...updateVals, permissionId])
      return res
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async removePermissionById(permissionId: number) {
    try {
      const statement = `DELETE FROM permission WHERE id = ?`
      const [res] = await connection.execute(statement, [permissionId])
      return res
    } catch (error) {
      console.error(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new PermissionService()
