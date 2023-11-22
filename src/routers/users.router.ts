import KoaRouter from '@koa/router'
import usersController from '../controllers/users.controller'
import { verifyRegisterInfo, encrypPwd } from '../middlewares/users.middleware'

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 用户注册
 *     tags: [Users]
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
 *       200:
 *         description: 用户注册成功
 */

const usersRouter = new KoaRouter({ prefix: '/users' })
const { create } = usersController

usersRouter.post('/', verifyRegisterInfo, encrypPwd, create)

module.exports = usersRouter
