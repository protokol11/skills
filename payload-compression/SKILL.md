---
name: payload-compression
description: Design dense tool, API, and MCP response payloads.
disable-model-invocation: true
---

# payload-compression

Cut tokens from structured payloads while keeping meaning intact. Use at design time, when you shape a tool, API, or MCP response.

## Done

The payload is done when every field earns its place and a repeated value appears once.

## Rules

1. **Shorten field names.** Rename verbose keys to the shortest unambiguous form. `confidence` -> `conf`, `fileLocation` -> `file`.
2. **Flatten nesting.** Drop wrapper objects. `{response:{data:{results:[...]}}}` -> `{results:[...]}`.
3. **Use a table for uniform rows.** One `cols` array plus `rows` arrays beats one object per row at 10+ rows.
4. **Send the needed fields.** Default to the minimal set. Serve the full record through `get_details(id)`.
5. **Reference repeated values.** Hoist a value that repeats into a `refs` map and point at it by key.

## Never compress

- Error text and error codes.
- Security fields.
- Code, exact identifiers, and paths the caller acts on byte-for-byte.

Meaning keeps the words a human must read exactly. Density applies to structure, not to meaning.

## Why

Density is understanding. A shorter description that still predicts the data means the structure is understood (Kolmogorov: the shortest program that outputs the data). Compression removes restatement, not information.

## Reference

Before/after example for each rule: [REFERENCE.md](REFERENCE.md).
