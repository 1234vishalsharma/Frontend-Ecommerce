# Contributing to ShopHub

## Code Style

- Use TypeScript for all new code
- Use meaningful variable and function names
- Add JSDoc comments to public functions and components
- Use 2-space indentation
- Run ESLint before committing: `npm run lint`

## Component Guidelines

- All client components must have `"use client"` at the top
- Use MobX `observer()` wrapper for components that consume reactive state
- Import MUI components from `@mui/material`
- Use the `sx` prop for styling, not inline styles
- Components should have a JSDoc comment describing their purpose and features

## Git Workflow

1. Create a feature branch: `git checkout -b feature/description`
2. Make small, focused commits with clear messages
3. Push and open a pull request for review

### Commit Message Format

```
<type>: <description>

<optional body explaining why>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functional change)
- `docs`: Documentation updates
- `style`: Code style (formatting, missing semicolons, etc.)

Examples:
```
feat: add product wishlist functionality

fix: cart not persisting across page navigations

refactor: extract filter logic to custom hook

docs: update API client documentation
```

## Testing

This project currently uses the Fake Store API for development. When implementing real features:
- Test on mobile viewports (use Chrome DevTools)
- Test dark/light theme switching
- Test cart persistence across page navigations
- Verify error states (no network, invalid product ID, etc.)

## Questions?

Open an issue on the repository or reach out to the maintainers.
