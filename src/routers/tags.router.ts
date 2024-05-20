import KoaRouter from '@koa/router'
import tagsController from '../controllers/tags.controller'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'
import { checkForTagExists } from '../middlewares/tags.middleware'
import { BASE_PATH } from '.'

const tagsRouter = new KoaRouter({ prefix: `${BASE_PATH}/tags` })
const { createTag, getTagList, getTagListQuery, removeTag, getTagById, updateTagById } =
  tagsController

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
 * /tags/query:
 *  get:
 *    tags: [Tags]
 *    summary: 根据查询条件获取标签列表
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
 *        description: 返回分类列表
 */
tagsRouter.get('/query', getTagListQuery)

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
tagsRouter.post('/', verifyAuthCms, checkForTagExists, createTag)

/**
 * @swagger
 * /tags/{tagId}:
 *  patch:
 *    tags: [Tags]
 *    summary: 根据id修改标签名称
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tag:
 *                type: string
 *                example: JavaScript高级程序设计
 *    responses:
 *      200:
 *        description: success
 */
tagsRouter.patch('/:tagId', verifyAuthCms, checkForTagExists, updateTagById)

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
tagsRouter.delete('/:tagId', verifyAuthCms, removeTag)

module.exports = tagsRouter
