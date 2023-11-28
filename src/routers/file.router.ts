import KoaRouter from 'koa-router'
import fileController from '../controllers/file.controller'
import { verifyAuth } from '../middlewares/auth.middleware'
import { avatarHandler } from '../middlewares/file.middleware'

const fileRouter = new KoaRouter({ prefix: '/upload' })
const { createAvatar } = fileController

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
//@ts-ignore
fileRouter.post('/avatar', verifyAuth, avatarHandler, createAvatar)

module.exports = fileRouter