import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class MenuService {
  async getMenusByUserId(userId: number) {
    try {
      const statement = `
        SELECT DISTINCT menu.id, menu.name, menu.parent_id parentId
        FROM roles_ref_users ru
        LEFT JOIN roles r ON r.id = ru.role_id
        LEFT JOIN roles_ref_menu rm ON rm.role_id = r.id
        LEFT JOIN menu ON rm.menu_id = menu.id
        WHERE ru.user_id = ? AND r.status = '1' AND menu.id IS NOT NULL
      `
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new MenuService()
