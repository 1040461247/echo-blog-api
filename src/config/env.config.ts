import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

export const PRIMARY_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'))
export const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/public.key'))
export const { APP_PROTOCOL, APP_HOST, APP_PORT, MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER } = process.env
export const MYSQL_PORT = Number(process.env.MYSQL_PORT)
