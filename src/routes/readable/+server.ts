import { error, json } from '@sveltejs/kit'

import { makeReadable } from '$lib/readability.js'

/**
 * Returns the readability enhanced version of the given URL.
 */
export const GET = async ({ url, fetch }) => {
  const urlParam = url.searchParams.get('url')
  if (!urlParam) throw error(400, 'url parameter is missing')

  const res = await fetch(urlParam)
  if (!res.ok) throw error(502, `Failed to fetch url. Status code: ${res.status}`)

  const html = await res.text()
  const parsed = makeReadable(html)
  return json(parsed)
}
