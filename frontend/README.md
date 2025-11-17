# Rock Paper Scissors - Frontend

React + TypeScript + Vite frontend for the Rock-Paper-Scissors game.

## Architecture

The frontend follows React best practices with a component-based architecture:

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── GameBoard.tsx   # Main game interface
│   │   ├── GameResult.tsx  # Result display
│   │   └── GameStatistics.tsx  # Stats tracking
│   ├── services/          # External services
│   │   └── api.ts         # Backend API client
│   ├── types/             # TypeScript definitions
│   │   └── game.ts        # Game type definitions
│   ├── styles/            # CSS styles
│   │   └── App.css        # Main stylesheet
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Vite type definitions
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## Components

### GameBoard (`components/GameBoard.tsx`)

Main game interface component.

**Responsibilities:**
- Manages game state (result, loading, error, statistics)
- Handles user interactions (choice selection)
- Coordinates child components
- Communicates with backend API

**Features:**
- Choice buttons with emoji icons
- Loading states during API calls
- Error handling and display
- Statistics tracking
- Play again functionality

### GameResult (`components/GameResult.tsx`)

Displays the result of a game round.

**Props:**
- `result`: PlayResponse object
- `choiceIcons`: Record of choice to emoji mapping

**Features:**
- Visual comparison of player vs computer choice
- Color-coded outcome (win=green, lose=red, draw=orange)
- Descriptive result message

### GameStatistics (`components/GameStatistics.tsx`)

Tracks and displays game statistics.

**Props:**
- `stats`: GameStats object with wins/losses/draws/total
- `onReset`: Callback for resetting statistics

**Features:**
- Win/loss/draw counters
- Total games played
- Win percentage calculation
- Statistics reset button

## Type System

### Type Definitions (`types/game.ts`)

All TypeScript types mirror the backend API schema:

```typescript
type Choice = 'rock' | 'paper' | 'scissors';
type Outcome = 'win' | 'lose' | 'draw';

interface PlayRequest {
  choice: Choice;
}

interface PlayResponse {
  player_choice: Choice;
  computer_choice: Choice;
  outcome: Outcome;
  message: string;
}

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}
```

### Benefits
- Compile-time type checking
- IntelliSense/autocomplete support
- Prevents type-related bugs
- Self-documenting code

## API Service

### GameApiClient (`services/api.ts`)

Centralized API client for backend communication.

**Features:**
- Axios-based HTTP client
- Type-safe request/response handling
- Custom error handling with ApiError class
- Response interceptors for global error handling
- Singleton pattern for shared instance

**Methods:**

```typescript
// Play a game round
async play(choice: Choice): Promise<PlayResponse>

// Get valid choices
async getChoices(): Promise<ChoicesResponse>

// Health check
async healthCheck(): Promise<boolean>
```

**Error Handling:**
- Throws `ApiError` with descriptive messages
- Handles network errors
- Handles server errors
- Provides status codes and details

## Styling

### CSS Architecture (`styles/App.css`)

Modern, responsive CSS with CSS variables.

**Design System:**
- CSS custom properties for theming
- Consistent spacing scale
- Color palette for outcomes (success/danger/warning)
- Smooth transitions and animations
- Mobile-responsive grid layouts

**Features:**
- Dark theme
- Hover effects and animations
- Responsive design (desktop and mobile)
- Accessible color contrasts
- Consistent border radius and spacing

## State Management

Uses React hooks for local state management:

- `useState`: Component state (result, loading, error, stats)
- `useEffect`: Side effects (health check on mount)

**State Flow:**
1. User clicks choice button
2. Component sets loading state
3. API call to backend
4. Update result and statistics
5. Clear loading state
6. Display result

## Development

### Running Dev Server

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:5173`

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh
- Instant updates on save
- Source maps for debugging

### Building for Production

```bash
npm run build
```

**Output:**
- Optimized bundle in `dist/`
- Minified and tree-shaken code
- Source maps for debugging
- Assets with cache-busting hashes

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Linting

```bash
npm run lint
```

Runs ESLint with TypeScript support:
- Catches potential bugs
- Enforces code style
- Validates React hooks usage
- TypeScript-aware linting

## Configuration

### Vite Config (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

**Features:**
- React plugin for fast refresh
- Proxy for API requests (avoids CORS in dev)
- Custom port configuration
- Build optimizations

### TypeScript Config (`tsconfig.json`)

Strict TypeScript configuration:
- Strict mode enabled
- No unused locals/parameters
- Force consistent casing
- ES2020 target
- JSX support

## Best Practices Implemented

### React Best Practices
- Functional components with hooks
- Proper prop typing
- Component composition
- Separation of concerns
- Controlled components

### TypeScript Best Practices
- Strict type checking
- Interface definitions
- Type inference
- Generic types
- Enum usage

### Performance Best Practices
- Lazy loading potential
- Minimal re-renders
- Optimized bundle size
- Tree shaking
- Code splitting ready

### Accessibility (a11y)
- Semantic HTML
- ARIA labels
- Role attributes
- Keyboard navigation support
- Error announcements

### Code Quality
- ESLint configuration
- Consistent code style
- Comprehensive comments
- Self-documenting code
- Error boundaries ready

## Browser Support

Supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Environment Variables

Vite supports `.env` files:

```env
# API URL (optional, defaults to localhost:8000)
VITE_API_URL=http://localhost:8000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## Troubleshooting

### Backend Connection Issues

If you see "Backend is offline":
1. Ensure backend is running on port 8000
2. Check CORS configuration in backend
3. Verify network connectivity
4. Check browser console for errors

### Build Errors

If build fails:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Type Errors

If TypeScript errors occur:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Restart TypeScript server in editor
# VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## Testing

### Future Testing Setup

Recommended testing stack:
- **Vitest**: Unit testing (Vite-native)
- **React Testing Library**: Component testing
- **Playwright/Cypress**: E2E testing

Example test structure:
```typescript
import { render, screen } from '@testing-library/react';
import GameBoard from './GameBoard';

test('renders game choices', () => {
  render(<GameBoard />);
  expect(screen.getByText('rock')).toBeInTheDocument();
});
```

## Performance Optimization

Current optimizations:
- Vite's fast HMR
- Code splitting ready
- Tree shaking enabled
- Minification in production
- Asset optimization

Future optimizations:
- React.memo for expensive components
- useMemo/useCallback for optimization
- Virtual scrolling (if needed)
- Service worker for offline support

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The `dist/` folder can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Copy `dist/` to gh-pages branch
- **AWS S3**: Upload `dist/` contents
- **nginx**: Serve `dist/` folder

Example nginx config:
```nginx
server {
  listen 80;
  root /path/to/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Future Enhancements

Potential improvements:

1. **Animations**: Add framer-motion for smooth transitions
2. **Sound Effects**: Add audio feedback
3. **Themes**: Light/dark theme toggle
4. **PWA**: Progressive Web App support
5. **i18n**: Internationalization support
6. **Analytics**: Track user interactions
7. **Social Sharing**: Share results on social media
8. **Leaderboards**: Global rankings (requires backend changes)

## Dependencies

Key dependencies:

- **react**: UI library
- **react-dom**: DOM rendering
- **axios**: HTTP client
- **typescript**: Type safety
- **vite**: Build tool
- **@vitejs/plugin-react**: React plugin for Vite

Dev dependencies:

- **@types/react**: React type definitions
- **@types/react-dom**: React DOM type definitions
- **eslint**: Linting
- **@typescript-eslint/\***: TypeScript ESLint plugins

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Axios Documentation](https://axios-http.com/docs/intro)
