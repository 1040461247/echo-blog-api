import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import { pageToOffset } from '../utils/page-to-offset'
import { optToSortQuery, optToWhereQuery } from '../utils/gen-query'

// Types
interface IDateRange {
  startTime: string
  endTime: string
}

interface ICategoryListQueryOption {
  current: string
  pageSize: string
  id?: string | number
  name?: string
  createTime?: IDateRange
  updateTime?: IDateRange
  sort?: string
}

class CategoriesService {
  async getCategoryList(queryAllCount: boolean) {
    try {
      const statement = `
        SELECT c.id, c.name, c.create_time createTime, c.update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id ${
              queryAllCount ? '' : "AND a.state != '0' AND a.visibility != '0'"
            }
          ) articleCount
        FROM categories c;
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getCategoryListQuery(queryOption: ICategoryListQueryOption) {
    // 动态生成查询语句
    const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
    const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'c')
    const sortQuery = optToSortQuery(queryOption.sort, 'c', ['articleCount'])

    try {
      const statement = `
        SELECT c.id, c.name, c.create_time createTime, c.update_time updateTime,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id
          ) articleCount
        FROM categories c
        ${whereQuery ? whereQuery : ''}
        ${sortQuery ? sortQuery : ''}
        LIMIT ?, ?;
      `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
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

  async getCategoriesTotal(queryOption: ICategoryListQueryOption) {
    try {
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'categories')
      const statement = `SELECT COUNT(*) categoriesTotal FROM categories ${
        whereQuery ? whereQuery : ''
      };`
      const [res] = (await connection.execute(statement, whereVals)) as RowDataPacket[]
      return res[0].categoriesTotal
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getRelatedAtcCount(categoryId: number) {
    try {
      const statement = `SELECT COUNT(*) relatedAtcCount FROM articles WHERE category_id = ?;`
      const [res] = (await connection.execute(statement, [categoryId])) as RowDataPacket[]
      return res[0].relatedAtcCount
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

  async updateCategoryById(categoryId: number, category: string) {
    try {
      const statement = `UPDATE categories SET name = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [category, categoryId])
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
