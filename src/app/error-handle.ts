import { NAME_OR_PASSWORD_IS_REQUIRED } from '../config/error-types.config'
import type { DefaultContext } from 'koa'

const errorHandle = (err: Error, ctx: DefaultContext) => {
  let status = '404'
  let msg = 'NOT FOUND'

  switch (err.message) {
    case NAME_OR_PASSWORD_IS_REQUIRED:
      status = NAME_OR_PASSWORD_IS_REQUIRED
      msg = '用户名或密码不能为空'
      break
  }

  ctx.type = 'json'
  ctx.status = Number(status)
  ctx.body = {
    code: Number(status),
    msg: msg,
  }
}

export default errorHandle
