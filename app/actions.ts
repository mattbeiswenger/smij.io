'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { redis, base62, getIp } from './utils'

const schema = zfd.formData({
  url: zfd.text(z.string().url('Invalid URL')),
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

const getSessionId = () => {
  const sessionId = cookies().get('session-id')
  if (sessionId) {
    return sessionId
  }
  const uuid = uuidv4()
  cookies().set('session-id', uuid)
  return uuid
}

export async function shorten(formData: FormData) {
  const ipAddress = getIp()
  if (ipAddress) {
    const { success, reset } = await ratelimit.limit(ipAddress)
    if (success) {
      let parsedData
      try {
        parsedData = schema.parse(formData)
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
        } else {
          const sessionId = getSessionId()
          await redis.sadd(`session:${sessionId}`, hash)
        }
      }
      revalidatePath('/')
    } else {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: { 'Retry-After': reset.toString() },
      })
    }
  }
  return new NextResponse('Invalid request', { status: 400 })
}
