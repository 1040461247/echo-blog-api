function sortArticles(articles: any[]) {
  const stickyAtcs: any[] = []
  const otherAtcs: any[] = []

  articles.forEach((item: any) => {
    if (item.is_sticky === 1) {
      stickyAtcs.push(item)
    } else if (item.is_sticky === 0) {
      otherAtcs.push(item)
    }
  })

  return [...stickyAtcs, ...otherAtcs]
}

export default sortArticles
