import { createClient } from 'redis'

const redis = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}).on('error', (err) => console.log('Redis Client Error', err))

export default redis
