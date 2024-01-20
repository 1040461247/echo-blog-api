import { type DefaultContext } from 'koa'
import friendLinksAuditService from '../services/friend-links-audit.service'
import { OkPacketParams } from 'mysql2'

// Types
export interface ICreateBody {
  linkName: string
  linkUrl: string
  linkIcon: string
  linkDesc: string
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
}

export default new FriendLinksAuditController()
