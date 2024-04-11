import { createClient } from 'redis'

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
}).on('error', async (err) => {
  // 错误处理和重连
  console.error(err)
  await redisClient.quit()
  redisClient.connect()
})

export default async function getRedisClient() {
  try {
    await redisClient.PING()
    return redisClient
  } catch (error: any) {
    return await redisClient.connect()
  }
}

// Redis Constants
export const OTPS_HASH = 'otps'
export const TOKEN_HASH = 'token'
export const CMS_TOKEN_HASH = 'cmsToken'
export const REGISTERING_SET = 'registering'
