import crypto from 'crypto'

const md5Encryp = (password: string) => {
  const md5 = crypto.createHash('md5')
  const encryptedPwd = md5.update(password).digest('hex')
  return encryptedPwd
}

export default md5Encryp
