import getRedisClient from '../app/redis'

export default async function redisExpire(
  structure: 'hash' | 'set',
  key: string,
  field: string,
  expireTime: number,
) {
  setTimeout(async () => {
    const redisClient = await getRedisClient()
    switch (structure) {
      case 'hash':
        await redisClient.hDel(key, field)
        break
      case 'set':
        await redisClient.sRem(key, field)
        break
    }
    redisClient.quit()
  }, expireTime)
}
