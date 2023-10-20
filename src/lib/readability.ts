import { Readability } from '@mozilla/readability'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export type ReadableContent = {
  title: string
  htmlContent: string
  textContent: string
  mdContent: string
  excerpt: string
}

/**
 * Sanitizes and parses the input HTML string, and returns a `ReadableContent` object containing the title, HTML
 * content, text content, markdown content, and excerpt of the parsed document.
 *
 * @param {string} html - The HTML string to be parsed.
 */
export function makeReadable(html: string): ReadableContent {
  const sanitized = createDOMPurify(new JSDOM('').window).sanitize(html, { WHOLE_DOCUMENT: true })
  const doc = new JSDOM(sanitized).window.document
  const reader = new Readability(doc)
  const parsed = reader.parse()

  return {
    title: parsed?.title ?? '',
    htmlContent: parsed?.content ?? html,
    textContent: parsed?.textContent ?? '',
    mdContent: new TurndownService().turndown(parsed?.content ?? ''),
    excerpt: parsed?.excerpt ?? '',
  }
}
