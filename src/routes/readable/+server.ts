import { error } from '@sveltejs/kit'

import { makeReadable } from '$lib/readability.js'

export const GET = async ({ url, fetch }) => {
  const u = url.searchParams.get('url')
  if (!u) throw error(400, 'url parameter is missing')

  const res = await fetch(u)
  if (!res.ok) throw error(400, `Failed to fetch url. Status code: ${res.status}`)

  const html = await res.text()
  const parsed = makeReadable(html)
  return new Response(JSON.stringify(parsed), { headers: { 'content-type': 'application/json' } })
}
