import type { Middleware } from 'koa'

// Types
export interface ISuccessOption {
  msg?: string
  type?: string
  code?: number
}

const responseHandle: Middleware = async function (ctx, next) {
  ctx.success = function (data: any, option?: ISuccessOption) {
    ctx.type = option?.type ?? 'json'
    ctx.body = {
      code: option?.code ?? 200,
      msg: option?.msg ?? 'success',
      data: data,
    }
  }

  ctx.fail = function (error: Error) {
    ctx.app.emit('error', error, ctx)
  }

  await next()
}

export default responseHandle
