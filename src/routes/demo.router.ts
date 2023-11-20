import KoaRouter from '@koa/router'

const router = new KoaRouter({ prefix: '/home' })

router.get('/', ctx => {
  ctx.success({ username: 'Tian' }, { msg: '成功！' })
})
router.post('/', ctx => {
  ctx.success(ctx.request.body)
})

module.exports = router
