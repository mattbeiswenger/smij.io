interface Env {
  REDIS_URL: string | undefined
  REDIS_TOKEN: string | undefined
}

interface Config {
  REDIS_URL: string
  REDIS_TOKEN: string
}

const getConfig = (): Env => {
  return {
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
  }
}

const getSanitizedConfig = (config: Env): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`)
    }
  }
  return config as Config
}

const config = getConfig()
const sanitizedConfig: Config = getSanitizedConfig(config)

export default sanitizedConfig
