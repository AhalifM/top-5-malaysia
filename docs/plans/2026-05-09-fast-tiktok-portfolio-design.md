# Fast TikTok Portfolio Design

## Goal

Make the portfolio section load quickly and avoid getting stuck when the browser tab is hidden or changed while TikTok embeds are loading.

## Problem

The current portfolio carousel renders multiple TikTok blockquote embeds and asks TikTok's third-party script to hydrate them. TikTok then creates iframes and fetches its own assets. Safari and other browsers throttle third-party iframe/script work when a tab is hidden, so switching tabs mid-load can pause the embed script and leave the carousel in a loading state.

## Recommended Approach

Use a thumbnail-first carousel and load a real TikTok embed only for the active slide.

- Render every slide immediately as a local thumbnail card using `item.thumbnail`.
- Keep Swiper controls, coverflow, pagination, and autoplay.
- For the centered active slide, replace the thumbnail with TikTok's embed markup.
- Load TikTok's `embed.js` only after the carousel has appeared near the viewport.
- On `visibilitychange`, when the document becomes visible again, ask TikTok to load embeds again and remount the active embed if it is still stuck.
- If the embed does not finish after a short timeout, keep the thumbnail card visible with a direct TikTok link.

## Alternatives Considered

1. **Load all TikTok embeds earlier**
   - Pros: Preserves native TikTok UI on every slide.
   - Cons: Slowest option, creates many iframes, still breaks when tabs are backgrounded.

2. **Thumbnail-only cards**
   - Pros: Fastest and most stable.
   - Cons: Removes TikTok's native like/comment/share UI.

3. **Official TikTok API stats**
   - Pros: Best for custom stats UI.
   - Cons: Requires TikTok app/token setup, which we do not want.

## UI Behavior

Non-active slides show thumbnail cards with a play affordance and title. The active slide attempts to show the real TikTok embed so users can see TikTok's own engagement UI. If TikTok is slow or paused by the browser, the user still sees the thumbnail rather than an empty loading shell.

## Data Flow

Portfolio data remains unchanged:

- `thumbnail`
- `videoLink`
- localized `title`

The component derives the TikTok video ID from `videoLink`. No API tokens, server route, or admin schema changes are needed.

## Testing

- Run `npm run lint`.
- Run `npm run build`.
- Browser-check the portfolio section.
- Test switching away from the tab while the portfolio is loading, then returning. The active slide should recover or show a thumbnail fallback instead of staying blank.
