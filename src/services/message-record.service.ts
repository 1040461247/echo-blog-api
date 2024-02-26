import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

// Types
type TMessageType = '0' | '1' | '2' | '3' | '4'
type TMsgState = '0' | '1'

class MessageRecordService {
  async getMsgListByUserId(userId: number, offset = 0, limit = 10) {
    try {
      const statement = `
        SELECT mr.id, mr.message_type messageType, mr.content, mr.link_atc_id linkAtcId, mr.create_time createTime,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) sendUser
        FROM message_record mr
        LEFT JOIN users u ON u.id = mr.send_user
        WHERE target_user = ?
        ORDER BY mr.create_time DESC
        LIMIT ?, ?
      `
      const [res] = await connection.execute(statement, [userId, offset, limit])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getMsgListByState(userId: number, state: TMsgState, offset = 0, limit = 10) {
    try {
      const statement = `
        SELECT mr.id, mr.message_type messageType, mr.content, mr.link_atc_id linkAtcId, mr.create_time createTime,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) sendUser
        FROM message_record mr
        LEFT JOIN users u ON u.id = mr.send_user
        WHERE target_user = ? AND state = ?
        ORDER BY mr.create_time DESC
        LIMIT ?, ?
      `
      const [res] = await connection.execute(statement, [userId, state, offset, limit])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getUnreadCountByUserId(userId: number) {
    try {
      const statement = `SELECT COUNT(*) unreadCount FROM message_record WHERE target_user = ? AND state = '0';`
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async getAllCountByUserId(userId: number) {
    try {
      const statement = `SELECT COUNT(*) allCount FROM message_record WHERE target_user = ?;`
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }

  async createMessage(
    messageType: TMessageType,
    sendUser: number,
    targetUser: number,
    content: string,
    linkAtcId: number,
  ) {
    try {
      const statement = `INSERT INTO message_record (message_type, send_user, target_user, content, link_atc_id) VALUES (?, ?, ?, ?, ?)`
      const [res] = await connection.execute(statement, [
        messageType,
        sendUser,
        targetUser,
        content,
        linkAtcId,
      ])
      return res
    } catch (error) {
      console.log(error)
      throw new Error(DATABASE_ERROR)
    }
  }

  async clearUnreadByUserId(userId: number) {
    try {
      const statement = `UPDATE message_record SET state = '1' WHERE target_user = ? AND state = '0';`
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new MessageRecordService()
