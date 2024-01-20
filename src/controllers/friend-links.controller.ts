import { type DefaultContext } from 'koa'
import friendLinksService from '../services/friend-links.service'

class FriendLinksController {
  async create(ctx: DefaultContext) {
    ctx.success('niubi')
  }
}

export default new FriendLinksController()
