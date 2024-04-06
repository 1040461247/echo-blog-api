import { DefaultContext } from 'koa'
import permisstionService, {
  ICreatePermissionOption,
  IUpdatePermissionOption,
} from '../services/permisstion.service'
import boolToStrMark from '../utils/boolToStrMark'

class PermissionController {
  async getPermissionList(ctx: DefaultContext) {
    try {
      const queryRes = (await permisstionService.getPermissionList(ctx.query)) as any[]
      const permisstionsTotal = await permisstionService.getPermissionsTotal(ctx.query)
      ctx.success(queryRes, { total: permisstionsTotal })
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async createPermission(ctx: DefaultContext) {
    try {
      // 将boolean类型的值转化为'0'|'1'
      const boolFields = ['state', 'authorization', 'authentication']
      const createOption = boolToStrMark(boolFields, ctx.request.body) as ICreatePermissionOption
      await permisstionService.createPermission(createOption)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async updatePermissionById(ctx: DefaultContext) {
    try {
      // 将boolean类型的值转化为'0'|'1'
      const boolFields = ['state', 'authorization', 'authentication']
      const updateOption = boolToStrMark(boolFields, ctx.request.body) as IUpdatePermissionOption
      const { permissionId } = ctx.params
      await permisstionService.updatePermissionById(permissionId, updateOption)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }

  async removePermissionById(ctx: DefaultContext) {
    try {
      const { permissionId } = ctx.params
      await permisstionService.removePermissionById(permissionId)
      ctx.success()
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new PermissionController()
