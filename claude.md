# UTS DPM Frontend

Angular 21 web application for departmental performance management with signals architecture, Tailwind CSS 4, and custom UI components.

## Files

| File | What | When to read |
| --- | --- | --- |
| `README.md` | Project overview, setup, architecture, deployment | Getting started, understanding system design, deploying |
| `DESIGN_SYSTEM.md` | Design tokens, color palette, typography, component variants | Styling components, adding UI elements, fixing visual issues |
| `angular.json` | Angular CLI configuration, build options | Modifying build process, adding assets, changing output paths |
| `tsconfig.json` | TypeScript compiler options | Fixing type errors, adjusting strict mode |
| `package.json` | Dependencies, npm scripts | Adding packages, running commands |
| `eslint.config.mjs` | ESLint rules, code style | Fixing lint errors, adjusting rules |
| `tailwind.config.js` | Tailwind theme customization | Extending design tokens, adding utilities |

## Directories

| Directory | What | When to read |
| --- | --- | --- |
| `src/app/` | Main application code, components, services | Any feature work |
| `src/app/auth/` | Authentication module (login, guards, interceptors) | Auth issues, login flow changes |
| `src/app/dpms/` | DPM management features (create, edit, approve) | DPM functionality changes |
| `src/app/users/` | User management features | User CRUD operations |
| `src/app/ui/` | Reusable UI components library | Building UI, fixing component issues |
| `src/app/services/` | API services, business logic | API integration, data fetching |
| `src/app/models/` | TypeScript interfaces and DTOs | Type definitions, API contracts |
| `src/app/shared/` | Shared utilities, pipes, directives | Cross-cutting concerns |
| `src/app/error-pages/` | Error page components (404, 403) | Error handling UI |
| `docs/` | Development documentation, history | Understanding project evolution |

## Test Credentials

Username: test@account.com
Password: testAccount

This account has full admin access for development and testing.

## Workflow Requirements

### Visual Validation

**Always use Chrome DevTools MCP** to validate UI changes before marking work complete.

**Avoiding API image size limits:**
- Use `take_snapshot` for layout/structure verification (no image limits)
- When screenshots are needed for visual styling:
  - First resize viewport: `resize_page` with max 1400x900
  - Never use `fullPage: true`
  - Target specific elements with `uid` parameter when possible
  - Save to file with `filePath` parameter for large captures

**Validation checklist:**
- Take snapshots to verify layout and structure
- Take viewport screenshots (resized) to verify visual styling
- Check console for errors after changes
- Verify responsive behavior at different viewports
- Test interactive elements (modals, dropdowns, tabs)

### Issue Investigation

When investigating bugs or issues:

1. Use Chrome DevTools to reproduce and inspect
2. Check console errors and network requests
3. Inspect element styles and computed values
4. Read relevant source files to understand context

## Build Commands

```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
npm run lint     # Lint code
```
