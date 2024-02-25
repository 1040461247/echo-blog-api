import { DefaultContext } from 'koa'
import menuService from '../services/menu.service'

class MenuController {
  async getMenuListByUserId(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params
      const menus = await menuService.getMenuListByUserId(userId)
      ctx.success(menus)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MenuController()
