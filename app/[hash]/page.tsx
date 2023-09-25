import { redirect } from 'next/navigation'
import { redis } from '../utils'

export default async function Hash({ params }) {
  const hash = await redis.get<string>(params.hash)
  if (hash) {
    redirect(hash)
  }
}
