import connection from '../app/database'
import { IUsers } from '../types'

class UserService {
  async getUserByName(name: string) {
    const statement = `
      SELECT id, name, password, avatar_url, create_time, update_time 
      FROM users
      WHERE name = ?;
    `
    const [res] = await connection.execute(statement, [name])
    return res
  }

  async create(userInfo: IUsers) {
    const { name, password } = userInfo
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`
    const [res] = await connection.execute(statement, [name, password])
    return res
  }
}

export default new UserService()
