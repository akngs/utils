import { describe, expect, it } from 'vitest'

import { makeReadable } from './readability'

describe('readability', () => {
  it('HTML 파싱', () => {
    const raw = '<head><title>Title</title></head><body><h1>Hello</h1><p>Hello World</p></body>'
    const actual = makeReadable(raw)
    expect(actual.title).toEqual('Title')
  })

  it('Purify', () => {
    const injection = '<img src=x onerror=alert(1) >'
    const raw = `<head><title>Title</title></head><body><p>${injection} Hello World</p></body>`
    const actual = makeReadable(raw)
    expect(actual.htmlContent).not.toMatch(/alert\(1\)/)
  })
})
