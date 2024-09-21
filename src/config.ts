interface Env {
  HOSTNAME: string | undefined
  UPSTASH_REDIS_REST_URL: string | undefined
  UPSTASH_REDIS_REST_TOKEN: string | undefined
}

interface Config {
  HOSTNAME: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

const getConfig = (): Env => {
  return {
    HOSTNAME: process.env.HOSTNAME,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
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
