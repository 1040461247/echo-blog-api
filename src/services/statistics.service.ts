import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'

class StatisticsService {
  async getStatisticsTotal(resourceList: string[]) {
    try {
      const promiseList = []
      const resObj = {}

      for (const resource of resourceList) {
        let statement: string

        switch (resource) {
          case 'articles':
            statement = `SELECT COUNT(*) articlesCount FROM articles WHERE state != '0' AND visibility != '0';`
            break
          default:
            statement = `SELECT COUNT(*) ${resource}Count FROM ${resource};`
        }

        const res = connection.execute(statement).then((res: any) => {
          Object.assign(resObj, res[0][0])
        })
        promiseList.push(res)
      }

      await Promise.all(promiseList)
      return resObj
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new StatisticsService()
