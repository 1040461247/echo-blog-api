export default function objectFilter(obj: Record<string, any>, filters: string[]) {
  const filteredObj: Record<string, any> = { ...obj }
  const keys = Object.keys(filteredObj)

  for (const key of keys) {
    if (filters.includes(key)) {
      delete filteredObj[key]
    }
  }

  return filteredObj
}
