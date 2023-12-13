import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { RowDataPacket } from 'mysql2'
import sortArticles from '../utils/sort-articles'

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
      const statement = `
        SELECT *,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id
          ) article_count
        FROM categories c;
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async remove(categoryId: number) {
    try {
      const statement = `DELETE FROM categories WHERE id = ?;`
      const [res] = await connection.execute(statement, [categoryId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      const statement = `
        SELECT *,
          (
            SELECT COUNT(*)
            FROM articles a
            WHERE c.id = a.category_id
          ) article_count
        FROM categories c
        WHERE c.id = ?;
      `
      const [res] = await connection.execute(statement, [categoryId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getArticlesByCateId(categoryId: number) {
    try {
      const statement = `
        SELECT atc.id,
              atc.title,
              atc.content,
              atc.cover_url,
              atc.create_time,
              atc.update_time,
              atc.is_sticky,
              JSON_OBJECT('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url) AS author,
              JSON_OBJECT('id', c.id, 'name', c.name) AS category,
              NULLIF(
                  COALESCE(
                      JSON_ARRAYAGG(
                          JSON_OBJECT('id', tags.id, 'name', tags.name)
                      ),
                      '[{"id": null, "name": null}]'
                  ),
                  '[{"id": null, "name": null}]'
              ) AS tags
        FROM categories c
        LEFT JOIN articles atc ON atc.category_id = c.id
        LEFT JOIN users u ON u.id = atc.user_id
        LEFT JOIN articles_ref_tags art ON art.article_id = atc.id
        LEFT JOIN tags ON tags.id = art.tag_id
        WHERE c.id = ?
        GROUP BY atc.id, c.id;
      `
      const [res] = (await connection.execute(statement, [categoryId])) as RowDataPacket[][]
      return sortArticles(res)
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new CategoriesService()
