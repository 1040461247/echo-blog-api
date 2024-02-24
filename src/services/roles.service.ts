import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class RolesService {
  async getRolesByUserId(userId: number) {
    try {
      const statement = `
        SELECT r.id, r.name
        FROM roles_ref_users ru
        LEFT JOIN roles r ON r.id = ru.role_id
        WHERE ru.user_id = ? AND r.status = '1';
      `
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new RolesService()
