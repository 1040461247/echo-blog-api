import KoaRouter from '@koa/router'
import usersController from '../controllers/users.controller'
import { verifyRegisterInfo, encrypPwd } from '../middlewares/users.middleware'
import { verifyAuth } from '../middlewares/auth.middleware'

const usersRouter = new KoaRouter({ prefix: '/users' })
const { createUser, getUserList, getAvatarByUserId, getUserById, updateUser } = usersController

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
usersRouter.get('/', getUserList)

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
usersRouter.get('/:userId/avatar', getAvatarByUserId)

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    tags: [Users]
 *    summary: 获取用户信息
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: number
 *          example: 1
 *    responses:
 *      200:
 *        description: 获取成功
 */
usersRouter.get('/:userId', getUserById)

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
 *               phoneNum:
 *                 type: string
 *                 example: 18669275339
 *     responses:
 *       200:
 *         description: 用户注册成功
 */
usersRouter.post('/', verifyRegisterInfo, encrypPwd, createUser)

/**
 * @swagger
 * /users/update:
 *  post:
 *    tags: [Users]
 *    summary: 修改用户信息
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Hello world
 *              password:
 *                type: string
 *                example: 123456
 *    responses:
 *      200:
 *        description: success
 */
usersRouter.post('/update', verifyAuth, encrypPwd, updateUser)

module.exports = usersRouter
