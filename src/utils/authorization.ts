import jwt from 'jsonwebtoken'
import { PRIMARY_KEY, PUBLIC_KEY } from '../config/env.config'
import { AUTHORIZATION_EXPIRES, UNAUTHORIZATION } from '../config/error-types.config'
import type { IUsers } from '../types'
import getRedisClient, { TOKEN_HASH } from '../app/redis'
import redisExpire from './redis-expire'

// Types
export interface ISalt {
  id: number
}

const TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60

// Token白名单
export async function addTokenToWhiteList(token: string, id: string) {
  const redisClient = await getRedisClient()
  await redisClient.hSet(TOKEN_HASH, id, token)
  redisExpire('hash', TOKEN_HASH, id, TOKEN_EXPIRE_TIME * 1000)
  redisClient.quit()
}

export async function hasTokenInWhiteList(id: string) {
  const redisClient = await getRedisClient()
  const hasToken = await redisClient.hExists(TOKEN_HASH, id)
  await redisClient.quit()
  return hasToken
}

export async function getTokenFromWhiteList(id: string) {
  // 检查白名单中该用户是否有合法token
  const hasToken = await hasTokenInWhiteList(id)
  if (!hasToken) {
    throw new Error(UNAUTHORIZATION)
  }

  // 获取Token
  const redisClient = await getRedisClient()
  const token = await redisClient.hGet(TOKEN_HASH, id)
  redisClient.quit()
  return token
}

export async function remTokenFromWhiteList(id: string) {
  // 检查白名单中该用户是否有合法token
  const hasToken = await hasTokenInWhiteList(id)
  if (!hasToken) {
    throw new Error(UNAUTHORIZATION)
  }

  // 删除Token
  const redisClient = await getRedisClient()
  await redisClient.hDel(TOKEN_HASH, id)
  redisClient.quit()
}

// 签发Token
export async function signToken(payload: ISalt, expiresIn?: number) {
  const token = jwt.sign(payload, PRIMARY_KEY, {
    expiresIn: expiresIn ?? TOKEN_EXPIRE_TIME,
    algorithm: 'RS256',
  })

  await addTokenToWhiteList(token, String(payload.id))

  return token
}

// 鉴权Token
export async function verifyToken(token: string) {
  try {
    const user = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as IUsers

    // 提取合法Token与请求Token比对
    const validToken = await getTokenFromWhiteList(String(user.id))
    if (token === validToken) {
      return user
    } else {
      throw new Error(AUTHORIZATION_EXPIRES)
    }
  } catch (error) {
    throw new Error(AUTHORIZATION_EXPIRES)
  }
}
