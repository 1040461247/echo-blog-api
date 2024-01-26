import type { DefaultContext } from 'koa'
import messageRecordService from '../services/message-record.service'
import { OkPacketParams, RowDataPacket } from 'mysql2'

// Types
interface IUnreadListParams {
  userId: number
}
interface IUnreadCountParams extends IUnreadListParams {}

class MessageRecordController {
  async list(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IUnreadListParams
      const [{ userMessage }] = (await messageRecordService.getListByUserId(userId)) as RowDataPacket[]
      ctx.success(userMessage)
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

  async unreadCount(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IUnreadCountParams
      const [res] = (await messageRecordService.getUnreadCountByUserId(userId!)) as RowDataPacket[]
      ctx.success(res)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MessageRecordController()
