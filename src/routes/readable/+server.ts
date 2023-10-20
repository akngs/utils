import { error } from '@sveltejs/kit'

import { makeReadable } from '$lib/readability.js'

/**
 * Fetches a URL, parses the HTML response into a readable format, and returns a new response with the parsed HTML in JSON format.
 * @param {Object} param - The parameter object.
 * @param {URLSearchParams} param.url - The URLSearchParams object with a 'url' search parameter.
 * @param {Function} param.fetch - The fetch function.
 * @returns {Promise<Response>} A Promise that resolves to a Response object with the parsed HTML in JSON format.
 * @throws {Error} Throws an error if the URL parameter is missing or if the fetch request fails.
 */
export const GET = async ({ url, fetch }) => {
  const u = url.searchParams.get('url')
  if (!u) throw error(400, 'url parameter is missing')

  const res = await fetch(u)
  if (!res.ok) throw error(400, `Failed to fetch url. Status code: ${res.status}`)

  const html = await res.text()
  const parsed = makeReadable(html)
  return new Response(JSON.stringify(parsed), { headers: { 'content-type': 'application/json' } })
}
