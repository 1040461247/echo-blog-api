import {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_DOES_NOT_EXISTS,
  PASSWORD_ERROR,
  USER_ALREADY_EXISTS,
  UNAUTHORIZATION,
  DATABASE_ERROR
} from '../config/error-types.config'
import type { DefaultContext } from 'koa'

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
      msg = '用户已存在'
      break
    case UNAUTHORIZATION:
      status = 401
      msg = '未授权，请先登录'
      break
    case DATABASE_ERROR:
      status = 500
      msg = '数据库错误，请检查查询参数'
      break
  }

  ctx.type = 'json'
  ctx.status = Number(status)
  ctx.body = {
    code: Number(status),
    msg: msg
  }
}

export default errorHandle
