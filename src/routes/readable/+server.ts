import { error } from '@sveltejs/kit'

import { makeReadable } from '$lib/readability.js'

export const GET = async ({ url, fetch }) => {
  const u = url.searchParams.get('url')
  if (!u) throw error(400)

  const res = await fetch(u)
  const html = await res.text()
  const parsed = makeReadable(html)
  return new Response(JSON.stringify(parsed), { headers: { 'content-type': 'application/json' } })
}
