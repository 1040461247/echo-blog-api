// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'

export default class Client {
  static createClient(accessKeyId: string, accessKeySecret: string): Dysmsapi20170525 {
    let config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret
    })
    config.endpoint = `dysmsapi.aliyuncs.com`
    return new Dysmsapi20170525(config)
  }

  static generateOtp(length: number) {
    return Math.random().toString().slice(-length)
  }

  static async main(phone: string): Promise<string> {
    const code = Client.generateOtp(4)

    let client = Client.createClient(
      process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
      process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!
    )
    let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: 'EchoBlog',
      templateCode: 'SMS_464486007',
      templateParam: `{"code":${code}}`
    })
    let runtime = new $Util.RuntimeOptions({})
    try {
      // 复制代码运行请自行打印 API 的返回值
      await client.sendSmsWithOptions(sendSmsRequest, runtime)
      return code
    } catch (error: any) {
      // 错误 message
      console.log(error.message)
      // 诊断地址
      console.log(error.data['Recommend'])
      Util.assertAsString(error.message)
      throw error
    }
  }
}
