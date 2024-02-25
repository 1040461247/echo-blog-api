import { DefaultContext } from 'koa'
import { getReqIp } from '../utils/get-user-system-info'
import pageviewsService from '../services/pageviews.service'
import { OkPacketParams, RowDataPacket } from 'mysql2'

class PageviewsController {
  async getPv(ctx: DefaultContext) {
    try {
      const { pageUrl } = ctx.query
      const res = pageUrl
        ? ((await pageviewsService.getPvByPageUrl(pageUrl)) as RowDataPacket[])[0]
        : ((await pageviewsService.getPv()) as RowDataPacket[])[0]
      ctx.success(res)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getUv(ctx: DefaultContext) {
    try {
      const res = (await pageviewsService.getUv()) as RowDataPacket[]
      const uvCount = res.reduce((preVal, curVal) => preVal + curVal.uvCount, 0)
      ctx.success({ uvCount })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createPv(ctx: DefaultContext) {
    try {
      const ipAddress = getReqIp(ctx)
      const { pageUrl } = ctx.request.body
      const { insertId } = (await pageviewsService.createPv(ipAddress, pageUrl)) as OkPacketParams
      ctx.success({ insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new PageviewsController()
