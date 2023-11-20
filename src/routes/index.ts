import fs from 'fs'
import path from 'path'

import type Koa from 'koa'
import type KoaRouter from '@koa/router'

function useRoutes(app: Koa) {
  // 读取并注册当前目录下所有路由
  fs.readdirSync(__dirname).forEach(file => {
    const currentFile = path.basename(__filename)
    if (file === currentFile) return

    const router: KoaRouter = require(`./${file}`)
    app.use(router.routes())
    app.use(router.allowedMethods())
  })
}

export default useRoutes
