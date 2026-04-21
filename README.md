# boilerplate-react-frontend

React + TypeScript frontend boilerplate ported from `boilerplate-vue-frontend`.

## Stack

- React 19 + TypeScript + Vite
- React Router (module-based route definitions)
- Zustand (primary state management)
- Redux Toolkit (secondary/example only)
- Vitest for unit tests

## Setup

```bash
npm ci
npm run dev
```

## Scripts

- `npm run dev` - start Vite dev server
- `npm run lint` - run ESLint
- `npm run test` - run unit tests
- `npm run typecheck` - run TypeScript project checks
- `npm run build` - typecheck + production build
- `npm run preview` - preview production build

## Architecture

- `src/router` - route modules (`accountRoutes`, `usersRoutes`, etc.) + root router
- `src/layouts` - page shell (`LayoutDefault`) with global navigation, toasts, and loaders
- `src/components` - reusable TSX atoms/organisms
- `src/stores` - domain Zustand stores (counter/profile/users/products/cart/orders)
- `src/toolkit/react-toolkit.ts` - React equivalents of shared toolkit concepts (`core`, `notifications`)
- `src/redux` - Redux Toolkit example store + slice
- `src/views` - page-level TSX views grouped by domain

## State management

### Primary: Zustand

Zustand is the default architecture. Pinia-style stores were ported into typed Zustand stores with explicit actions/selectors, for example:

- `useCounterStore` (`count`, `doubleCount`, `increment`, `incrementDelayed`)
- `useProfileStore` auth/profile actions
- domain stores for users/products/cart/orders

### Secondary example: Redux Toolkit

Redux is included as a self-contained example and not as the primary architecture:

- `src/redux/store.ts` - minimal RTK store setup
- `src/redux/exampleSlice.ts` - sample slice
- `src/views/core/ReduxExample.tsx` - sample dispatch/select usage route (`/:locale/redux-example`)

## Vue → React mapping used in this port

- `ref` → `useState` / `useRef`
- `computed` → derived selectors or `useMemo`
- `watch` → `useEffect`
- lifecycle hooks (`onMounted` / `onUnmounted`) → `useEffect` with cleanup
- `provide/inject` → React context (`src/context/AppContext.tsx`)
- Pinia stores → Zustand stores
- vue-toolkit concepts → `react-toolkit`-style React/Zustand utilities in `src/toolkit/react-toolkit.ts`

## Notes for contributors

- Prefer Zustand for new app/domain state.
- Keep Redux usage limited to example/demo routes unless explicitly requested.
- Keep page components in TSX and match existing route module pattern.
