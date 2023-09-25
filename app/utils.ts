import { Request, getClientIp } from 'request-ip'
import { headers } from 'next/headers'
import { Redis } from '@upstash/redis'
import config from './config'

/**
 * Helper function to base62 encode a number for use as a hash
 */
const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const base62 = {
  encode: (num: number): string => {
    let result = ''
    while (num > 0) {
      result = CHARACTERS[num % CHARACTERS.length] + result
      num = Math.floor(num / CHARACTERS.length)
    }
    return result
  },
}

/**
 * Types for request-ip library don't play well with NextRequest
 * headers so some conversion is needed
 */
export const getIp = () => {
  const request: Request = {
    headers: {
      'x-client-ip': headers().get('x-client-ip') || undefined,
      'x-forwarded-for': headers().get('x-forwarded-for') || undefined,
      'x-real-ip': headers().get('x-real-ip') || undefined,
      'x-cluster-client-ip': headers().get('x-cluster-client-ip') || undefined,
      'x-forwarded': headers().get('x-forwarded') || undefined,
      'forwarded-for': headers().get('forwarded-for') || undefined,
      forwarded: headers().get('forwarded') || undefined,
    },
  }
  return getClientIp(request)
}

/**
 * Global Redis client
 */
export const redis = new Redis({
  url: config.REDIS_URL,
  token: config.REDIS_TOKEN,
})
