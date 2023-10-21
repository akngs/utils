import { error } from '@sveltejs/kit'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { OPENAI_API_KEY, SECRET } from '$env/static/private'
import { makeReadable } from '$lib/readability'

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

/**
 * Summarizes the given URL.
 */
export const GET = async ({ url, request }) => {
  const authr = request.headers.get('authorization')
  if (authr !== SECRET) throw error(401, 'Unauthorized')

  const urlParam = url.searchParams.get('url')
  if (!urlParam) throw error(400, 'url parameter is missing')

  const res = await fetch(urlParam)
  if (!res.ok) throw error(502, `Failed to fetch url. Status code: ${res.status}`)

  const html = await res.text()
  const parsed = makeReadable(html)
  return summarize(`${parsed.title}\n\n${parsed.mdContent}`)
}

/**
 * Summarizes the given text.
 */
export const POST = async ({ request }) => {
  const reqData = await request.json()
  if (!validateReqData(reqData)) throw error(400, 'Invalid request data')
  return summarize(reqData.content)
}

function validateReqData(reqData: Record<string, unknown>): reqData is { content: string } {
  return typeof reqData.content === 'string'
}

async function summarize(content: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      { role: 'system', content: 'You are a helpful chatbot. Your output is always a valid JSON array.' },
      { role: 'user', content: makePrompt(content) },
    ],
  })
  return new StreamingTextResponse(OpenAIStream(response))
}

/** Make Chain of Density prompt */
function makePrompt(article: string): string {
  return `
Take a deep breadth and read this article carefully.

<article>
${article}
</article>

Now, you will generate increasingly concise, entity-dense summaries of the above Article.

Repeat the following 2 steps 5 times.

Step 1. Identify 1-3 informative Missing Entities from the Article which are missing from the previously generated summary.
Step 2. Write a new, denser summary of identical length which covers every entity and detail from the previous summary plus the Missing Entities.

A Missing Entity is:

- Relevant: to the main story.
- Specific: descriptive yet concise (5 words or fewer).
- Novel: not in the previous summary.
- Faithful: present in the Article.
- Anywhere: located anywhere in the Article.

Guidelines:

- The first summary should be long (4-5 sentences, ~80 words) yet highly non-specific, containing little information beyond the entities marked as missing. Use overly verbose language and fillers (e.g., "this article discusses") to reach ~80 words.
- Make every word count: rewrite the previous summary to improve flow and make space for additional entities.
- Make space with fusion, compression, and removal of uninformative phrases like "the article discusses".
- The summaries should become highly dense and concise yet self-contained, e.g., easily understood without the Article.
- Missing Entities can appear anywhere in the new summary.
- Never drop Missing Entities from the previous summary. If space cannot be made, add fewer new Missing Entities.

Remember, use the exact same number of words for each summary.

The resulting JSON should be a list (length 5) of dictionaries whose keys are "missingEntities" and "denserSummary".
  `.trim()
}
