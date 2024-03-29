import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'

class CategoriesService {
  async getCategoryList() {
    try {
      const statement = `
        SELECT c.id, c.name, c.create_time createTime, c.update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id AND a.state != '0' AND a.visibility != '0'
          ) articleCount
        FROM categories c;
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      const statement = `
        SELECT c.id, c.name, c.create_time createTime, c.update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id AND a.state != '0' AND a.visibility != '0'
          ) articleCount
        FROM categories c
        WHERE c.id = ?;
      `
      const [res] = await connection.execute(statement, [categoryId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createCategory(category: string) {
    try {
      const statement = `INSERT INTO categories (name) VALUES (?);`
      const [res] = await connection.execute(statement, [category])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async removeCategory(categoryId: number) {
    try {
      const statement = `DELETE FROM categories WHERE id = ?;`
      const [res] = await connection.execute(statement, [categoryId])
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
}

export default new CategoriesService()
