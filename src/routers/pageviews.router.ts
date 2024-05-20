import KoaRouter from '@koa/router'
import pageviewsController from '../controllers/pageviews.controller'
import { BASE_PATH } from '.'

const pageviewsRouter = new KoaRouter({ prefix: `${BASE_PATH}/pageviews` })
const { createPv, getPv, getUv } = pageviewsController

/**
 * @swagger
 * /pageviews/pv:
 *  get:
 *    tags: [Pageviews]
 *    summary: 获取页面pv
 *    parameters:
 *      - in: query
 *        name: pageUrl
 *        schema:
 *          type: string
 *          example: /
 *    responses:
 *      200:
 *        description: success
 */
pageviewsRouter.get('/pv', getPv)

/**
 * @swagger
 * /pageviews/uv:
 *  get:
 *    tags: [Pageviews]
 *    summary: 获取网站uv
 *    responses:
 *      200:
 *        description: success
 */
pageviewsRouter.get('/uv', getUv)

/**
 * @swagger
 * /pageviews:
 *  post:
 *    tags: [Pageviews]
 *    summary: 添加一条页面访问记录
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              pageUrl:
 *                type: string
 *                example: /
 *    responses:
 *      200:
 *        description: success
 */
pageviewsRouter.post('/', createPv)

module.exports = pageviewsRouter
