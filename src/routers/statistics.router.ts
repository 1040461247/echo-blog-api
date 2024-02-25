import KoaRouter from '@koa/router'
import statisticsController from '../controllers/statistics.controller'

const statisticsRouter = new KoaRouter({ prefix: '/statistics' })
const { getStatisticsTotal } = statisticsController

/**
 * @swagger
 * /statistics:
 *  get:
 *    tags: [Statistics]
 *    summary: 获取资源总数
 *    responses:
 *      200:
 *        description: success
 */
statisticsRouter.get('/', getStatisticsTotal)

module.exports = statisticsRouter
