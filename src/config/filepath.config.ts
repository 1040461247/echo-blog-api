import path from 'path'

const LOG_PATH = path.resolve(__dirname, '../../logs')
const UPLOAD_PATH = path.resolve(__dirname, '../../uploads')
const AVATAR_PATH = path.resolve(UPLOAD_PATH, './avatar')
const ILLUSTRATION_PATH = path.resolve(UPLOAD_PATH, './illustration')

export { LOG_PATH, AVATAR_PATH, ILLUSTRATION_PATH }
