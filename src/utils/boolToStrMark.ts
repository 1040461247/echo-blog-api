export default function boolToStrMark(boolFields: string[], oObj: Record<string, any>) {
  const obj = { ...oObj }

  for (const field of boolFields) {
    const oVal = obj[field]
    if (typeof oVal === 'boolean') {
      obj[field] = oVal ? '1' : '0'
    }
  }

  return obj
}
