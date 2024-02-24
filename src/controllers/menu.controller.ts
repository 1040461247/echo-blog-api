import { DefaultContext } from 'koa'
import menuService from '../services/menu.service'

// Types
interface IGetMenusByUserId {
  userId: number
}

class MenuController {
  async getMenusByUserId(ctx: DefaultContext) {
    try {
      const { userId } = ctx.params as IGetMenusByUserId
      const menus = await menuService.getMenusByUserId(userId)
      ctx.success(menus)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MenuController()
