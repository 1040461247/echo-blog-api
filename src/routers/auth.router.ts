import KoaRouter from '@koa/router'
import authController from '../controllers/auth.controller'
import { verifyAccount, verifyAuth } from '../middlewares/auth.middleware'

const authRouter = new KoaRouter()
const { login, success } = authController

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
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *      200:
 *        description: 登录成功
 */
authRouter.post('/login', verifyAccount, login)
/**
 * @swagger
 * /authorized:
 *   get:
 *     tags: [Auth]
 *     summary: 用户鉴权
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: 鉴权通过
 */
authRouter.get('/authorized', verifyAuth, success)

module.exports = authRouter
