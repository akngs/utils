import { Readability } from '@mozilla/readability'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

export type ReadableContent = {
  title: string
  htmlContent: string
  textContent: string
  excerpt: string
}

export function makeReadable(html: string): ReadableContent {
  const sanitized = createDOMPurify(new JSDOM('').window).sanitize(html, { WHOLE_DOCUMENT: true })
  const doc = new JSDOM(sanitized).window.document
  const reader = new Readability(doc)
  const parsed = reader.parse()

  return {
    title: parsed?.title ?? '',
    htmlContent: parsed?.content ?? html,
    textContent: parsed?.textContent ?? '',
    excerpt: parsed?.excerpt ?? '',
  }
}
