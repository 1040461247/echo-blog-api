import KoaRouter from '@koa/router'
import tagsController from '../controllers/tags.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const tagsRouter = new KoaRouter({ prefix: '/tags' })
const { create, list, remove } = tagsController

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
 * /tags:
 *  post:
 *    tags: [Tags]
 *    summary: 新建标签
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tag:
 *                type: string
 *                example: JavaScript
 *    responses:
 *      200:
 *        description: 新建成功
 */
tagsRouter.post('/', verifyAuth, create)

/**
 * @swagger
 * /tags:
 *  get:
 *    tags: [Tags]
 *    summary: 获取标签列表
 *    responses:
 *      200:
 *        description: 返回标签列表
 */
tagsRouter.get('/', list)

/**
 * @swagger
 * /tags:
 *  delete:
 *    tags: [Tags]
 *    summary: 删除标签
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tag:
 *                type: string
 *                example: JavaScript
 *    responses:
 *      200:
 *        description: 删除成功
 */
tagsRouter.delete('/', verifyAuth, remove)

module.exports = tagsRouter
