import KoaRouter from '@koa/router'
import usersController from '../controllers/users.controller'
import { verifyRegisterInfo, encrypPwd } from '../middlewares/users.middleware'

const usersRouter = new KoaRouter({ prefix: '/users' })
const { create, list, getAvatarById } = usersController

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: 用户注册
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
 *               phone_num:
 *                 type: string
 *                 example: 18669275339
 *     responses:
 *       200:
 *         description: 用户注册成功
 */
usersRouter.post('/', verifyRegisterInfo, encrypPwd, create)
/**
 * @swagger
 * /users:
 *  get:
 *    tags: [Users]
 *    summary: 获取用户列表
 *    responses:
 *      200:
 *        description: 返回用户列表
 */
usersRouter.get('/', list)
/**
 * @swagger
 * /users/{userId}/avatar:
 *  get:
 *    tags: [Users]
 *    summary: 获取用户头像
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: 返回用户头像
 */
usersRouter.get('/:userId/avatar', getAvatarById)

module.exports = usersRouter
