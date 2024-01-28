import type { DefaultContext } from 'koa'
import messageRecordService from '../services/message-record.service'
import { OkPacketParams, RowDataPacket } from 'mysql2'

// Types
interface IListParams {
  userId: number
}
export type TMsgState = '0' | '1'
interface IListQuery {
  state: TMsgState
  offset?: number
  limit?: number
}
interface IUnreadCountParams extends IListParams {}

class MessageRecordController {
  async list(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IListParams
      const { state, offset, limit } = ctx.query as IListQuery

      let resList
      if (state) {
        resList = await messageRecordService.getListByState(userId, state, offset, limit)
      } else {
        resList = await messageRecordService.getList(userId, offset, limit)
      }
      ctx.success(resList)
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

  async total(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IUnreadCountParams
      const [unreadCount] = (await messageRecordService.getUnreadCountByUserId(userId!)) as RowDataPacket[]
      const [allCount] = (await messageRecordService.getAllCountByUserId(userId!)) as RowDataPacket[]
      ctx.success({ ...unreadCount, ...allCount })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MessageRecordController()
