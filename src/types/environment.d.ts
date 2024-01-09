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
      REDIS_HOST: string
      REDIS_PORT: string
      REDIS_USERNAME: string
      REDIS_PASSWORD: string
      ALIBABA_CLOUD_ACCESS_KEY_ID: string
      ALIBABA_CLOUD_ACCESS_KEY_SECRET: string
    }
  }
}

export {}
