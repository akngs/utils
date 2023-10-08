import { makeReadable } from '$lib/readability.js'

export const GET = async ({ params, fetch }) => {
  const res = await fetch(params.url)
  const html = await res.text()
  const parsed = makeReadable(html)
  return new Response(JSON.stringify(parsed), { headers: { 'content-type': 'application/json' } })
}
