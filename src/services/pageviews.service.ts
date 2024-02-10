import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class PageviewsService {
  async create(ipAddress: string, pageUrl: string) {
    try {
      const statement = `INSERT INTO pageviews (ip_address, page_url) VALUES (?, ?);`
      const [res] = await connection.execute(statement, [ipAddress, pageUrl])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getPvByPageUrl(pageUrl: string) {
    try {
      const statement = `SELECT COUNT(*) pvCount FROM pageviews WHERE page_url = ?;`
      const [res] = await connection.execute(statement, [pageUrl])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getPv() {
    try {
      const statement = `SELECT COUNT(*) pvCount FROM pageviews;`
      const [res] = await connection.execute(statement, [])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUv() {
    try {
      const statement = `
        SELECT DATE(create_time) as visitDate, COUNT(DISTINCT ip_address) as uvCount
        FROM pageviews
        GROUP BY visitDate
        ORDER BY visitDate
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new PageviewsService()
