export default function camelToUnderscore(camelStr: string) {
  return camelStr.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
}
