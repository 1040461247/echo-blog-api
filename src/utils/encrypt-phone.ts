export default function encryptPhone(phone: string) {
  const reg = /(\d{3})\d{4}(\d{3})/
  return phone.replace(reg, '$1****$2')
}
