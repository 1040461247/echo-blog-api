import { DefaultContext } from 'koa'
import { UAParser } from 'ua-parser-js'

export default function getUserSystemInfo(ctx: DefaultContext) {
  // Get BrowserInfo And OSInfo
  const uaStr = ctx.headers['user-agent']
  const parser = new UAParser(uaStr)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const browserInfo = `${browser.name} ${browser.major}`
  const osInfo = `${os.name} ${os.version}`

  // Get IpAddress
  const ipAddress = ctx.request.ip
  return { browserInfo, osInfo, ipAddress }
}
