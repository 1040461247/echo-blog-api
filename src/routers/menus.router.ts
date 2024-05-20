import KoaRouter from '@koa/router'
import menuController from '../controllers/menus.controller'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'
import { BASE_PATH } from '.'

const { getMenuList, updateMenuById, removeMenuById } = menuController

const menuRouter = new KoaRouter({ prefix: `${BASE_PATH}/menus` })

/**
 * @swagger
 * /menu:
 *  get:
 *    tags: [Menu]
 *    summary: 获取菜单列表
 *    parameters:
 *      - in: query
 *        name: pid
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
menuRouter.get('/', getMenuList)

/**
 * @swagger
 * /menus/{menuId}:
 *  patch:
 *    tags: [Menus]
 *    summary: 根据id修改菜单
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              path:
 *                type: string
 *              type:
 *                type: string
 *              permission:
 *                type: string
 *              sort:
 *                type: number
 *              hidden:
 *                type: number
 *
 *    responses:
 *      200:
 *        description: success
 */
menuRouter.patch('/:menuId', verifyAuthCms, updateMenuById)

/**
 * @swagger
 * /menus/{menuId}:
 *  delete:
 *    tags: [Menus]
 *    summary: 删除菜单
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: menuId
 *        required: true
 *        example: 2
 *    responses:
 *      200:
 *        description: success
 */
menuRouter.delete('/:menuId', verifyAuthCms, removeMenuById)

module.exports = menuRouter
