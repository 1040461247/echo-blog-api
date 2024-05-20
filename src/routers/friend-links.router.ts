import KoaRouter from '@koa/router'
import friendLinksController from '../controllers/friend-links.controller'
import { verifyAuth } from '../middlewares/auth.middleware'
import { BASE_PATH } from '.'

const friendLinksRouter = new KoaRouter({ prefix: `${BASE_PATH}/friend-links` })
const { createFriendAudit, approveFriendAudit, getFriendList } = friendLinksController

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
 * /friend-links/list:
 *  get:
 *    tags: [FriendLinks]
 *    summary: 获取友链列表
 *    parameters:
 *      - in: query
 *        name: auditState
 *        schema:
 *          type: string
 *          example: all
 *      - in: query
 *        name: current
 *        schema:
 *          type: string
 *          example: all
 *      - in: query
 *        name: pageSize
 *        schema:
 *          type: string
 *          example: all
 *    responses:
 *      200:
 *        description: success
 */
friendLinksRouter.get('/list', getFriendList)

/**
 * @swagger
 * /friend-links:
 *  post:
 *    tags: [FriendLinksAudit]
 *    summary: 提交审核
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              linkName:
 *                type: string
 *                example: Echo Blog
 *              linkUrl:
 *                type: string
 *                example: http://localhost:3000
 *              linkIcon:
 *                type: string
 *                example: http://localhost:3000/images/main-header/logo.svg
 *              linkDesc:
 *                type: string
 *                example: 欢迎来到我的思维广场
 *    responses:
 *      200:
 *        description: success
 */
friendLinksRouter.post('/', createFriendAudit)

/**
 * @swagger
 * /friend-links/audit:
 *  post:
 *    tags: [FriendLinksAudit]
 *    summary: 审核友链申请
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              auditState:
 *                type: string
 *                example: 1
 *              id:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: success
 */
friendLinksRouter.post('/audit', verifyAuth, approveFriendAudit)

module.exports = friendLinksRouter
