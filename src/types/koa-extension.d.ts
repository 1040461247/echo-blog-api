import 'koa'
import type { ISuccessOption } from '../app/response-handle'
import { IUsers } from './index'

declare module 'koa' {
  // interface Application {}

  interface DefaultContext {
    success: (data?: any, option?: ISuccessOption) => void
    fail: (error: Error) => void
    user?: IUsers
  }
}
