import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class FriendLinksService {
  async getPassedFriendList() {
    try {
      const statement = `
        SELECT id, link_name linkName, link_url linkUrl, link_icon linkIcon, link_desc linkDesc
        FROM friend_links_audit
        WHERE audit_state = '1';
      `
      const [res] = await connection.execute(statement)
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new FriendLinksService()
