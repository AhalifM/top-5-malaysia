# Live TikTok Stats Design

## Goal

Show live TikTok view and like counts on each portfolio card while keeping the landing page fast.

## Recommended Approach

Use the official TikTok API from a server route and cache responses. The client carousel should keep rendering lightweight thumbnail cards, then request stats from a local endpoint. The endpoint fetches `view_count` and `like_count` for the portfolio video IDs, normalizes the response, and returns display-ready stats.

## Alternatives Considered

1. **Official TikTok API with server caching**
   - Pros: most reliable, platform-compliant, avoids exposing credentials, preserves fast page load.
   - Cons: requires TikTok developer credentials and token handling.

2. **Third-party TikTok stats provider**
   - Pros: often quicker to integrate.
   - Cons: adds vendor cost, privacy/trust questions, and another uptime dependency.

3. **Embed/script extraction**
   - Pros: avoids API credentials.
   - Cons: slow, fragile, and likely to break as TikTok changes markup.

## Architecture

- Add a server API route such as `src/app/api/tiktok-stats/route.ts`.
- Extract TikTok video IDs from portfolio `videoLink` values.
- The client requests stats by ID from the local route after the carousel loads near the viewport.
- The route calls TikTok using environment-provided credentials or access token.
- Cache successful responses to avoid slowing repeat page views and to reduce API quota pressure.

## UI

Each portfolio thumbnail card keeps its current visual shape. Add a compact stat row near the bottom overlay with an eye icon for views and a heart icon for likes. If stats are still loading, show a quiet placeholder. If TikTok fails, omit the stats row or show `--` without blocking the card.

## Data And Errors

The stats API should return a predictable object keyed by video ID:

```json
{
  "7595535263493885205": {
    "views": 123456,
    "likes": 7890
  }
}
```

If credentials are missing or TikTok returns an error, the route should return a safe empty result or per-video errors with a non-crashing client fallback.

## Testing

- Unit-test video ID extraction and stat formatting.
- Test the API route behavior for missing credentials, successful TikTok response, and failed TikTok response.
- Verify production build and a browser pass of the portfolio section.
