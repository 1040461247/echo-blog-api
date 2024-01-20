import KoaRouter from '@koa/router'
import friendLinksAuditController from '../controllers/friend-links-audit.controller'

const friendLinksAuditRouter = new KoaRouter({ prefix: '/friend-links-audit' })
const { create, audit } = friendLinksAuditController

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
friendLinksAuditRouter.post('/', audit)

module.exports = friendLinksAuditRouter
