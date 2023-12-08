declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PROTOCOL: string
      APP_HOST: string
      APP_PORT: string
      MYSQL_HOST: string
      MYSQL_PORT: string
      MYSQL_USER: string
      MYSQL_PASSWORD: string
      MYSQL_DATABASE: string
    }
  }
}

export {}
