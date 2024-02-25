import KoaRouter from '@koa/router'
import authController from '../controllers/auth.controller'
import { sendOtp, verifyAccount, verifyAuth, verifyOtp, verifyPhone } from '../middlewares/auth.middleware'
import { updateUserSystemInfo } from '../middlewares/users.middleware'

const authRouter = new KoaRouter()
const { loginByAccount, validated, sendedOtp, loginByPhone, logout } = authController

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
authRouter.get('/authorized', verifyAuth, updateUserSystemInfo, validated)

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
authRouter.post('/login', verifyAccount, updateUserSystemInfo, loginByAccount)

/**
 * @swagger
 * /login-phone:
 *   post:
 *     tags: [Auth]
 *     summary: 验证码登陆
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
 *               otp:
 *                 type: string
 *                 exammple: 1234
 *     responses:
 *      200:
 *        description: 发送成功
 */
authRouter.post('/login-phone', verifyOtp, loginByPhone)

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
authRouter.post('/send-otp', verifyPhone, sendOtp, sendedOtp)

/**
 * @swagger
 * /logout:
 *  post:
 *    tags: [Auth]
 *    summary: 用户登出
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: success
 */
authRouter.post('/logout', verifyAuth, logout)

module.exports = authRouter
