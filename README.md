# boilerplate-react-frontend

React + TypeScript frontend boilerplate with:

- Vite
- Zustand
- React Router
- OpenAPI-generated axios client
- Vitest + Cypress
- Example Redux module (documented for study)

## Requirements

- Node.js 22+
- npm

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Create your environment file:
   ```bash
   cp .env-example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: type-check + build
- `npm run preview`: preview built app
- `npm run lint`: run ESLint
- `npm run lint:fix`: run ESLint autofix
- `npm run prettier`: run Prettier check
- `npm run prettier:fix`: run Prettier write
- `npm run test:unit`: run Vitest unit tests
- `npm run test:e2e`: run Cypress e2e tests
- `npm run genapi`: regenerate API client from `openapi.yaml`

## Architecture overview

- `/src/router`: React Router route tree
- `/src/stores`: Zustand stores (Pinia replacement)
- `/src/redux-example`: commented Redux store/slice/hooks for study
- `/src/pages`: route-level TSX pages
- `/src/components`: reusable TSX UI components
- `/src/utils/http.ts`: shared axios instance and interceptors
- `/src/utils/api.ts`: generated API class wiring
- `/api`: OpenAPI-generated TypeScript axios client
