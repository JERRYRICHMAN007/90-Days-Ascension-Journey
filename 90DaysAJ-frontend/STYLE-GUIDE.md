# Style Guide

## Design Principles

1. **Consistency**: Use design system tokens throughout
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Responsiveness**: Mobile-first approach
4. **Performance**: Optimize for fast load times
5. **Clarity**: Clear visual hierarchy and information architecture

## Color System

### Primary Colors
```css
--primary: #FF6B3D        /* Orange - Main actions */
--secondary: #1E90FF       /* Blue - Secondary actions */
--accent: #6A5AE0         /* Purple - Highlights */
--success: #3BCF7A         /* Green - Success states */
--warning: #FFC857        /* Yellow - Warnings */
```

### Semantic Colors
```css
--background: Base background color
--foreground: Primary text color
--surface: Card/container background
--muted: Muted text and borders
--destructive: Error/destructive actions
```

### Theme Variants
- **Vibrant**: Default, high-contrast colors
- **Light**: Light backgrounds, dark text
- **Dark**: Dark backgrounds, light text

## Typography

### Font Families
- **Primary**: System font stack (San Francisco, Segoe UI, etc.)
- **Monospace**: For code blocks

### Font Sizes
```css
text-xs:    12px
text-sm:    14px
text-base:  16px
text-lg:    18px
text-xl:    20px
text-2xl:   24px
text-3xl:   30px
text-4xl:   36px
```

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: 1.25 (headings)
- **Normal**: 1.5 (body)
- **Relaxed**: 1.75 (long-form content)

## Spacing Scale

Base unit: **8px**

```css
space-1:  4px   (0.5 * base)
space-2:  8px   (1 * base)
space-3:  12px  (1.5 * base)
space-4:  16px  (2 * base)
space-6:  24px  (3 * base)
space-8:  32px  (4 * base)
space-12: 48px  (6 * base)
space-16: 64px  (8 * base)
```

## Component Patterns

### Buttons

```jsx
// Primary button
<Button>Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Ghost button
<Button variant="ghost">Ghost Action</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Cards

```jsx
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Forms

```jsx
<div className="space-y-4">
  <div>
    <label className="text-sm font-medium mb-2 block">
      Label
    </label>
    <input
      type="text"
      className="w-full px-4 py-2 rounded-lg border bg-background"
    />
  </div>
</div>
```

## Layout Patterns

### Container
```jsx
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
```

### Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Flex
```jsx
<div className="flex items-center justify-between gap-4">
  {/* Flex items */}
</div>
```

## Animation Guidelines

### Transitions
- **Fast**: 150ms (hover states)
- **Normal**: 300ms (page transitions)
- **Slow**: 500ms (complex animations)

### Easing
- **Default**: `ease-in-out`
- **Enter**: `ease-out`
- **Exit**: `ease-in`

### Framer Motion Patterns
```jsx
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Slide in
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
>

// Scale
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

## Accessibility

### ARIA Labels
```jsx
<button aria-label="Close modal">
  <X />
</button>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus states must be visible
- Tab order should be logical

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus indicators

## Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach
```jsx
// Start with mobile styles, add larger breakpoints
<div className="text-sm md:text-base lg:text-lg">
```

## Naming Conventions

### Components
- **PascalCase**: `Button`, `TaskCard`, `JourneyDetail`

### Files
- **PascalCase for components**: `Button.jsx`, `TaskCard.jsx`
- **camelCase for utilities**: `utils.js`, `progress.js`
- **kebab-case for configs**: `tailwind.config.js`

### CSS Classes
- **Tailwind utilities**: `flex`, `items-center`, `bg-primary`
- **Custom classes**: `glass-card`, `gradient-text`

### Variables
- **camelCase**: `userProgress`, `currentStreak`
- **Constants**: `UPPER_SNAKE_CASE`

## Code Style

### JavaScript/JSX
- Use functional components
- Prefer arrow functions for callbacks
- Destructure props
- Use optional chaining (`?.`)
- Use nullish coalescing (`??`)

### Imports
```jsx
// External libraries first
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Internal components
import { Button } from './ui/button';
import { Card } from './ui/card';

// Utilities
import { cn } from '../../lib/utils';
```

### Comments
- Use JSDoc for functions
- Explain "why" not "what"
- Keep comments up to date

## Best Practices

1. **Component Size**: Keep components focused and under 200 lines
2. **Prop Drilling**: Use Context for deeply nested props
3. **Performance**: Memoize expensive computations
4. **Error Handling**: Use Error Boundaries
5. **Loading States**: Always show loading indicators
6. **Empty States**: Provide helpful empty state messages

