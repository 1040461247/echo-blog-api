import jwt from 'jsonwebtoken'
import { PRIMARY_KEY, PUBLIC_KEY } from '../config/env.config'
import { AUTHORIZATION_EXPIRES, UNAUTHORIZATION } from '../config/error-types.config'
import type { IUsers } from '../types'
import getRedisClient, { CMS_TOKEN_HASH } from '../app/redis'
import redisExpire from './redis-expire'

// Types
export interface ISalt {
  id: number
}

const TOKEN_EXPIRE_TIME = 24 * 60 * 60

// Token白名单
export async function addTokenToWhiteListCms(token: string, id: string) {
  if (!token) return
  const redisClient = await getRedisClient()
  await redisClient.hSet(CMS_TOKEN_HASH, id, token)
  redisExpire('hash', CMS_TOKEN_HASH, id, TOKEN_EXPIRE_TIME * 1000)
  await redisClient.quit()
}

export async function hasTokenInWhiteListCms(id: string) {
  if (!id) return
  const redisClient = await getRedisClient()
  const hasToken = await redisClient.hExists(CMS_TOKEN_HASH, id)
  await redisClient.quit()
  return hasToken
}

export async function getTokenFromWhiteListCms(id: string) {
  // 检查白名单中该用户是否有合法token
  const hasToken = await hasTokenInWhiteListCms(id)
  if (!hasToken) {
    throw new Error(UNAUTHORIZATION)
  }

  // 获取Token
  const redisClient = await getRedisClient()
  const token = await redisClient.hGet(CMS_TOKEN_HASH, id)
  await redisClient.quit()
  return token
}

export async function remTokenFromWhiteListCms(id: string) {
  // 检查白名单中该用户是否有合法token
  const hasToken = await hasTokenInWhiteListCms(id)
  if (!hasToken) {
    throw new Error(UNAUTHORIZATION)
  }

  // 删除Token
  const redisClient = await getRedisClient()
  await redisClient.hDel(CMS_TOKEN_HASH, id)
  await redisClient.quit()
}

// 签发Token
export async function signTokenCms(payload: ISalt, expiresIn?: number) {
  const token = jwt.sign(payload, PRIMARY_KEY, {
    expiresIn: expiresIn ?? TOKEN_EXPIRE_TIME,
    algorithm: 'RS256',
  })

  await addTokenToWhiteListCms(token, String(payload.id))

  return token
}

// 鉴权Token
export async function verifyTokenCms(token: string) {
  try {
    const user = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as IUsers

    // 提取合法Token与请求Token比对
    const validToken = await getTokenFromWhiteListCms(String(user.id))
    if (token === validToken) {
      return user
    } else {
      throw new Error(AUTHORIZATION_EXPIRES)
    }
  } catch (error) {
    throw new Error(AUTHORIZATION_EXPIRES)
  }
}
