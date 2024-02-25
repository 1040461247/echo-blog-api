import { DefaultContext } from 'koa'
import { UAParser } from 'ua-parser-js'
import IP2Region from 'ip2region'

export interface IUserSystemInfo {
  browserInfo: string
  osInfo: string
  ipAddress: string
}

export default function getUserSystemInfo(ctx: DefaultContext): IUserSystemInfo {
  // Get browserInfo And osInfo
  const uaStr = ctx.headers['user-agent']
  const parser = new UAParser(uaStr)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const browserInfo = `${browser.name} ${browser.major}`
  const osInfo = `${os.name} ${os.version}`

  // Get ipAddress
  const ip = getReqIp(ctx)
  const query = new IP2Region()
  const ipRes = query.search(ip)!
  const ipAddress = ipRes?.province! || ipRes?.isp

  return { browserInfo, osInfo, ipAddress }
}

export function getReqIp(ctx: DefaultContext) {
  return ctx.headers['x-forwarded-for'] || ctx.headers['x-real-ip'] || ctx.ip
}
