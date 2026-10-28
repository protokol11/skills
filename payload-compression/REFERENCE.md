# Reference — payload-compression

Before/after example for each rule. Numbers are token estimates from the original round, not measurements.

## 1. Shorten field names

Before:

```json
{
  "searchResults": [
    {
      "identifier": "a1b2",
      "symbolName": "authenticate",
      "fileLocation": "/src/models/user.ts",
      "lineNumber": 42,
      "confidenceScore": 0.95
    }
  ]
}
```

After:

```json
{
  "results": [
    { "id": "a1b2", "name": "authenticate", "file": "/src/models/user.ts", "line": 42, "conf": 0.95 }
  ]
}
```

## 2. Flatten nesting

Before:

```json
{ "response": { "data": { "results": { "items": [] } } } }
```

After:

```json
{ "results": [] }
```

## 3. Table for uniform rows

Before:

```json
[
  { "id": "a1", "name": "foo", "type": "fn" },
  { "id": "b2", "name": "bar", "type": "fn" },
  { "id": "c3", "name": "baz", "type": "fn" }
]
```

After:

```json
{
  "cols": ["id", "name", "type"],
  "rows": [
    ["a1", "foo", "fn"],
    ["b2", "bar", "fn"],
    ["c3", "baz", "fn"]
  ]
}
```

## 4. Send the needed fields

Before:

```json
{
  "id": "a1", "name": "authenticate", "type": "function", "file": "user.ts", "line": 42,
  "column": 5, "endLine": 48, "endColumn": 3, "signature": "...", "docs": "...",
  "created": "2024-01-15", "modified": "2024-02-10", "author": "...", "complexity": 7
}
```

After:

```json
{ "id": "a1", "name": "authenticate", "type": "function", "file": "user.ts", "line": 42 }
```

Serve the removed fields through a `get_details(id)` call when the caller needs them.

## 5. Reference repeated values

Before:

```json
{
  "results": [
    { "name": "User.authenticate", "file": "/very/long/path/to/src/models/user.ts", "package": "com.example.userservice" },
    { "name": "User.validate", "file": "/very/long/path/to/src/models/user.ts", "package": "com.example.userservice" }
  ]
}
```

After:

```json
{
  "refs": { "f1": "/very/long/path/to/src/models/user.ts", "p1": "com.example.userservice" },
  "results": [
    { "name": "User.authenticate", "file": "f1", "pkg": "p1" },
    { "name": "User.validate", "file": "f1", "pkg": "p1" }
  ]
}
```

## Boundary examples

Compress structure, keep meaning. Do not touch these:

```json
{ "error": "Authentication failed", "code": "AUTH_INVALID_CREDENTIALS" }
```

```json
{ "token": "<secret>", "scope": "admin" }
```

Code, exact identifiers, and paths the caller acts on stay byte-for-byte.
