import { DefaultContext } from 'koa'
import rolesServices from '../services/roles.services'

class RolesController {
  async getRoleList(ctx: DefaultContext) {
    try {
      const roleList = await rolesServices.getRoleList(ctx.query)
      const rolesTotal = await rolesServices.getRoleTotal(ctx.query)
      ctx.success(roleList, { total: rolesTotal })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async getMenuKeysByRoleId(ctx: DefaultContext) {
    try {
      const { roleId } = ctx.params
      const menuKeys = await rolesServices.getMenuKeysByRoleId(roleId)
      ctx.success(menuKeys)
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updateMenusByRoleId(ctx: DefaultContext) {
    try {
      const { roleId } = ctx.params
      const { menuKeys } = ctx.request.body
      await rolesServices.removeMenusByRoleId(roleId)
      menuKeys.length > 0 && (await rolesServices.updateMenusByRoleId(roleId, menuKeys))
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new RolesController()
