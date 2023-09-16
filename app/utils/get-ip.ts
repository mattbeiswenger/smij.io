import { NextRequest } from 'next/server'
import { Request, getClientIp } from 'request-ip'

/**
 * Types for request-ip library don't play well with NextRequest
 * headers so some conversion is needed
 */

export function getIp(nextRequest: NextRequest) {
  const request: Request = {
    ...nextRequest,
    headers: {
      'x-client-ip': nextRequest.headers.get('x-client-ip') || undefined,
      'x-forwarded-for': nextRequest.headers.get('x-forwarded-for') || undefined,
      'x-real-ip': nextRequest.headers.get('x-real-ip') || undefined,
      'x-cluster-client-ip': nextRequest.headers.get('x-cluster-client-ip') || undefined,
      'x-forwarded': nextRequest.headers.get('x-forwarded') || undefined,
      'forwarded-for': nextRequest.headers.get('forwarded-for') || undefined,
      forwarded: nextRequest.headers.get('forwarded') || undefined,
    },
  }
  return getClientIp(request)
}
