import { DefaultContext } from 'koa'
import { UAParser } from 'ua-parser-js'
import IP2Region from 'ip2region'

export interface IUserSystemInfo {
  browser_info: string
  os_info: string
  ip_address: string
}

export default function getUserSystemInfo(ctx: DefaultContext): IUserSystemInfo {
  // Get browser_info And os_info
  const uaStr = ctx.headers['user-agent']
  const parser = new UAParser(uaStr)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  const browser_info = `${browser.name} ${browser.major}`
  const os_info = `${os.name} ${os.version}`

  // Get ip_address
  const ip = ctx.headers['x-forwarded-for'] || ctx.headers['x-real-ip'] || ctx.ip
  const query = new IP2Region()
  const ipRes = query.search(ip)!
  const ip_address = ipRes?.province! || ipRes?.isp

  return { browser_info, os_info, ip_address }
}
