import dotenv from 'dotenv'

dotenv.config()

export const {
  APP_HOST,
  APP_PORT,
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} = process.env
