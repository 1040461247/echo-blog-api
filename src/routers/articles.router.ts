import KoaRouter from '@koa/router'
import articlesController from '../controllers/articles.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const articlesRouter = new KoaRouter({ prefix: '/articles' })
const { create, list, getArticleById } = articlesController

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
 * /articles:
 *  post:
 *    tags: [Articles]
 *    summary: 新建文章
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                example: JavaScript从入门到放弃
 *              content:
 *                type: string
 *                example: hello world
 *    responses:
 *      200:
 *        description: 新建成功
 */
articlesRouter.post('/', verifyAuth, create)
/**
 * @swagger
 * /articles:
 *   get:
 *    tags: [Articles]
 *    summary: 获取文章列表
 *    parameters:
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *          example: 0
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 10
 *    responses:
 *      200:
 *        description: 获取成功
 */
articlesRouter.get('/', list)
/**
 * @swagger
 * /articles/{articleId}:
 *  get:
 *    tags: [Articles]
 *    summary: 根据id获取文章
 *    parameters:
 *      - in: path
 *        name: articleId
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: 返回id对应文章
 */
articlesRouter.get('/:articleId', getArticleById)

module.exports = articlesRouter
