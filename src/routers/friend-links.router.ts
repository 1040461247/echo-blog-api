import KoaRouter from '@koa/router'
import friendLinksController from '../controllers/friend-links.controller'

const friendLinksRouter = new KoaRouter({ prefix: '/friend-links' })
const { getPassedFriendList } = friendLinksController

/**
 * @swagger
 * /friend-links/passed:
 *  get:
 *    tags: [FriendLinks]
 *    summary: 获取审批通过的列表
 *    responses:
 *      200:
 *        description: success
 */
friendLinksRouter.get('/passed', getPassedFriendList)

module.exports = friendLinksRouter
