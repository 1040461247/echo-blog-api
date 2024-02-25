import type { DefaultContext } from 'koa'
import messageRecordService from '../services/message-record.service'
import { OkPacketParams, RowDataPacket } from 'mysql2'

class MessageRecordController {
  async getMsgListByUserId(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params
      const { state, offset, limit } = ctx.query
      const resList = state
        ? await messageRecordService.getMsgListByState(userId, state, offset, limit)
        : await messageRecordService.getMsgListByUserId(userId, offset, limit)
      ctx.success(resList)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getMsgTotal(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params
      const [unreadCount] = (await messageRecordService.getUnreadCountByUserId(userId!)) as RowDataPacket[]
      const [allCount] = (await messageRecordService.getAllCountByUserId(userId!)) as RowDataPacket[]
      ctx.success({ ...unreadCount, ...allCount })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async clearUnread(ctx: DefaultContext) {
    try {
      const userId = ctx.user?.id
      const { affectedRows } = (await messageRecordService.clearUnreadByUserId(userId!)) as OkPacketParams
      ctx.success(null, { msg: affectedRows === 0 ? `暂无未读消息` : `${affectedRows}条数据已更新` })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MessageRecordController()
