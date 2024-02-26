import KoaRouter from '@koa/router'
import articlesCommentsController from '../controllers/articles-comments.controller'
import { verifyAuth, verifyPermission } from '../middlewares/auth.middleware'
import {
  recordMessageOfComment,
  recordMessageOfLikeComment,
  recordMessageOfReply,
} from '../middlewares/message-record.middleware'

const ArticlesCommentsRouter = new KoaRouter({ prefix: '/articles-comments' })
const {
  createComment,
  createReply,
  updateComment,
  removeComment,
  getCommentsByAtcId,
  createLikes,
  removeLikes,
  getLikesCountByCmtId,
  getLikesByUserId,
} = articlesCommentsController

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
 *  get:
 *    tags: [Articles Comments]
 *    summary: 根据文章id获取评论
 *    parameters:
 *      - in: query
 *        name: articleId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: 获取成功
 */
ArticlesCommentsRouter.get('/', getCommentsByAtcId)

/**
 * @swagger
 * /articles-comments/likes/{commentId}:
 *  get:
 *    tags: [Articles Comments]
 *    summary: 根据评论id获取点赞数
 *    parameters:
 *      - in: path
 *        name: commentId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: 获取成功
 */
ArticlesCommentsRouter.get('/likes/:commentId', getLikesCountByCmtId)

/**
 * @swagger
 * /articles-comments/{userId}/likes:
 *  get:
 *    tags: [Articles Comments]
 *    summary: 根据用户id获取点赞过的评论列表
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: 获取成功
 */
ArticlesCommentsRouter.get('/:userId/likes', getLikesByUserId)

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
 *              articleId:
 *                type: number
 *                example: 1
 *              userId:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: 评论成功
 */
ArticlesCommentsRouter.post('/', verifyAuth, recordMessageOfComment, createComment)

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
 *              articleId:
 *                type: number
 *                example: 1
 *              userId:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: 回复成功
 */
ArticlesCommentsRouter.post('/:commentId/reply', verifyAuth, recordMessageOfReply, createReply)

/**
 * @swagger
 * /articles-comments/likes:
 *  post:
 *    tags: [Articles Comments]
 *    summary: 点赞评论
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              commentId:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: 点赞成功
 */
ArticlesCommentsRouter.post('/likes', verifyAuth, recordMessageOfLikeComment, createLikes)

/**
 * @swagger
 * /articles-comments/{commentId}:
 *  patch:
 *    tags: [Articles Comments]
 *    summary: 修改评论
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
 *    responses:
 *      200:
 *        description: 修改成功
 */
ArticlesCommentsRouter.patch(
  '/:commentId',
  verifyAuth,
  verifyPermission('articles_comments'),
  updateComment,
)

/**
 * @swagger
 * /articles-comments/{commentId}:
 *  delete:
 *    tags: [Articles Comments]
 *    summary: 删除评论
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: commentId
 *        required: true
 *    responses:
 *      200:
 *        description: 删除成功
 */
ArticlesCommentsRouter.delete(
  '/:commentId',
  verifyAuth,
  verifyPermission('articles_comments'),
  removeComment,
)

/**
 * @swagger
 * /articles-comments/likes/{commentId}:
 *  delete:
 *    tags: [Articles Comments]
 *    summary: 取消点赞
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: commentId
 *        required: true
 *    responses:
 *      200:
 *        description: 删除成功
 */
ArticlesCommentsRouter.delete(
  '/likes/:commentId',
  verifyAuth,
  verifyPermission('comment_likes', 'comment_id'),
  removeLikes,
)

module.exports = ArticlesCommentsRouter
