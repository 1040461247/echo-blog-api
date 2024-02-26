import KoaRouter from '@koa/router'
import categoriesController from '../controllers/categories.controller'
import { verifyAuth } from '../middlewares/auth.middleware'

const categoriesRouter = new KoaRouter({ prefix: '/categories' })
const { createCategory, getCategoryList, removeCategory, getCategoryById } = categoriesController

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
 *  get:
 *    tags: [Categories]
 *    summary: 获取分类列表
 *    responses:
 *      200:
 *        description: 返回分类列表
 */
categoriesRouter.get('/', getCategoryList)

/**
 * @swagger
 * /categories/{categoryId}:
 *  get:
 *    tags: [Categories]
 *    summary: 根据id获取分类信息
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
categoriesRouter.get('/:categoryId', getCategoryById)

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
 *              category:
 *                type: string
 *                example: JavaScript
 *    responses:
 *      200:
 *        description: 新建成功
 */
categoriesRouter.post('/', verifyAuth, createCategory)

/**
 * @swagger
 * /categories/{categoryId}:
 *  delete:
 *    tags: [Categories]
 *    summary: 删除分类
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        required: true
 *        example: 2
 *    responses:
 *      200:
 *        description: success
 */
categoriesRouter.delete('/:categoryId', verifyAuth, removeCategory)

module.exports = categoriesRouter
