# Utils

A suite of HTTP API utilities.

## APIs

### POST /summarize

This endpoint receives a JSON payload containing the title and body of an article and returns a summarized version of the text.

#### Request Payload

```json
{
  "title": "string",
  "body": "string"
}
```

#### Response

```json
{
  "summary": "string"
}
```

#### Example

##### Example Request

```json
{
  "title": "Example Title",
  "body": "This is an example body of an article. It contains multiple sentences and paragraphs."
}
```

##### Example Response

```json
{
  "summary": "This is an example summary of the article."
}
```
