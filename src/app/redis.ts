import { createClient } from 'redis'

const redis = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}).on('error', (err) => console.log('Redis Client Error', err))

export default async function getRedisClient() {
  return await redis.connect()
}

// Redis Constants
export const OTPS_HASH = 'otps'
export const REGISTERING_SET = 'registering'
