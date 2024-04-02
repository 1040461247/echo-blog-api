import KoaRouter from '@koa/router'
import categoriesController from '../controllers/categories.controller'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'
import { checkForCategoryExists } from '../middlewares/categories.middleware'

const categoriesRouter = new KoaRouter({ prefix: '/categories' })
const {
  createCategory,
  getCategoryList,
  getCategoryListQuery,
  removeCategoryById,
  getCategoryById,
  updateCategoryById,
} = categoriesController

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
 *    parameters:
 *      - in: query
 *        name: isAllAtcCount
 *        schema:
 *          type: boolean
 *          example: true
 *    responses:
 *      200:
 *        description: 返回分类列表
 */
categoriesRouter.get('/', getCategoryList)

/**
 * @swagger
 * /categories/query:
 *  get:
 *    tags: [Categories]
 *    summary: 根据查询条件获取分类列表
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
categoriesRouter.get('/query', getCategoryListQuery)

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
categoriesRouter.post('/', verifyAuthCms, checkForCategoryExists, createCategory)

/**
 * @swagger
 * /categories/{categoryId}:
 *  patch:
 *    tags: [Categories]
 *    summary: 根据id修改分类名称
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
 *              category:
 *                type: string
 *                example: JavaScript高级程序设计
 *    responses:
 *      200:
 *        description: success
 */
categoriesRouter.patch('/:categoryId', verifyAuthCms, checkForCategoryExists, updateCategoryById)

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
categoriesRouter.delete('/:categoryId', verifyAuthCms, removeCategoryById)

module.exports = categoriesRouter
