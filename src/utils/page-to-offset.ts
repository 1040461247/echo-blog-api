export function pageToOffset(current: number | string = 1, pageSize: number | string = 1000) {
  const currentNum = Number(current)
  const pageSizeNum = Number(pageSize)

  const offset = String((currentNum - 1) * pageSizeNum)
  const limit = String(pageSizeNum)
  return { offset, limit }
}
