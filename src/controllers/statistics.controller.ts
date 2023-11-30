import type { DefaultContext } from "koa";
import statisticsService from '../services/statistics.service'

class StatisticsController {
  async total(ctx: DefaultContext) {
    const res = await statisticsService.getTotal()
    ctx.success(res)
  }
}

export default new StatisticsController()
