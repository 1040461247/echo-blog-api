import path from 'path'
import log4js from 'koa-log4'
import { LOG_PATH } from '../config/filepath.config'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    httpRule: {
      type: 'dateFile',
      filename: path.join(LOG_PATH, '/http'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      daysToKeep: 30,
    },
  },
  categories: {
    default: { appenders: ['console'], level: 'all' },
    http: { appenders: ['httpRule'], level: 'info' },
  },
})

export default log4js.koaLogger(log4js.getLogger('http'), {
  level: 'auto',
})
