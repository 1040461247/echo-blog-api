import KoaRouter from '@koa/router'
import friendLinksController from '../controllers/friend-links.controller'

const friendLinksRouter = new KoaRouter({ prefix: '/friend-links' })
const { create } = friendLinksController

module.exports = friendLinksRouter
