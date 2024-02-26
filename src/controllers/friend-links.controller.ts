import { type DefaultContext } from 'koa'
import friendLinksService from '../services/friend-links.service'

class FriendLinksController {
  async getPassedFriendList(ctx: DefaultContext) {
    try {
      const passedList = await friendLinksService.getPassedFriendList()
      ctx.success(passedList)
    } catch (error: any) {
      ctx.fail(error)
    }
  }
}

export default new FriendLinksController()
