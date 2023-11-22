import jwt from 'jsonwebtoken'
import { PRIMARY_KEY, PUBLIC_KEY } from '../config/env.config'
import { UNAUTHORIZATION } from '../config/error-types.config'
import type { IUsers } from '../types'

function signToken(payload: any, expiresIn?: number) {
  const token = jwt.sign(payload, PRIMARY_KEY, {
    expiresIn: expiresIn ?? 7 * 24 * 60 * 60,
    algorithm: 'RS256',
  })

  return token
}

function verifyToken(token: string) {
  try {
    const user = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as IUsers
    return user
  } catch (error) {
    throw new Error(UNAUTHORIZATION)
  }
}

export { signToken, verifyToken }
