import type { DefaultContext } from "koa";
import statisticsService from '../services/statistics.service'

// Types
interface ITotal {
  articlesCount: number
  tagsCount: number
  categories: number
}

class StatisticsController {
  async total(ctx: DefaultContext) {
    const resourceList = ['articles', 'tags', 'categories']
    const res = await statisticsService.getTotal(resourceList) as ITotal
    ctx.success(res)
  }
}

export default new StatisticsController()
