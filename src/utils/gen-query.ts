import camelToUnderscore from './camel-to-underscore'

export function optToWhereQuery(option: any, mainTable: string) {
  const conditionArr: string[] = []
  const whereVals: any[] = []

  // 特殊字段处理
  // tags字段生成IN查询语句
  const tags = option['tags[]']
  if (tags?.length > 0) {
    const idsStr = tags.join(', ')
    conditionArr.push(`tags.id IN (${idsStr})`)
  }

  // title字段进行模糊查询
  if (option.title) {
    conditionArr.push(`${mainTable}.title LIKE '%${option.title}%'`)
  }

  // 时间段查询
  if (option.createTime) {
    const timeRange = JSON.parse(option.createTime)
    whereVals.push(timeRange.startTime, timeRange.endTime)
    conditionArr.push(`${mainTable}.create_time BETWEEN ? AND ?`)
  }
  if (option.updateTime) {
    const timeRange = JSON.parse(option.updateTime)
    whereVals.push(timeRange.startTime, timeRange.endTime)
    conditionArr.push(`${mainTable}.update_time BETWEEN ? AND ?`)
  }

  // 生成查询语句
  // 忽略生成查询语句的字段
  const oFileds = [
    'current',
    'pageSize',
    'title',
    'token ',
    'tags[]',
    'createTime',
    'updateTime',
    'sort',
  ]
  const keys = Object.keys(option).filter((item) => !oFileds.includes(item))
  for (const key of keys) {
    whereVals.push(option[key])
    conditionArr.push(`${mainTable}.${camelToUnderscore(key)} = ?`)
  }
  let whereQuery = conditionArr.join(' AND ')
  // 当有查询条件时，添加WHERE关键字
  if (whereQuery !== '') {
    whereQuery = 'WHERE ' + whereQuery
  }

  return { whereQuery, whereVals }
}

export function optToSortQuery(sortStr: string | undefined, mainTable: string) {
  if (!sortStr) return null
  const sortArr: string[] = []
  const sortObj = JSON.parse(sortStr)
  const sortKeys = Object.keys(sortObj)

  sortKeys.map((item) => {
    const sortType = sortObj[item]
    sortArr.push(`${mainTable}.${camelToUnderscore(item)} ${sortType === 'ascend' ? '' : 'DESC'}`)
  })
  if (sortArr.length === 0) return null

  let sortQuery = sortArr.join(', ')
  sortQuery = 'ORDER BY ' + sortQuery

  return sortQuery
}

export function optToUpdateQuery(option: any) {
  const updateArr: string[] = []
  const updateVals: any[] = []
  const optKeys = Object.keys(option)

  for (const key of optKeys) {
    updateVals.push(option[key])
    updateArr.push(`${camelToUnderscore(key)} = ?`)
  }
  const updateQuery = updateArr.join(', ')

  return { updateQuery, updateVals }
}
