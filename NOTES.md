# Developer Notes

## Quick Start Reminder

After cloning:
```bash
npm install
npm run dev
```

Then open http://localhost:3000

## What to Change if This Goes to Production

### 1. API Integration
- Replace `https://fakestoreapi.com` with your actual backend
- Update `lib/api.ts` with real endpoints
- Add authentication tokens to axios requests if needed

### 2. Environment Configuration
```bash
# Create .env.local with:
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # For analytics if needed
```

### 3. Theme Customization
- Update primary/secondary colors in `app/providers.tsx`
- Add your brand fonts to `app/layout.tsx`
- Update the "ShopHub" name in `app/components/Header.tsx`

### 4. Session Storage → Real Persistence
Current flow: sessionStorage (loses on tab close)

To keep cart across sessions, you have two options:
a) Use localStorage instead (users might not want this)
b) Server-side carts (requires authentication)

See `lib/store.ts` comment explaining the choice.

## Development Workflow

1. **Adding a new page?** Create folder under `app/`, add `page.tsx` with `"use client"`
2. **New API endpoint?** Add function to `lib/api.ts` following existing pattern
3. **New component?** Create in `app/components/` with JSDoc comment
4. **Styling?** Use MUI `sx` prop first, fallback to Tailwind classes

## Testing Checklist

Before launching:
- [ ] Test on mobile (< 375px wide)
- [ ] Test on tablet (768px+)
- [ ] Test desktop view
- [ ] Toggle dark/light mode on each page
- [ ] Add to cart, go to cart, modify quantities, remove items
- [ ] Clear sessionStorage and refresh - cart should be gone
- [ ] Visit product detail, go back - filters should persist
- [ ] Search works correctly
- [ ] Category filter works
- [ ] Sort options work
- [ ] All navigation links work
- [ ] No console errors or warnings

## Performance Notes

The app loads products on page mount. If you add pagination:
- Load more products as user scrolls (infinite scroll)
- Or use page-based pagination with URL params
- Consider caching results to avoid duplicate API calls

## Common Gotchas

1. **"use client" directive**: Needed for interactive features. Add at top of file.
2. **MobX observer()**: Needed to make components re-render when store changes
3. **sessionStorage cleared**: This is intentional on tab close
4. **Images slow?**: They come from fake API. Use next/image + local hosting in production.
5. **Theme doesn't change?** Check that Providers wraps children in layout.tsx

## If You Get Stuck

- Check browser console for errors
- Check Network tab for failed API calls
- Make sure you ran `npm install`
- Check that you're on http://localhost:3000 (not localhost:3001, etc.)
- Try clearing `.next` folder and restarting dev server

## Next Steps for Production

1. Set up proper error handling (Error Boundaries, toast notifications)
2. Add analytics (Google Analytics or similar)
3. Set up monitoring (Sentry, LogRocket)
4. Configure caching headers properly
5. Set up automated testing (Jest + React Testing Library)
6. Add E2E tests (Playwright or Cypress)
7. Set up deployment pipeline (GitHub Actions, Vercel, etc.)

---

**Project created:** December 2024
**Last modified:** December 2024
