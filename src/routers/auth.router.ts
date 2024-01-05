import KoaRouter from '@koa/router'
import authController from '../controllers/auth.controller'
import { verifyAccount, verifyAuth, verifyPhone } from '../middlewares/auth.middleware'
import { updateUserSystemInfo } from '../middlewares/users.middleware'

const authRouter = new KoaRouter()
const { login, success, sendOpt } = authController

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
 *               browser_info:
 *                 type: string
 *                 example: Chrome 10
 *               os_info:
 *                 type: string
 *                 example: Windows 11
 *               ip_address:
 *                 type: string
 *                 example: 云南
 *     responses:
 *      200:
 *        description: 登录成功
 */
authRouter.post('/login', verifyAccount, updateUserSystemInfo, login)
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
/**
 * @swagger
 * /send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: 发送验证码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 18669275339
 *     responses:
 *      200:
 *        description: 发送成功
 */
authRouter.post('/send-otp', verifyPhone, sendOpt)

module.exports = authRouter
