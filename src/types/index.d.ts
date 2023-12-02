type TResources = 'users' | 'articles' | 'articles_comments' | 'categories' | 'tags' | 'file_avatar' | 'file_illustration'

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
  category_id?: number
  is_sticky?: 0 | 1
  cover_url?: string
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

interface ICategories {
  id?: number
  name: string
  create_time?: string
  update_time?: string
}

interface ITags {
  id?: number
  name: string
  create_time?: string
  update_time?: string
}

interface IFileAvatar {
  id?: number
  filename: string
  mimetype: string
  size: number
  user_id: number
  create_time?: string
  update_time?: string
}

interface IFileIllustration {
  id?: number
  filename: string
  mimetype: string
  size: number
  article_id: number
  create_time?: string
  update_time?: string
}

export { TResources, IUsers, IArticles, IArticlesComments, ICategories, ITags, IFileAvatar, IFileIllustration }
