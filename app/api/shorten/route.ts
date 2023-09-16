import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import config from '../../utils/config'
import base62 from '../../utils/base62'
import { getIp } from '../../utils/get-ip'

export const runtime = 'edge'

const schema = zfd.formData({
  url: zfd.text(z.string().url('Invalid URL')),
})

const redis = new Redis({
  url: config.REDIS_URL,
  token: config.REDIS_TOKEN,
})

// Cache must exist outside of serverless function handler
// https://github.com/upstash/ratelimit#ephemeral-cache
const cache = new Map()

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
  ephemeralCache: cache,
})

export async function POST(request: NextRequest) {
  const ipAddress = getIp(request)
  if (ipAddress) {
    const { success, reset } = await ratelimit.limit(ipAddress)
    if (success) {
      const data = await request.formData()
      let parsedData
      try {
        parsedData = schema.parse(data)
      } catch (e) {
        return new NextResponse('Invalid request parameters', { status: 400 })
      }
      const { url } = parsedData
      const count = await redis.incr('count')
      const hash = base62.encode(count)
      let keyNotUnique = true
      while (keyNotUnique) {
        const ok = await redis.set(hash, url, {
          nx: true,
        })
        if (!ok) {
          keyNotUnique = false
          console.warn(`Key ${hash} already exists`)
        }
      }
    } else {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: { 'Retry-After': reset.toString() },
      })
    }
  }
  return new NextResponse('Invalid request', { status: 400 })
}
