import { redirect } from 'next/navigation'
import { redis } from '../utils'

export default async function Hash({ params }: { params: { hash: string } }) {
  const hash = await redis.get<string>(params.hash)
  if (hash) {
    redirect(hash)
  }
}
