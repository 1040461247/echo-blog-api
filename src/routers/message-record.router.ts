import KoaRouter from '@koa/router'
import messageRecordController from '../controllers/message-record.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const messageRecordRouter = new KoaRouter({ prefix: '/message-record' })
const { list, clearUnread, total } = messageRecordController

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
 *      - in: query
 *        name: state
 *        schema:
 *          type: string
 *          example: 0
 *      - in: query
 *        name: offset
 *        schema:
 *          type: number
 *          example: 0
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *          example: 10
 *    responses:
 *      200:
 *        description: success
 */
messageRecordRouter.get('/:userId', list)
/**
 * @swagger
 * /message-record/{userId}/total/:
 *  get:
 *    tags: [MessageRecord]
 *    summary: 根据id获取用户消息数量
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
messageRecordRouter.get('/:userId/total', total)
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
