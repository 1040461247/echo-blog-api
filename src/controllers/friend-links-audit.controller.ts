import { type DefaultContext } from 'koa'
import friendLinksAuditService, { TAuditState } from '../services/friend-links-audit.service'
import { OkPacketParams } from 'mysql2'

// Types
interface ICreateBody {
  linkName: string
  linkUrl: string
  linkIcon: string
  linkDesc: string
}
interface IAuditBody {
  auditState: TAuditState
  id: number
}

class FriendLinksAuditController {
  async create(ctx: DefaultContext) {
    try {
      const { linkName, linkUrl, linkIcon, linkDesc } = ctx.request.body as ICreateBody
      const res = (await friendLinksAuditService.create(linkName, linkUrl, linkIcon, linkDesc)) as OkPacketParams
      ctx.success({ insertId: res.insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async audit(ctx: DefaultContext) {
    try {
      const { auditState, id } = ctx.request.body as IAuditBody
      await friendLinksAuditService.audit(auditState, id)
      ctx.success(null, { msg: auditState === '1' ? '审核通过' : '审核拒绝' })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async passedList(ctx: DefaultContext) {
    try {
      const passedList = await friendLinksAuditService.getPassedList()
      ctx.success(passedList)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FriendLinksAuditController()
