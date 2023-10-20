import { error, json } from '@sveltejs/kit'

export const POST = async ({ request, fetch }) => {
  const data = await request.json()
  if (!isValid(data)) throw error(400)

  try {
    // TODO: use sveltekit's fetch instead of axios
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${data.title}\n\n${data.body}`,
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return json({ summary: response.data.choices[0].text.trim() })
  } catch (error) {
    return json({ error: 'Failed to generate summary. Please try again later.' }, { status: 500 })
  }
}

function isValid(d: Record<string, unknown>): d is { title: string; body: string } {
  return typeof d.title === 'string' && typeof d.body === 'string'
}
