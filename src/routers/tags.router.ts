import KoaRouter from '@koa/router'
import tagsController from '../controllers/tags.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const tagsRouter = new KoaRouter({ prefix: '/tags' })
const { createTag, getTagList, removeTag, getTagById, getArticlesByTagId } = tagsController

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
 *  get:
 *    tags: [Tags]
 *    summary: 获取标签列表
 *    responses:
 *      200:
 *        description: 返回标签列表
 */
tagsRouter.get('/', getTagList)

/**
 * @swagger
 * /tags/{tagId}:
 *  get:
 *    tags: [Tags]
 *    summary: 根据id获取标签信息
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
tagsRouter.get('/:tagId', getTagById)

/**
 * @swagger
 * /tags/{tagId}/articles:
 *  get:
 *    tags: [Tags]
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
tagsRouter.get('/:tagId/articles', getArticlesByTagId)

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
tagsRouter.post('/', verifyAuth, createTag)

/**
 * @swagger
 * /tags/{tagId}:
 *  delete:
 *    tags: [Tags]
 *    summary: 删除标签
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: tagId
 *        required: true
 *        example: 2
 *    responses:
 *      200:
 *        description: success
 */
tagsRouter.delete('/:tagId', verifyAuth, removeTag)

module.exports = tagsRouter
