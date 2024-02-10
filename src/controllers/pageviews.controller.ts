import { DefaultContext } from 'koa'
import { getReqIp } from '../utils/get-user-system-info'
import pageviewsService from '../services/pageviews.service'
import { OkPacketParams, RowDataPacket } from 'mysql2'

// Types
interface ICreateBody {
  pageUrl: string
}
interface IGetPvQuery {
  pageUrl: string
}

class PageviewsController {
  async create(ctx: DefaultContext) {
    try {
      const ipAddress = getReqIp(ctx)
      const { pageUrl } = ctx.request.body as ICreateBody
      const { insertId } = (await pageviewsService.create(ipAddress, pageUrl)) as OkPacketParams
      ctx.success({ insertId })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getPv(ctx: DefaultContext) {
    try {
      const { pageUrl } = ctx.query as IGetPvQuery
      let res
      if (pageUrl) {
        res = ((await pageviewsService.getPvByPageUrl(pageUrl)) as RowDataPacket[])[0]
      } else {
        res = ((await pageviewsService.getPv()) as RowDataPacket[])[0]
      }
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
}

export default new PageviewsController()
