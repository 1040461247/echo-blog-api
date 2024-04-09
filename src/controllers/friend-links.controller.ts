import { type DefaultContext } from 'koa'
import friendLinksService from '../services/friend-links.service'
import { OkPacketParams } from 'mysql2'

class FriendLinksController {
  async getFriendList(ctx: DefaultContext) {
    try {
      const res = await friendLinksService.getFriendList(ctx.query)
      ctx.success(res)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createFriendAudit(ctx: DefaultContext) {
    try {
      const { linkName, linkUrl, linkIcon, linkDesc } = ctx.request.body
      const res = (await friendLinksService.createFriendAudit(
        linkName,
        linkUrl,
        linkIcon,
        linkDesc,
      )) as OkPacketParams
      ctx.success({ insertId: res.insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async approveFriendAudit(ctx: DefaultContext) {
    try {
      const { auditState, id } = ctx.request.body
      await friendLinksService.approveFriendAudit(auditState, id)
      ctx.success(null, { msg: auditState === '1' ? '审核通过' : '审核拒绝' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FriendLinksController()
