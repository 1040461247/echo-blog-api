import KoaRouter from '@koa/router'
import categoriesController from '../controllers/categories.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const categoriesRouter = new KoaRouter({ prefix: '/categories' })
const { create, list, remove } = categoriesController

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
 * /categories:
 *  post:
 *    tags: [Categories]
 *    summary: 新建分类
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
categoriesRouter.post('/', verifyAuth, create)
/**
 * @swagger
 * /categories:
 *  get:
 *    tags: [Categories]
 *    summary: 获取分类列表
 *    responses:
 *      200:
 *        description: 返回分类列表
 */
categoriesRouter.get('/', list)
/**
 * @swagger
 * /categories:
 *  delete:
 *    tags: [Categories]
 *    summary: 删除分类
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
categoriesRouter.delete('/', verifyAuth, remove)

module.exports = categoriesRouter
