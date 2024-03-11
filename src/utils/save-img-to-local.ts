import axios from 'axios'
import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

export default async function saveImgToLocal(
  url: string,
  saveUrl: string,
): Promise<{ filename: string; mimetype: string; size: number }> {
  try {
    // 发起 GET 请求下载图片
    const response = await axios.get(url, { responseType: 'stream' })
    // 获取图片的 mimetype 和 size
    const mimetype = response.headers['content-type']
    const size = response.headers['content-length']

    // 根据文件内容生成hash文件名
    const hashName = crypto.randomBytes(32).toString('hex')
    const savePath = path.join(saveUrl, hashName)

    // 创建可写流
    const writer = fs.createWriteStream(savePath)
    // 将图片数据写入到本地文件
    response.data.pipe(writer)
    // 返回一个 Promise 以便异步操作完成
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({ filename: hashName, mimetype, size }))
      writer.on('error', reject)
    })
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
  }
}
