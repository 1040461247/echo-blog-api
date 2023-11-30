import connection from '../app/database'
import { DATABASE_ERROR } from '../config/error-types.config'
import type { OkPacketParams } from 'mysql2'

class StatisticsService {
  async getTotal() {
    const resourceList = ['articles', 'tags', 'categories']
    const promiseList = []

    try {
      for (const resource of resourceList) {
        const statement = `SELECT COUNT(*) ${resource}Count FROM ${resource};`
        const res = connection.execute(statement)
        promiseList.push(res)
      }
      const fullfilleds = await Promise.all(promiseList)
      // 扁平化数组，抽取其中的数据
      const resList = fullfilleds.reduce((preVal: any, curVal: any) => {
        const obj = curVal[0][0]
        Object.assign(preVal, obj)
        return preVal
      }, {})
      return resList
    } catch (error) {
      throw new Error(DATABASE_ERROR)
    }
  }
}

export default new StatisticsService()
