interface IUsers {
  id?: number
  name: string
  password: string
  avatar_url?: string
  create_time?: string
  update_time?: string
}

interface IArticles {
  id?: number
  title: string
  content: string
  album_url?: string
  user_id?: number
  create_time?: string
  update_time?: string
}

interface IArticlesComments {
  id?: number
  content: string
  article_id: number
  user_id: number
  comment_id?: number
  create_time?: string
  update_time?: string
}

export { IUsers, IArticles, IArticlesComments }
