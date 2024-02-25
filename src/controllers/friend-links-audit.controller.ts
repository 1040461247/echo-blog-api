import { type DefaultContext } from 'koa'
import friendLinksAuditService, { TAuditState } from '../services/friend-links-audit.service'
import { OkPacketParams } from 'mysql2'

class FriendLinksAuditController {
  async getPassedFriendList(ctx: DefaultContext) {
    try {
      const passedList = await friendLinksAuditService.getPassedFriendList()
      ctx.success(passedList)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createFriendAudit(ctx: DefaultContext) {
    try {
      const { linkName, linkUrl, linkIcon, linkDesc } = ctx.request.body
      const res = (await friendLinksAuditService.createFriendAudit(
        linkName,
        linkUrl,
        linkIcon,
        linkDesc
      )) as OkPacketParams
      ctx.success({ insertId: res.insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async approveFriendAudit(ctx: DefaultContext) {
    try {
      const { auditState, id } = ctx.request.body
      await friendLinksAuditService.approveFriendAudit(auditState, id)
      ctx.success(null, { msg: auditState === '1' ? '审核通过' : '审核拒绝' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FriendLinksAuditController()
