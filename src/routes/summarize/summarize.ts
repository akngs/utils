import { json } from '@sveltejs/kit'
import axios from 'axios'

export async function post(request) {
  const { title, body } = request.body

  if (typeof title !== 'string' || typeof body !== 'string') {
    return json({ error: 'Invalid request payload. Title and body must be strings.' }, { status: 400 })
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${title}\n\n${body}`,
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
