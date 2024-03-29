// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'

export default class Client {
  static createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
    })
    config.endpoint = `dysmsapi.aliyuncs.com`
    return new Dysmsapi20170525(config)
  }

  static generateOtp(length: number) {
    let code = Number(Math.random().toString().slice(-length))
    if (code < 1000) code += 1000
    return code
  }

  static async main(phone: string): Promise<{ status: 0 | 1; msg: number | string }> {
    return { status: 1, msg: 1234 }

    // const code = Client.generateOtp(4)

    // const client = Client.createClient(
    //   process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
    //   process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
    // )
    // const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
    //   phoneNumbers: phone,
    //   signName: process.env.SMS_SIGNNAME,
    //   templateCode: process.env.SMS_TEMPLATE_CODE,
    //   templateParam: `{"code":${code}}`,
    // })
    // const runtime = new $Util.RuntimeOptions({})
    // try {
    //   const { body } = await client.sendSmsWithOptions(sendSmsRequest, runtime)
    //   switch (body.code) {
    //     case 'OK':
    //       return { status: 1, msg: code }
    //     case 'isv.BUSINESS_LIMIT_CONTROL':
    //       return { status: 0, msg: '今日发送频率已达上限' }
    //     default:
    //       console.log(body, `code:${code}`)
    //       return { status: 0, msg: '验证码发送失败' }
    //   }
    // } catch (error: any) {
    //   // 错误 message
    //   console.log(error.message)
    //   // 诊断地址
    //   console.log(error.data['Recommend'])
    //   Util.assertAsString(error.message)
    //   throw error
    // }
  }
}
