import axios from 'axios'

import { post } from './summarize'

jest.mock('axios')

describe('/summarize endpoint', () => {
  it('validates the request payload', async () => {
    const response = await post({ body: { title: 123, body: 456 } })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid request payload. Title and body must be strings.' })
  })

  it('handles OpenAI API errors', async () => {
    ;(axios.post as jest.Mock).mockRejectedValueOnce(new Error('OpenAI API error'))
    const response = await post({ body: { title: 'Test title', body: 'Test body' } })
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Failed to generate summary. Please try again later.' })
  })

  it('returns a JSON response with a summary key on success', async () => {
    ;(axios.post as jest.Mock).mockResolvedValueOnce({ data: { choices: [{ text: 'Test summary' }] } })
    const response = await post({ body: { title: 'Test title', body: 'Test body' } })
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ summary: 'Test summary' })
  })
})
