# Aether Dashboard

A comprehensive, gamified personal development application tracking progress across five core domains: Body Transformation, Dual Brand Development, Reading Journey, Writing Journey, and Software Engineering Growth.

## ✨ Features

### Core Functionality
- **Multi-Domain Tracking**: Monitor progress across 5 different life domains
- **Gamification System**: XP, levels, streaks, and achievements
- **Theme System**: Vibrant, Light, and Dark modes
- **Progress Visualization**: Charts, progress bars, and statistics
- **Daily Tasks**: Track and complete daily objectives
- **Achievement System**: Unlock badges and milestones

### Domains
1. **Body Transformation** - Safe fitness and wellness tracking
2. **Dual Brand** - Ryxen + HavenX brand building
3. **Reading Journey** - Book tracking and reading logs
4. **Writer's Journey** - Writing practice and drafts
5. **Software Engineering** - Coding practice and skill development

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives
- **Routing**: React Router v6
- **State Management**: React Hooks + LocalStorage
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Color Palette (Vibrant Theme)
- **Primary**: `#FF6B3D` (Orange)
- **Secondary**: `#1E90FF` (Blue)
- **Accent**: `#6A5AE0` (Purple)
- **Success**: `#3BCF7A` (Green)
- **Warning**: `#FFC857` (Yellow)

### Spacing Scale
- Base unit: 8px
- Scale: 8, 16, 24, 32px

## 📁 Project Structure

```
react-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── ...              # Feature components
│   ├── contexts/            # React contexts
│   ├── data/               # Journey data and configs
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── package.json
```

## 🎮 Gamification System

### XP System
- **Easy Task**: 10 XP
- **Medium Task**: 25 XP
- **Hard Task**: 50 XP
- **Daily Quest**: 15 XP
- **Weekly Quest**: 100 XP

### Level Calculation
Levels use an exponential curve: `XP = 100 * 1.5^(level - 1)`

### Streaks
- Daily streak tracking
- Automatic reset on missed days
- Longest streak tracking

### Achievements
- Streak-based achievements (3-day, 7-day, 30-day)
- XP milestones
- Domain-specific achievements

## 🧭 Navigation

The app includes a collapsible sidebar with navigation to:
- Home Dashboard
- Body Transformation
- Dual Brand
- Reading Journey
- Writer's Journey
- Software Engineering
- Achievements
- Profile
- Settings

## 🔧 Configuration

### Theme Configuration
Themes are configured in `src/index.css` and managed via `ThemeContext`.

### Journey Data
Journey data is defined in `src/data/journeyData.js` and can be customized per domain.

## 📝 Development

### Adding a New Component
1. Create component in appropriate directory
2. Use design system colors and spacing
3. Add to component library if reusable
4. Document props and usage

### Adding a New Journey
1. Add journey definition to `journeyData.js`
2. Create journey-specific components if needed
3. Add route in `App.jsx`
4. Update navigation in `Sidebar.jsx`

## 🚀 Deployment

The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Build command: `npm run build`
Output directory: `dist/`

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a personal project. For suggestions or improvements, please open an issue.

---

Built with ❤️ for personal growth and development
