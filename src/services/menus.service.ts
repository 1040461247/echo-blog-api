import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import { IDateRange, optToUpdateQuery, optToWhereQuery } from '../utils/gen-query'

export interface IGetMenuListOpt {
  id: string
  pid: string
  name: string
  path: string
  createTime?: IDateRange
}

export type TMenuType = 'dir' | 'menu' | 'btn'

export interface IUpdateMenuByIdOpt {
  name?: string
  path?: string
  type?: TMenuType
  permission?: string
  sort?: number
  hidden?: 0 | 1
}

class MenuService {
  async getMenuList(queryOption: IGetMenuListOpt, topMenu: boolean) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'menus')
      const values = !topMenu && whereVals
      const statement = `
        SELECT id, pid, name, icon, path, type, permission, sort, hidden, has_children hasChildren, create_time createTime, update_time updateTime
        FROM menus
        ${topMenu ? 'WHERE pid IS NULL' : whereQuery}
        ORDER BY menus.sort
      `
      const [res] = await connection.execute(statement, values)
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async updateMenuById(menuId: number, updateOpt: IUpdateMenuByIdOpt) {
    const { updateQuery, updateVals } = optToUpdateQuery(updateOpt)
    try {
      const statement = `
        UPDATE menus
        SET ${updateQuery}
        WHERE id = ?;
      `
      const [res] = await connection.execute(statement, [...updateVals, menuId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeMenuById(menuId: number) {
    try {
      const statement = `DELETE FROM menus WHERE id = ?`
      const [res] = await connection.execute(statement, [menuId])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new MenuService()
