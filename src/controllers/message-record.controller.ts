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
}
interface IUnreadCountParams extends IListParams {}

class MessageRecordController {
  async list(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IListParams
      const { state } = ctx.query as IListQuery

      let resList
      if (state) {
        resList = await messageRecordService.getListByState(userId, state)
      } else {
        resList = await messageRecordService.getList(userId)
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
