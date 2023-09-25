import { cookies } from 'next/headers'
import { redis } from './utils'
import config from './config'
import { shorten } from './actions'
import CopyButton from './components/CopyButton'

async function getShortenedUrls() {
  const sessionId = cookies().get('session-id')
  if (sessionId) {
    const sessionId = cookies().get('session-id')
    return await redis.smembers(`session:${sessionId}`)
  }
}

export default async function Home() {
  const shortenedUrls = await getShortenedUrls()
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center gap-16 px-10 py-40">
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800">
            🔗
          </div>
          <h1
            className={`mb-1 text-2xl font-extrabold tracking-wider text-neutral-300 sm:mb-2 sm:text-4xl`}
          >
            SMIJ
          </h1>
        </div>
        <span className="text-sm text-neutral-500">
          A simple URL shortener built by{' '}
          <a
            href="https://mattbeiswenger.com"
            target="_blank"
            rel="noopener"
            className="font-medium text-neutral-400 transition-colors hover:text-neutral-300"
          >
            Matt Beiswenger
          </a>
        </span>
      </div>
      <form action={shorten} className="flex w-full max-w-xs flex-col items-center gap-3">
        <input
          name="url"
          type="url"
          placeholder="Enter a URL"
          className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-200 px-3 text-neutral-900 outline-none placeholder:text-neutral-500"
          required
          autoFocus
        />
        <button
          type="submit"
          className="h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 text-neutral-100 shadow-sm"
        >
          Shorten
        </button>
      </form>
      <div className="flex w-full max-w-xs flex-col gap-2">
        {shortenedUrls &&
          shortenedUrls.map((hash: any) => (
            <div
              key={hash}
              className="flex items-center justify-between rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2"
            >
              <a
                href={`${config.HOSTNAME}/${hash}`}
                target="_blank"
                rel="noopener"
                className="font-medium text-neutral-300 transition-colors hover:text-neutral-300"
              >
                {config.HOSTNAME}/{hash}
              </a>
              <CopyButton value={`${config.HOSTNAME}/${hash}`} />
            </div>
          ))}
      </div>
    </main>
  )
}
