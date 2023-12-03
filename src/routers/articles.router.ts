import KoaRouter from '@koa/router'
import articlesController from '../controllers/articles.controller'
import { verifyAuth, verifyPermission } from '../middlewares/auth.middleware'

const articlesRouter = new KoaRouter({ prefix: '/articles' })
const { create, list, getArticleById, illustration, articleCover, removeCover, updateCategory, createTags } = articlesController

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
 *              category_id:
 *                type: number
 *                example: 1
 *              cover_url:
 *                type: string
 *                required: false
 *              is_sticky:
 *                type: number
 *                required: false
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

/**
 * @swagger
 * /articles/illustration/{filename}:
 *  get:
 *    tags: [Articles]
 *    summary: 获取文章配图
 *    parameters:
 *      - in: path
 *        name: filename
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: 返回文章配图
 */
articlesRouter.get('/illustration/:filename', illustration)
/**
 * @swagger
 * /articles/{articleId}/cover:
 *  get:
 *    tags: [Articles]
 *    summary: 获取文章封面
 *    parameters:
 *      - in: path
 *        name: articleId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.get('/:articleId/cover', articleCover)
/**
 * @swagger
 * /articles/{articleId}/cover:
 *  delete:
 *    tags: [Articles]
 *    summary: 删除文章封面
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: articleId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.delete('/:articleId/cover', verifyAuth, verifyPermission('articles'), removeCover)

/**
 * @swagger
 * /articles/{articleId}/category:
 *  patch:
 *    tags: [Articles]
 *    summary: 修改文章分类
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: articleId
 *        required: true
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              categoryId:
 *                type: number
 *                example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.patch('/:articleId/category', verifyAuth, verifyPermission('articles'), updateCategory)

/**
 * @swagger
 * /articles/{articleId}/tags:
 *  post:
 *    tags: [Articles]
 *    summary: 添加文章标签
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: articleId
 *        required: true
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tagIds:
 *                type: array
 *                items:
 *                  type: number
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.post('/:articleId/tags', verifyAuth, verifyPermission('articles'), createTags)

module.exports = articlesRouter
