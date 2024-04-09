import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import { optToWhereQuery } from '../utils/gen-query'
import { pageToOffset } from '../utils/page-to-offset'

// Types
export type TAuditState = '0' | '1'

interface IFriendLinksOption {
  auditState: 'nopass' | 'pass' | 'pending'
  current: string
  pageSize: string
}
class FriendLinksService {
  async getFriendList(queryOption: IFriendLinksOption) {
    try {
      // 动态生成查询语句
      const { offset, limit } = pageToOffset(queryOption.current, queryOption.pageSize)
      const { whereQuery, whereVals } = optToWhereQuery(queryOption, 'fl', undefined, [
        'auditState',
      ])

      const statement = `
      SELECT
        fl.id id,
        fl.link_name linkName,
        fl.link_url linkUrl,
        fl.link_icon linkIcon,
        fl.link_desc linkDesc,
        fl.audit_state auditState,
        fl.create_time createTime,
        fl.update_time updateTime
      FROM friend_links fl
      ${whereQuery}
      LIMIT ?, ?;
      `
      const [res] = await connection.execute(statement, [...whereVals, offset, limit])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async createFriendAudit(linkName: string, linkUrl: string, linkIcon: string, linkDesc: string) {
    try {
      const statement = `INSERT INTO friend_links (link_name, link_url, link_icon, link_desc) VALUES (?, ?, ?, ?);`
      const [res] = await connection.execute(statement, [linkName, linkUrl, linkIcon, linkDesc])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async approveFriendAudit(state: TAuditState, id: number) {
    try {
      const statement = `UPDATE friend_links SET audit_state = ? WHERE id = ?;`
      const [res] = await connection.execute(statement, [state, id])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new FriendLinksService()
