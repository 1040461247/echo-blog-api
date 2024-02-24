import KoaRouter from '@koa/router'
import menuController from '../controllers/menu.controller'

const menuRouter = new KoaRouter({ prefix: '/menu' })
const { getMenusByUserId } = menuController

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * /menu/{userId}:
 *  get:
 *    tags: [Menu]
 *    summary: 根据用户id获取用户菜单权限
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
menuRouter.get('/:userId', getMenusByUserId)

module.exports = menuRouter
