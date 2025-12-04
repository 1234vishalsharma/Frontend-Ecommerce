# Development Notes

## Design Philosophy

ShopHub is built with simplicity and maintainability in mind. We avoid over-engineering where possible.

### Why MobX for the Cart?

Initially considered:
- Redux: Too much boilerplate for a simple cart
- Zustand: Good alternative, but MobX's reactivity model fits well with React 19
- Context API: Would cause too many re-renders for filter state

MobX lets us keep cart logic clean while ensuring the UI updates when cart items change.

### Why sessionStorage for Cart?

- **Not localStorage**: Cart shouldn't persist across sessions - user likely wants a fresh cart next time
- **Not cookies**: Too limited in size, adds HTTP overhead
- **Not server state**: No backend authentication, so we keep it client-side

The trade-off: cart is lost when the tab closes. This is intentional and matches typical e-commerce behavior.

### Filter State Persistence

Search query, category, and sort are persisted to sessionStorage so users don't lose their filters when navigating between product and home pages. This improves UX significantly.

## Common Tasks

### Adding a New Page

1. Create folder under `app/` (e.g., `app/wishlist/`)
2. Add `page.tsx` with `"use client"` directive
3. Import Header and Footer for consistency
4. Add route to Header navigation if needed

### Adding a New API Endpoint

1. Add function to `lib/api.ts`
2. Follow existing error handling pattern
3. Add TypeScript types if needed

### Styling Tips

- Use MUI `sx` prop for component-specific styles
- Use Tailwind classes for utility styles (spacing, etc.)
- Dark mode works automatically via MUI theme provider

## Testing Locally

The app uses the free Fake Store API. Response times are typically 200-500ms. Network tab is your friend if something seems slow.

## Performance Considerations

- Product images are served from fakestoreapi.com (no local optimization)
- MobX prevents unnecessary re-renders via fine-grained reactivity
- Next.js handles code splitting automatically

## Common Issues

**Issue**: Cart disappears when opening in new tab
**Solution**: This is expected - we use sessionStorage, not localStorage

**Issue**: Images take a while to load
**Solution**: Fake Store API images load from external CDN. In production, use next/image with local hosting.

**Issue**: Search/filters reset on page refresh
**Solution**: That's the intended behavior - the sessionStorage persists them actually. Check browser Storage tab.
