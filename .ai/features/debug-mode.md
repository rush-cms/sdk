# Debug Mode

## Overview
Debug Mode provides visibility into the internal operations of the SDK, such as API requests, response times, and cache behavior. This is crucial for developers debugging integration issues or performance bottlenecks.

## How it works
When enabled, the `RushCMSClient` wraps internal logging calls and outputs them to the console with a `[RushCMS]` prefix.

It logs:
- **Requests**: Method and URL (`GET /api/v1/entries`).
- **Responses**: Status code and duration (`200 OK (15ms)`).
- **Cache**: Hits and Misses (`Cache HIT: key`).
- **Errors**: Detailed error messages.

## Usage

Enable it via the client configuration:

```typescript
const client = new RushCMSClient({
    token: 'YOUR_TOKEN',
    debug: true // defaults to false
})
```

## Example Output
```bash
[RushCMS] Request: GET /api/v1/collections/1/entries
[RushCMS] Cache MISS: rushcms:entries:1:all
[RushCMS] Response: 200 (45ms)
```
