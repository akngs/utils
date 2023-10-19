import { describe, expect, it } from 'vitest'

import { makeReadable } from './readability'

describe('readability', () => {
  it('should parse HTML', () => {
    const raw = '<head><title>Title</title></head><body><p>Hello <b>World</b></p></body>'
    const actual = makeReadable(raw)
    expect(actual.title).toEqual('Title')
    expect(actual.excerpt).toEqual('Hello World')
    expect(actual.htmlContent).toMatch('<p>Hello <b>World</b></p>')
    expect(actual.textContent).toMatch('Hello World')
    expect(actual.mdContent).toEqual('Hello **World**')
  })

  it('should sanitize HTML', () => {
    const injection = '<img src=x onerror=alert(1) >'
    const raw = `<head><title>Title</title></head><body><p>${injection} Hello World</p></body>`
    const actual = makeReadable(raw)
    expect(actual.htmlContent).not.toMatch(/alert\(1\)/)
  })
})
