# Architecture Documentation

## Overview

The 90 Days Ascension Journey Dashboard is a React-based single-page application (SPA) built with modern web technologies. It follows a component-based architecture with clear separation of concerns.

## Frontend Architecture

### Component Hierarchy

```
App
├── ThemeProvider (Context)
├── ErrorBoundary
├── Router
│   └── DashboardLayout
│       ├── Sidebar
│       ├── TopNav
│       └── Routes
│           ├── HomePage
│           ├── JourneyDetail
│           ├── AchievementsPage
│           ├── ProfilePage
│           └── SettingsPage
```

### State Management

#### Local State
- Component-level state using `useState`
- Form state managed locally
- UI state (modals, dropdowns, etc.)

#### Context API
- **ThemeContext**: Manages theme (vibrant/light/dark)
- Future: UserContext, AuthContext

#### Persistent State
- **LocalStorage**: User progress, XP, streaks, achievements
- Data structure:
  ```javascript
  {
    ascensionProgress: { [journeyId]: { [dayNumber]: boolean } },
    ascensionXP: { global: number, domains: { [domain]: number } },
    ascensionStreaks: { current: number, longest: number, lastDate: string },
    ascensionAchievements: string[],
    ascensionTheme: 'vibrant' | 'light' | 'dark'
  }
  ```

### Data Flow

1. **User Action** → Component Event Handler
2. **State Update** → `useState` or Context
3. **LocalStorage Sync** → `useEffect` hook
4. **UI Re-render** → React reconciliation

### Component Patterns

#### Presentational Components
- Pure UI components with props
- Examples: `Button`, `Card`, `Badge`

#### Container Components
- Manage state and data fetching
- Examples: `HomePage`, `JourneyDetail`

#### Layout Components
- Structure and positioning
- Examples: `DashboardLayout`, `Sidebar`

## Backend Architecture (Future)

### Planned API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
├── /user
│   ├── GET /profile
│   └── PATCH /profile
├── /progress
│   ├── GET /:domain
│   └── POST /:domain/log
├── /xp
│   ├── GET /
│   └── POST /add
├── /achievements
│   ├── GET /
│   └── POST /unlock
└── /settings
    ├── GET /
    └── PATCH /
```

### Database Models (Planned)

```typescript
User {
  id: string
  email: string
  name: string
  createdAt: Date
  settings: Settings
}

Progress {
  userId: string
  domain: string
  dayNumber: number
  completed: boolean
  completedAt: Date
}

XP {
  userId: string
  global: number
  domains: { [domain: string]: number }
}

Streak {
  userId: string
  current: number
  longest: number
  lastDate: Date
}

Achievement {
  userId: string
  achievementId: string
  unlockedAt: Date
}
```

## File Organization

### Feature-Based Structure
```
src/
├── components/
│   ├── ui/              # Shared UI components
│   ├── layout/          # Layout components
│   ├── dashboard/        # Dashboard-specific
│   ├── journey/         # Journey-specific
│   └── ...
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── data/                # Static data and configs
└── utils/               # Utility functions
```

## Performance Optimizations

### Current
- Code splitting with React.lazy
- LocalStorage for persistence
- Memoization where beneficial

### Planned
- Service Worker for offline support
- IndexedDB for larger datasets
- Virtual scrolling for long lists
- Image optimization

## Security Considerations

### Current
- Client-side only (no sensitive data)
- LocalStorage (not secure for sensitive data)

### Future (with Backend)
- JWT authentication
- HTTPS only
- Input validation
- Rate limiting
- CORS configuration

## Testing Strategy (Planned)

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### Integration Tests
- User flows
- State management
- API interactions

### E2E Tests
- Critical user journeys
- Cross-browser testing

## Deployment Architecture

### Current
- Static site hosting
- CDN distribution
- No backend required

### Future (with Backend)
- Frontend: Vercel/Netlify
- Backend: Node.js/Express or Serverless
- Database: PostgreSQL or MongoDB
- File Storage: AWS S3 or Cloudinary

## Scalability Considerations

### Current Limitations
- LocalStorage size limits (~5-10MB)
- No multi-user support
- No real-time features

### Future Enhancements
- Backend API for data persistence
- Real-time sync across devices
- Multi-user support
- Cloud storage integration

## Development Workflow

1. Feature branch from `main`
2. Develop and test locally
3. Commit with descriptive messages
4. Create pull request
5. Code review
6. Merge to `main`
7. Deploy to production

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem
- Strong community support

### Why Tailwind CSS?
- Utility-first approach
- Rapid development
- Consistent design system

### Why LocalStorage?
- No backend required initially
- Fast and simple
- Sufficient for MVP

### Why Framer Motion?
- Smooth animations
- Declarative API
- Performance optimized

