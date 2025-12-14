# Minance Frontend

The frontend application for Minance, built with React, TypeScript, and Vite.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Tremor (for charts)

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

The development server will start at http://localhost:3000

### Building

Create production build:

```bash
npm run build
```

Build output will be in the `dist` directory.

### Testing

Run tests:

```bash
npm run test
```

For a tight TDD loop, keep Vitest in watch mode:

```bash
npm run test -- --watch
```

Network calls in tests are intercepted by Mock Service Worker (see `src/test/setup.ts`), so suites stay deterministic without needing the Quarkus backend.

Component-level visual checks use Playwright Component Testing:

```bash
npm run test:ct
```

## Project Structure

```
webui/
├── src/
│   ├── components/     # React components
│   ├── services/      # API services
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
└── dist/             # Build output
```

## License

MIT License - See [LICENSE](LICENSE) for details
