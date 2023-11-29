import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'

class CategoriesService {
  async create(category: string) {
    try {
      const statement = `INSERT INTO categories (name) VALUES (?);`
      const [res] = await connection.execute(statement, [category])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async hasCategory(category: string) {
    try {
      const statement = `SELECT * FROM categories WHERE name = ?;`
      const [res] = (await connection.execute(statement, [category])) as RowDataPacket[]
      return !!res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getList() {
    try {
      const statement = `SELECT * FROM categories;`
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async remove(category: string) {
    try {
      const statement = `DELETE FROM categories WHERE name = ?;`
      const [res] = await connection.execute(statement, [category])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new CategoriesService()
