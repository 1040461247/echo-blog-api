import type { Middleware } from 'koa'

// Types
export interface ISuccessOption {
  msg?: string
  type?: string
  code?: number
  total?: number
}

const responseHandle: Middleware = async function (ctx, next) {
  ctx.success = function (data = null, option?: ISuccessOption) {
    ctx.type = option?.type ?? 'json'
    ctx.body = {
      code: option?.code ?? 200,
      msg: option?.msg ?? 'success',
      data: data,
      success: true,
      total: option?.total,
    }
  }

  ctx.fail = function (error: Error) {
    ctx.app.emit('error', error, ctx)
  }

  await next()
}

export default responseHandle
