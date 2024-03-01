export function pageToOffset(current: number | string, pageSize: number | string) {
  const currentNum = Number(current)
  const pageSizeNum = Number(pageSize)

  const offset = String((currentNum - 1) * pageSizeNum)
  const limit = String(pageSizeNum)
  return { offset, limit }
}
