import multer from 'koa-multer'
import { AVATAR_PATH, ILLUSTRATION_PATH } from '../config/filepath.config'

// 头像上传
const avatarUpload = multer({
  dest: AVATAR_PATH
})
const avatarHandler = avatarUpload.single('avatar')

// 文章配图上传
const illustrationUpload = multer({
  dest: ILLUSTRATION_PATH
})
const illustrationHandler = illustrationUpload.array('illustration', 20)

export { avatarHandler, illustrationHandler }
