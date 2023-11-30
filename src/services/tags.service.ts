import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'

class TagsService {
  async create(tag: string) {
    try {
      const statement = `INSERT INTO tags (name) VALUES (?);`
      const [res] = await connection.execute(statement, [tag])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async hasTag(tag: string) {
    try {
      const statement = `SELECT * FROM tags WHERE name = ?;`
      const [res] = (await connection.execute(statement, [tag])) as RowDataPacket[]
      return !!res[0]
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getList() {
    try {
      const statement = `SELECT * FROM tags;`
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async remove(tagId: number) {
    try {
      const statement = `DELETE FROM tags WHERE id = ?;`
      const [res] = await connection.execute(statement, [tagId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new TagsService()
