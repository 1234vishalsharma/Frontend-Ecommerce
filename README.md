# ShopHub - E-Commerce Store

A modern, fast e-commerce store built with Next.js 16, React 19, and TypeScript. Featuring a product catalog with filtering, search, and a persistent shopping cart.

## Features

- 🛍️ Product browsing with categories and search
- ⭐ Product ratings and detailed product pages
- 🛒 Shopping cart with quantity management (persisted to session)
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design (mobile-first)
- ⚡ Fast performance with Next.js 16 and React 19
- 🎨 Material-UI components with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Material-UI (MUI), Tailwind CSS
- **State Management**: MobX (reactive state)
- **API**: Fake Store API (https://fakestoreapi.com)
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone and install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx              # Home page with product listing
├── layout.tsx            # Root layout
├── providers.tsx         # Context providers (theme, mobx)
├── components/
│   ├── Header.tsx        # Navigation header with cart badge
│   └── Footer.tsx        # Footer with cart summary
├── cart/
│   └── page.tsx          # Shopping cart page
└── product/[id]/details/
    └── page.tsx          # Product detail page

lib/
├── store.ts              # MobX cart store
└── api.ts                # Fake Store API client

public/                   # Static assets
```

## Key Design Decisions

### State Management with MobX

We chose MobX for the cart because it's lightweight and pairs well with React 19's reactivity patterns. The cart persists to sessionStorage automatically.

### Session Storage vs. LocalStorage

Cart data is stored in sessionStorage (not localStorage) to avoid persisting stale cart data across browser sessions. This works better for a typical e-commerce flow.

### API Layer

The `lib/api.ts` file wraps axios calls to the Fake Store API. This keeps API logic separate from components and makes it easier to swap providers later.

## Known Limitations

- Cart doesn't persist across browser tabs (sessionStorage limitation - intentional)
- Checkout flow not implemented (placeholder button)
- No user authentication
- No real payment processing

## Future Improvements

- [ ] Add user authentication & accounts
- [ ] Real checkout with Stripe integration
- [ ] Order history & tracking
- [ ] Product reviews & ratings from users
- [ ] Wishlist/saved items
- [ ] Product recommendations
- [ ] Inventory management

## Environment Variables

Currently using the public Fake Store API. No env vars required.

To use a custom API, create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

## License

MIT
