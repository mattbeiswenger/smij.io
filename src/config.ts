interface Env {
  REDIS_URL: string | undefined
  HOSTNAME: string | undefined
}

interface Config {
  REDIS_URL: string
  HOSTNAME: string
}

const getConfig = (): Env => {
  return {
    REDIS_URL: process.env.REDIS_URL,
    HOSTNAME: process.env.HOSTNAME,
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
