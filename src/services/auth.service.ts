import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class AuthService {
  async hasPermission(resourceName: string, resourceFiledId: number, userId: number) {
    try {
      const statement = `SELECT id FROM ${resourceName} WHERE id = ? AND user_id = ?;`
      const [res] = await connection.execute(statement, [resourceFiledId, userId])
      if (Array.isArray(res) && res.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new AuthService()
