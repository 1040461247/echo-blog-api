import KoaRouter from '@koa/router'
import rolesController from '../controllers/roles.controller'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'

const rolesRouter = new KoaRouter({ prefix: '/roles' })
const { getRoleList, getMenuKeysByRoleId, updateMenusByRoleId } = rolesController

/**
 * @swagger
 * /roles:
 *  get:
 *    tags: [Roles]
 *    summary: 获取角色列表
 *    parameters:
 *      - in: query
 *        name:
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: success
 */
rolesRouter.get('/', getRoleList)

/**
 * @swagger
 * /roles/{roleId}:
 *  get:
 *    tags: [Roles]
 *    summary: 根据角色ID获取菜单id列表
 *    responses:
 *      200:
 *        description: success
 */
rolesRouter.get('/:roleId', getMenuKeysByRoleId)

/**
 * @swagger
 * /roles:
 *  post:
 *    tags: [Roles]
 *    summary: 根据角色id更新角色菜单
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menuKeys:
 *                type: string[]
 *    responses:
 *      200:
 *        description: success
 */
rolesRouter.post('/:roleId', verifyAuthCms, updateMenusByRoleId)

module.exports = rolesRouter
