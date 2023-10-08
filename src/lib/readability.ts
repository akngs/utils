import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export type ReadableContent = {
  title: string
  htmlContent: string
  textContent: string
  excerpt: string
}

export function makeReadable(html: string): ReadableContent {
  const doc = new JSDOM(html).window.document
  const reader = new Readability(doc)
  const parsed = reader.parse()

  return {
    title: parsed?.title ?? '',
    htmlContent: parsed?.content ?? html,
    textContent: parsed?.textContent ?? '',
    excerpt: parsed?.excerpt ?? '',
  }
}
