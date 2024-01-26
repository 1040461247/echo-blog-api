import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class MessageRecordService {
  async getListByUserId(userId: number) {
    try {
      const statement = `
        SELECT JSON_OBJECT(
          'unRead', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', mr.id,
                'content', mr.content,
                'link', mr.link,
                'createTime', mr.create_time,
                'sendUser', JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url)
              )) FROM message_record WHERE message_record.state = '0' GROUP BY send_user),
            'read', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', mr.id,
                'content', mr.content,
                'link', mr.link,
                'createTime', mr.create_time,
                'sendUser', JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url)
              )) FROM message_record WHERE message_record.state = '1' GROUP BY send_user),
            'like', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', mr.id,
                'content', mr.content,
                'link', mr.link,
                'createTime', mr.create_time,
                'sendUser', JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url)
              )) FROM message_record WHERE message_record.message_type = '0' GROUP BY send_user),
            'comment', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', mr.id,
                'content', mr.content,
                'link', mr.link,
                'createTime', mr.create_time,
                'sendUser', JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url)
              )) FROM message_record WHERE message_record.message_type = '1' GROUP BY send_user),
            'notice', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', mr.id,
                'content', mr.content,
                'link', mr.link,
                'createTime', mr.create_time,
                'sendUser', JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url)
              )) FROM message_record WHERE message_record.message_type = '2' GROUP BY send_user)
          ) userMessage
        FROM message_record mr
        LEFT JOIN users u ON u.id = mr.send_user
        WHERE target_user = 5;
      `
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
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

  async getUnreadCountByUserId(userId: number) {
    try {
      const statement = `SELECT COUNT(*) unreadCount FROM message_record WHERE target_user = ? AND state = '0';`
      const [res] = await connection.execute(statement, [userId])
      return res
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new MessageRecordService()
