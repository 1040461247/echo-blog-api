import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

// Types
export type TAuditState = '0' | '1'

class FriendLinksAuditService {
  async create(linkName: string, linkUrl: string, linkIcon: string, linkDesc: string) {
    try {
      const statement = `INSERT INTO friend_links_audit (link_name, link_url, link_icon, link_desc) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [linkName, linkUrl, linkIcon, linkDesc])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async audit(state: TAuditState, id: number) {
    try {
      const statement = `UPDATE friend_links_audit SET audit_state = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [state, id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getPassedList() {
    try {
      const statement = `SELECT id, link_name, link_url, link_icon, link_desc FROM friend_links_audit WHERE audit_state = '1';`
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new FriendLinksAuditService()
