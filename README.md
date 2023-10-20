# Utils

A suite of HTTP API utilities.

## APIs

### Readability

Returns the readability enhanced version of the given URL.

`GET /readable?url={url}`

Request:

```bash
curl -X GET \
  http://HOST/readable?url=https://google.com \
  -H 'Accept: application/json'
```

Response:

```json
{
  "title": "Google",
  "htmlContent": "Clean HTML version of the page",
  "textContent": "Text-only version of the page",
  "mdContent": "Markdown version of the page",
  "excerpt": "A short description of the page"
}
```
