import KoaRouter from '@koa/router'
import messageRecordController from '../controllers/message-record.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const messageRecordRouter = new KoaRouter({ prefix: '/message-record' })
const { list, clearUnread, unreadCount } = messageRecordController

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
 * /message-record/{userId}:
 *  get:
 *    tags: [MessageRecord]
 *    summary: 根据id获取用户消息列表
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
messageRecordRouter.get('/:userId', list)
/**
 * @swagger
 * /message-record/{userId}/unread/:
 *  get:
 *    tags: [MessageRecord]
 *    summary: 根据id获取用户未读消息数量
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
messageRecordRouter.get('/:userId/unread', unreadCount)
/**
 * @swagger
 * /message-record:
 *  post:
 *    tags: [MessageRecord]
 *    summary: 清空未读消息
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: success
 */
messageRecordRouter.post('/', verifyAuth, clearUnread)

module.exports = messageRecordRouter
