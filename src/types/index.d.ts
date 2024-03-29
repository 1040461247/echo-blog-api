type TResources =
  | 'users'
  | 'articles'
  | 'articles_comments'
  | 'categories'
  | 'tags'
  | 'file_avatar'
  | 'file_illustration'
  | 'articles_ref_tags'
  | 'comment_likes'

interface IUsers {
  id?: number
  name: string
  password?: string
  avatarUrl?: string
  browserInfo?: string
  osInfo?: string
  ipAddress?: string
  phoneNum?: string
  createTime?: string
  updatTime?: string
}

interface IArticles {
  id?: number
  title: string
  content: string
  description: string
  albumUrl?: string
  userId?: number
  categoryId: number
  isSticky?: '0' | '1'
  coverUrl?: string
  createTime?: string
  updateTime?: string
}

interface IArticlesComments {
  id?: number
  content: string
  articleId: number
  userId: number
  commentId?: number
  createTime?: string
  updateTime?: string
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

interface IArticlesRefTags {
  tag_id: number
  article_id: number
}

export {
  TResources,
  IUsers,
  IArticles,
  IArticlesComments,
  ICategories,
  ITags,
  IFileAvatar,
  IFileIllustration,
  IArticlesRefTags,
}
