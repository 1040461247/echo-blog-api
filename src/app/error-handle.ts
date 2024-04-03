import type { DefaultContext } from 'koa'
import {
  BAD_PARAMATERS,
  DATABASE_ERROR,
  MISSING_PERAMATERS,
  NAME_OR_PASSWORD_IS_REQUIRED,
  NO_PERMISSION,
  PASSWORD_ERROR,
  UNAUTHORIZATION,
  AUTHORIZATION_EXPIRES,
  USER_ALREADY_EXISTS,
  USER_DOES_NOT_EXISTS,
} from '../config/error-types.config'

const errorHandle = (err: Error, ctx: DefaultContext) => {
  let status = 404
  let msg = 'NOT FOUND'

  switch (err.message) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400
      msg = '用户名或密码不能为空'
      break
    case USER_DOES_NOT_EXISTS:
      status = 400
      msg = '用户名不存在'
      break
    case PASSWORD_ERROR:
      status = 400
      msg = '密码错误'
      break
    case USER_ALREADY_EXISTS:
      status = 409
      msg = '用户名已存在'
      break
    case UNAUTHORIZATION:
      status = 401
      msg = '未授权，请先登录'
      break
    case AUTHORIZATION_EXPIRES:
      status = 401
      msg = '授权已过期，请重新登录'
      break
    case DATABASE_ERROR:
      status = 500
      msg = '数据库错误，请检查查询参数'
      break
    case NO_PERMISSION:
      status = 401
      msg = '当前用户没有操作权限'
      break
    case MISSING_PERAMATERS:
      status = 400
      msg = '缺少必要参数'
      break
    case BAD_PARAMATERS:
      status = 400
      msg = '错误参数'
      break
    default:
      status = 400
      msg = err.message
  }

  ctx.type = 'json'
  ctx.body = {
    code: Number(status),
    msg: msg,
    success: false,
  }
}

export default errorHandle
