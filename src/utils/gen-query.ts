import camelToUnderscore from './camel-to-underscore'

export function optToWhereQuery(option: any, tableAlias: string, tagTAlias: string = 'art') {
  const conditionArr: string[] = []
  const whereVals: any[] = []

  // 特殊字段处理
  // tags字段生成IN查询语句
  const tags: string[] | string = option['tags[]'] ?? option['tags']
  if (Array.isArray(tags)) {
    const idsStr = tags.join(', ')
    conditionArr.push(`${tagTAlias}.tag_id IN (${idsStr})`)
  } else if (typeof tags === 'string') {
    conditionArr.push(`${tagTAlias}.tag_id IN (${tags})`)
  }

  // 模糊查询字段
  if (option.title) {
    conditionArr.push(`${tableAlias}.title LIKE '%${option.title}%'`)
  }
  if (option.name) {
    conditionArr.push(`${tableAlias}.name LIKE '%${option.name}%'`)
  }

  // 时间段查询
  if (option.createTime) {
    const timeRange = JSON.parse(option.createTime)
    whereVals.push(timeRange.startTime, timeRange.endTime)
    conditionArr.push(`${tableAlias}.create_time BETWEEN ? AND ?`)
  }
  if (option.updateTime) {
    const timeRange = JSON.parse(option.updateTime)
    whereVals.push(timeRange.startTime, timeRange.endTime)
    conditionArr.push(`${tableAlias}.update_time BETWEEN ? AND ?`)
  }

  // 生成查询语句
  // 忽略生成查询语句的字段
  const oFileds = [
    'current',
    'pageSize',
    'title',
    'token ',
    'tags[]',
    'tags',
    'createTime',
    'updateTime',
    'sort',
    'name',
  ]
  const keys = Object.keys(option).filter((item) => !oFileds.includes(item))
  for (const key of keys) {
    whereVals.push(option[key])
    conditionArr.push(`${tableAlias}.${camelToUnderscore(key)} = ?`)
  }
  let whereQuery = conditionArr.join(' AND ')
  // 当有查询条件时，添加WHERE关键字
  if (whereQuery !== '') {
    whereQuery = 'WHERE ' + whereQuery
  }

  return { whereQuery, whereVals }
}

export function optToSortQuery(
  sortStr: string | undefined,
  tableAlias: string = '',
  notSqlFiles?: string[],
) {
  if (!sortStr) return null
  const sortArr: string[] = []
  const sortObj = JSON.parse(sortStr)
  const sortKeys = Object.keys(sortObj)

  sortKeys.map((item) => {
    const sortType = sortObj[item]
    const tablePre = tableAlias && tableAlias + '.'
    const filedName = camelToUnderscore(item)
    sortArr.push(
      `${notSqlFiles?.includes(item) ? item : tablePre + filedName} ${
        sortType === 'ascend' ? '' : 'DESC'
      }`,
    )
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

export function optToInsertQuery(option: any) {
  const insertArr: string[] = []
  const insertVals: any[] = []
  const optKeys = Object.keys(option)

  for (const key of optKeys) {
    insertVals.push(option[key])
    insertArr.push(`${camelToUnderscore(key)}`)
  }
  const insertQuery = insertArr.join(', ')

  return { insertQuery, insertVals }
}
