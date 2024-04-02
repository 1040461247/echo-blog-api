import KoaRouter from '@koa/router'
import articlesController from '../controllers/articles.controller'
import { verifyPermission } from '../middlewares/auth.middleware'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'

const articlesRouter = new KoaRouter({ prefix: '/articles' })

const {
  getArticleList,
  getArticleListQuery,
  getArticleListByTagId,
  getArticleListByCateId,
  getArticleById,
  getArticleCover,
  getIllustration,
  saveArticle,
  updateArticleById,
  removeArticleById,
} = articlesController

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
articlesRouter.get('/', getArticleList)

/**
 * @swagger
 * /articles/all-status:
 *   get:
 *    tags: [Articles]
 *    summary: 获取所有状态的文章列表
 *    parameters:
 *      - in: query
 *        name: current
 *        schema:
 *          type: integer
 *          example: 1
 *      - in: query
 *        name: pageSize
 *        schema:
 *          type: integer
 *          example: 10
 *    responses:
 *      200:
 *        description: 获取成功
 */
articlesRouter.get('/query', getArticleListQuery)

/**
 * @swagger
 * /articles/{categoryId}:
 *  get:
 *    tags: [Articles]
 *    summary: 根据categoryId获取相关文章列表
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.get('/category/:categoryId', getArticleListByCateId)

/**
 * @swagger
 * /articles/{tagId}:
 *  get:
 *    tags: [Articles]
 *    summary: 根据tagId获取相关文章列表
 *    parameters:
 *      - in: path
 *        name: tagId
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.get('/tag/:tagId', getArticleListByTagId)

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
articlesRouter.get('/:articleId/cover', getArticleCover)

/**
 * @swagger
 * /articles/illustration/{filename}:
 *  get:
 *    tags: [Articles]
 *    summary: 获取指定的文章配图
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
articlesRouter.get('/illustration/:filename', getIllustration)

/**
 * @swagger
 * /articles/save:
 *  post:
 *    tags: [Articles]
 *    summary: 保存编辑中的文章
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *              title:
 *                type: string
 *                example: JavaScript从入门到放弃
 *              content:
 *                type: string
 *                example: hello world
 *              description:
 *                type: string
 *                example: article`s descripbe
 *              categoryId:
 *                type: number
 *                example: 1
 *              tags:
 *                type: array
 *                items:
 *                  type: number
 *              isSticky:
 *                type: number
 *                example: 0
 *              state:
 *                type: number
 *                example: 0
 *              visibility:
 *                type: number
 *                example: 0
 *              mark:
 *                type: string
 *                example: 123
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.post('/save', verifyAuthCms, saveArticle)

/**
 * @swagger
 * /articles/{articleId}:
 *  patch:
 *    tags: [Articles]
 *    summary: 更新文章
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
 *              title:
 *                type: string
 *                example: JavaScript高级程序设计
 *              content:
 *                type: string
 *                example: content example
 *              description:
 *                type: string
 *                example: description example
 *              categoryId:
 *                type: string
 *                example: 1
 *              isSticky:
 *                type: string
 *                example: '0'
 *              state:
 *                type: string
 *                example: '0'
 *              visibility:
 *                type: string
 *                example: '0'
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.patch('/:articleId', verifyAuthCms, verifyPermission('articles'), updateArticleById)

/**
 * @swagger
 * /articles/{articleId}:
 *  delete:
 *    tags: [Articles]
 *    summary: 根据id删除文章
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: articleId
 *        required: true
 *        example: 1
 *    responses:
 *      200:
 *        description: success
 */
articlesRouter.delete('/:articleId', verifyAuthCms, verifyPermission('articles'), removeArticleById)

module.exports = articlesRouter
