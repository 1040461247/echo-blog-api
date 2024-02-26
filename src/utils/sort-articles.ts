import { IArticles } from '../types'

function sortArticles(articles: IArticles[]) {
  const stickyAtcs: IArticles[] = []
  const otherAtcs: IArticles[] = []

  articles.forEach((item: IArticles) => {
    if (item.isSticky === 1) {
      stickyAtcs.push(item)
    } else if (item.isSticky === 0) {
      otherAtcs.push(item)
    }
  })

  return [...stickyAtcs, ...otherAtcs]
}

export default sortArticles
