import KoaRouter from '@koa/router'
import cmsAuthController from '../controllers/cms-auth.controller'
import { verifyAccount } from '../middlewares/auth.middleware'
import { updateUserSystemInfo, updateUserLoginTime } from '../middlewares/users.middleware'
import { verifyAdmin, verifyAuthCms } from '../middlewares/cms-auth.middleware'
import { BASE_PATH } from '.'

const cmsAuthRouter = new KoaRouter({prefix: BASE_PATH})
const { login, validated } = cmsAuthController

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
 * /cms-login:
 *   post:
 *     tags: [CmsAuth]
 *     summary: 中台用户登录
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
cmsAuthRouter.post(
  '/cms-login',
  verifyAccount,
  verifyAdmin,
  updateUserSystemInfo,
  updateUserLoginTime,
  login,
)

/**
 * @swagger
 * /cms-authorized:
 *   get:
 *     tags: [CmsAuth]
 *     summary: 中台用户鉴权
 *     security:
 *      - bearerAuth: []
 *     responses:
 *      200:
 *        description: 鉴权通过
 */
cmsAuthRouter.get('/cms-authorized', verifyAuthCms, updateUserLoginTime, validated)

module.exports = cmsAuthRouter
