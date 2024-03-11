import multer from 'koa-multer'
import { AVATAR_PATH, ILLUSTRATION_PATH } from '../config/filepath.config'
import { Middleware } from 'koa'
import saveImgToLocal from '../utils/save-img-to-local'

// 头像上传
const avatarUpload = multer({
  dest: AVATAR_PATH,
})
const avatarHandler = avatarUpload.single('avatar')

// 文章配图上传
const illustrationUpload = multer({
  dest: ILLUSTRATION_PATH,
})
const illustrationHandler = illustrationUpload.array('illustration', 20)

// 文章封面上传
const coverHandler = illustrationUpload.single('cover')

// 根据站外图片的url拷贝并上传图片
const illustrationOffsiteHandler: Middleware = async (ctx, next) => {
  const { url } = ctx.request.body as any
  try {
    const fileInfo = await saveImgToLocal(url, ILLUSTRATION_PATH)
    ctx.file = { originalURL: url, ...fileInfo }
    await next()
  } catch (error: any) {
    ctx.fail(new Error(`'图片下载出错，错误信息：${error}`))
    return
  }
}

export { avatarHandler, illustrationHandler, illustrationOffsiteHandler, coverHandler }
