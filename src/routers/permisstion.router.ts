import KoaRouter from '@koa/router'
import permisstionController from '../controllers/permission.controller'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'

const { getPermissionList, createPermission, updatePermissionById, removePermissionById } =
  permisstionController

const permisstionRouter = new KoaRouter({ prefix: '/permission' })
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
 * /permission/list:
 *  get:
 *    tags: [Permission]
 *    summary: 获取资源列表
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
 *        description: success
 */
permisstionRouter.get('/list', getPermissionList)

/**
 * @swagger
 * /permission:
 *  post:
 *    tags: [Permission]
 *    summary: 新增资源
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mark:
 *                type: string
 *              markName:
 *                type: string
 *              name:
 *                type: string
 *              url:
 *                type: string
 *              action:
 *                type: string
 *              state:
 *                type: string
 *              authentication:
 *                type: string
 *              authorization:
 *                type: string
 *    responses:
 *      200:
 *        description: success
 */
permisstionRouter.post('/', verifyAuthCms, createPermission)

/**
 * @swagger
 * /permission/{permissionId}:
 *  post:
 *    tags: [Permission]
 *    summary: 根据id修改资源
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              mark:
 *                type: string
 *              markName:
 *                type: string
 *              name:
 *                type: string
 *              url:
 *                type: string
 *              action:
 *                type: string
 *              state:
 *                type: string
 *              authentication:
 *                type: string
 *              authorization:
 *                type: string
 *    responses:
 *      200:
 *        description: success
 */
permisstionRouter.post('/:permissionId', verifyAuthCms, updatePermissionById)

/**
 * @swagger
 * /permission/{permissionId}:
 *  delete:
 *    tags: [Permission]
 *    summary: 根据id删除资源
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: success
 */
permisstionRouter.delete('/:permissionId', verifyAuthCms, removePermissionById)

module.exports = permisstionRouter
