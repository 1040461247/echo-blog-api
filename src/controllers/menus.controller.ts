import { DefaultContext } from 'koa'
import menuService, { IGetMenuListOpt } from '../services/menus.service'
import objectFilter from '../utils/object-filter'

class MenuController {
  async getMenuList(ctx: DefaultContext) {
    try {
      const { topMenu } = ctx.query
      const searchOpt = objectFilter(ctx.query, ['topMenu']) as IGetMenuListOpt
      const isTopMenu = topMenu === 'true' ? true : false
      const res = await menuService.getMenuList(searchOpt, isTopMenu)
      ctx.success(res)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateMenuById(ctx: DefaultContext) {
    try {
      const { menuId } = ctx.params
      await menuService.updateMenuById(menuId, ctx.request.body)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removeMenuById(ctx: DefaultContext) {
    try {
      const { menuId } = ctx.params
      await menuService.removeMenuById(menuId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new MenuController()
