import KoaRouter from '@koa/router'
import fileController from '../controllers/file.controller'
import { verifyAuth } from '../middlewares/auth.middleware'
import {
  avatarHandler,
  illustrationHandler,
  coverHandler,
  illustrationOffsiteHandler,
} from '../middlewares/file.middleware'
import { verifyAuthCms } from '../middlewares/cms-auth.middleware'
import { BASE_PATH } from '.'

const fileRouter = new KoaRouter({ prefix: `${BASE_PATH}/upload` })
const {
  createAvatar,
  createIllustration,
  createIllustrationOffsite,
  createCover,
  removeArticleCover,
} = fileController

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
 * /upload/avatar:
 *  post:
 *    tags: [Upload]
 *    summary: 上传头像
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            properties:
 *              avatar:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *    responses:
 *      200:
 *        description: 上传成功
 */
fileRouter.post('/avatar', verifyAuth, avatarHandler, createAvatar)

/**
 * @swagger
 * /upload/illustration:
 *  post:
 *    tags: [Upload]
 *    summary: 上传文章配图
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: articleId
 *        schema:
 *          type: number
 *          example: 1
 *      - in: query
 *        name: mark
 *        schema:
 *          type: number
 *          example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            properties:
 *              illustration:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *    responses:
 *      200:
 *        description: 上传成功
 */
fileRouter.post('/illustration', verifyAuthCms, illustrationHandler, createIllustration)

/**
 * @swagger
 * /upload/illustration/offsite:
 *  post:
 *    tags: [Upload]
 *    summary: 根据站外图片的url上传文章配图
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: articleId
 *        schema:
 *          type: number
 *          example: 1
 *      - in: query
 *        name: mark
 *        schema:
 *          type: number
 *          example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              url:
 *                type: string
 *                example: http://localhost:8000/xxx.img
 *    responses:
 *      200:
 *        description: 上传成功
 */
fileRouter.post(
  '/illustration/offsite',
  verifyAuthCms,
  illustrationOffsiteHandler,
  createIllustrationOffsite,
)

/**
 * @swagger
 * /upload/{articleId}/cover:
 *  post:
 *    tags: [Upload]
 *    summary: 上传文章封面
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
 *        multipart/form-data:
 *          schema:
 *            properties:
 *              cover:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *    responses:
 *      200:
 *        description: success
 */
fileRouter.post('/:articleId/cover', verifyAuthCms, coverHandler, createCover)

/**
 * @swagger
 * /articles/{articleId}/cover:
 *  delete:
 *    tags: [Upload]
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
fileRouter.delete('/:articleId/cover', verifyAuth, removeArticleCover)

module.exports = fileRouter
