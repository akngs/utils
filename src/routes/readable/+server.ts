import { error, json } from '@sveltejs/kit'

import { SECRET } from '$env/static/private'
import { makeReadable } from '$lib/readability.js'

/**
 * Returns the readability enhanced version of the given URL.
 */
export const GET = async ({ url, fetch, request }) => {
  const authr = request.headers.get('authorization')
  if (authr !== SECRET) throw error(401, 'Unauthorized')

  const u = url.searchParams.get('url')
  if (!u) throw error(400, 'url parameter is missing')

  const res = await fetch(u)
  if (!res.ok) throw error(502, `Failed to fetch url. Status code: ${res.status}`)

  const html = await res.text()
  const parsed = makeReadable(html)
  return json(parsed)
}
