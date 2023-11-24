import KoaRouter from '@koa/router'
import articlesCommentsController from '../controllers/articles-comments.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const ArticlesCommentsRouter = new KoaRouter({ prefix: '/articles-comments' })
const { create, reply } = articlesCommentsController

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
 * /articles-comments:
 *  post:
 *    tags: [Articles Comments]
 *    summary: 评论文章
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                example: php是世界上最好的语言
 *              article_id:
 *                type: number
 *                example: 1
 *              user_id:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: 评论成功
 */
ArticlesCommentsRouter.post('/', verifyAuth, create)
/**
 * @swagger
 * /articles-comments/{commentId}/reply:
 *  post:
 *    tags: [Articles Comments]
 *    summary: 回复评论
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: commentId
 *        required: true
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                example: php是世界上最好的语言
 *              article_id:
 *                type: number
 *                example: 1
 *              user_id:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: 回复成功
 */
ArticlesCommentsRouter.post('/:commentId/reply', verifyAuth, reply)

module.exports = ArticlesCommentsRouter
