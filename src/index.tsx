import * as elements from 'typed-html'
import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'
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
    async ({ html, cookie: { userSession } }) => {
      let { value: sessionId } = userSession
      if (!sessionId) {
        sessionId = randomUUID()
        userSession.set({ value: sessionId })
      }
      const shortenedUrls = sessionId
        ? await redis.zrange(`session:${sessionId}`, 0, -1, 'REV')
        : []

      return html(
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
        </BaseHtml>,
      )
    },
    { cookie },
  )
  .post(
    '/shorten',
    async ({ body: { url }, cookie: { userSession }, set }) => {
      const { value: sessionId } = userSession
      // Use hardcoded identifier if session id is not set
      // Will update to use request ip once bun supports it
      const identifier = sessionId ?? 'shorten'
      const { success } = await ratelimit.limit(identifier)
      if (success) {
        const count = await redis.incr('count')
        const hash = base62.encode(count)
        const p = redis.pipeline()
        p.setnx(hash, url)
        p.zadd(`session:${sessionId}`, Date.now(), hash)
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
      const url = await redis.get(hash)
      if (url) {
        set.redirect = url
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
