import { describe, expect, it } from 'vitest'

import { makeReadable } from './readability'

describe('readability', () => {
  it('should be true', () => {
    const raw = '<head><title>Title</title></head><body><h1>Hello</h1><p>Hello World</p></body>'
    const actual = makeReadable(raw)
    expect(actual.title).toEqual('Title')
  })
})
