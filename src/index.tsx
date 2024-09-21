import { Elysia, redirect, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { redis, ratelimit } from './redis'
import { randomUUID } from 'node:crypto'
import { BaseHtml } from './components/BaseHtml'
import { Header } from './components/Header'
import { Layout } from './components/Layout'
import { ShortenedUrl } from './components/ShortenedUrl'
import { base62 } from './utils'
import config from './config'

const cookie = t.Cookie({
  userSession: t.Optional(t.String()),
})

new Elysia()
  .use(html())
  .get(
    '/',
    async ({ cookie: { userSession } }) => {
      let { value: sessionId } = userSession
      if (!sessionId) {
        sessionId = randomUUID()
        userSession.set({ value: sessionId })
      }

      const shortenedUrls: string[] = sessionId
        ? await redis.zrange(`session:${sessionId}`, 0, -1, { rev: true })
        : []

      return (
        <BaseHtml>
          <Layout>
            <div class="grid w-full grid-cols-1 justify-between gap-10 md:grid-cols-2 md:gap-24 lg:gap-36">
              <Header />
              <ul id="shortened-urls" class="flex w-full flex-col gap-2">
                {shortenedUrls.map((url) => (
                  <ShortenedUrl url={`${config.HOSTNAME}/${url}`} />
                ))}
              </ul>
            </div>
          </Layout>
        </BaseHtml>
      )
    },
    { cookie },
  )
  .post(
    '/shorten',
    async ({
      body: { url },
      cookie: { userSession },
      set,
      server,
      request,
    }) => {
      const { value: sessionId } = userSession
      const ip = server?.requestIP(request)
      // Use either the session id or ip for rate limiting. 
      // Fallback to "session" if neither is available.
      const identifier = sessionId ?? ip?.address ?? 'session'
      const { success } = await ratelimit.limit(identifier)
      if (success) {
        const count = await redis.incr('count')
        const hash = base62.encode(count)
        const p = redis.pipeline()
        p.setnx(hash, url)
        p.zadd(`session:${sessionId}`, { score: Date.now(), member: hash })
        await p.exec()
        return <ShortenedUrl url={`${config.HOSTNAME}/${hash}`} />
      }
      set.status = 429
      return 'Too many requests'
    },
    {
      type: 'application/x-www-form-urlencoded',
      body: t.Object({
        url: t.RegExp(
          'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)',
        ),
      }),
      cookie,
    },
  )
  .get(
    '/:hash',
    async ({ params: { hash }, set }) => {
      const url: string | null = await redis.get(hash)
      if (url) {
        redirect(url)
      } else {
        set.status = 404
        return 'Not found'
      }
    },
    {
      params: t.Object({
        hash: t.String(),
      }),
    },
  )
  .get('/styles.css', () => Bun.file('./tailwind-gen/styles.css'))
  .listen(3000, () => console.log('🚀 Listening on port 3000...'))
