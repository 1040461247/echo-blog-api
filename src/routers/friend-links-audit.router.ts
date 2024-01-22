import KoaRouter from '@koa/router'
import friendLinksAuditController from '../controllers/friend-links-audit.controller'
import { verifyAuth } from '../middlewares/auth.middleware'
import { verifyAdmin } from '../middlewares/friend-links.middleware'

const friendLinksAuditRouter = new KoaRouter({ prefix: '/friend-links-audit' })
const { create, audit, passedList } = friendLinksAuditController

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
 * /friend-links-audit:
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
friendLinksAuditRouter.post('/', create)
/**
 * @swagger
 * /friend-links-audit/audit:
 *  post:
 *    tags: [FriendLinksAudit]
 *    summary: 审核
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
friendLinksAuditRouter.post('/audit', verifyAuth, verifyAdmin, audit)
/**
 * @swagger
 * /friend-links-audit/passed:
 *  get:
 *    tags: [FriendLinksAudit]
 *    summary: 获取审批通过的列表
 *    responses:
 *      200:
 *        description: success
 */
friendLinksAuditRouter.get('/passed', passedList)

module.exports = friendLinksAuditRouter