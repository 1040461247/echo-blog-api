import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import { ICreateBody } from '../controllers/friend-links-audit.controller'

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
}

export default new FriendLinksAuditService()
