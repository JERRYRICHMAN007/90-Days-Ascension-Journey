# **PROMPT FOR TEMPO: Advanced UI Design for 90-Day Ascension Journey App**

## **Project Overview**

Design an advanced, modern UI for a React.js-based 90-Day Personal Development Journey application. The app helps users complete 5 simultaneous transformation journeys with gamification, progress tracking, and interactive learning.

---

## **Current Application Structure**

### **Technology Stack (Recently Upgraded)**

- **React.js 18.2.0** with React Router v6
- **Vite 5.0.8** build tool
- **Tailwind CSS 4.1.17** with custom configuration
- **Framer Motion 12.23.25** for animations
- **Radix UI** components (Collapsible, Dialog, Progress, Tabs, Slot)
- **Lucide React** for icons
- **Class Variance Authority** for component variants
- **LocalStorage** for persistence
- **Dark theme** by default with CSS variables
- **Glassmorphism** effects implemented
- **Responsive design** (mobile-first)

### **Current Component Structure**

```
src/
├── components/
│   ├── Dashboard.jsx              # Main dashboard with journey cards
│   ├── JourneyDetail.jsx          # Journey detail page wrapper
│   ├── CourseraLayout.jsx         # Coursera-style content layout
│   ├── GamificationSystem.jsx     # Points, coins, levels, streaks
│   ├── AchievementSystem.jsx      # Achievement grid and unlocks
│   ├── DailyMotivation.jsx        # Rotating motivational quotes
│   ├── StreakWarning.jsx          # Streak danger warnings
│   ├── Quiz.jsx                   # Interactive quiz component
│   ├── ProgressTracker.jsx        # Progress visualization
│   ├── CoinAnimation.jsx           # Coin collection animations
│   ├── dashboard/
│   │   ├── JourneyCard.jsx        # Individual journey card
│   │   └── StatsCard.jsx          # Stats display card
│   ├── journey/
│   │   └── JourneySidebar.jsx     # Collapsible sidebar navigation
│   ├── layout/
│   │   └── Navigation.jsx        # Top/bottom navigation
│   └── ui/                        # shadcn/ui-style components
│       ├── button.jsx
│       ├── card.jsx
│       ├── badge.jsx
│       ├── progress.jsx
│       ├── tabs.jsx
│       ├── collapsible.jsx
│       └── sheet.jsx
├── data/
│   └── journeyData.js            # All journey content (13 weeks each)
├── utils/
│   └── progress.js                # Progress calculation utilities
└── lib/
    └── utils.js                   # Utility functions (cn helper)
```

### **Current Design System**

**Color System (CSS Variables):**
- Background: `hsl(240 10% 3.9%)` - Dark background
- Foreground: `hsl(0 0% 98%)` - Light text
- Primary: `hsl(263 70% 50%)` - Purple (#667eea)
- Secondary: `hsl(240 3.7% 15.9%)` - Dark gray
- Muted: `hsl(240 3.7% 15.9%)` - Muted backgrounds
- Border: `hsl(240 3.7% 15.9%)` - Subtle borders
- Gold: `hsl(38 92% 50%)` - For coins
- Success: `hsl(142 71% 45%)` - For achievements

**Current UI Features:**
- ✅ Dark theme with glassmorphism cards
- ✅ Gradient text effects
- ✅ Smooth animations with Framer Motion
- ✅ Responsive navigation (top desktop, bottom mobile)
- ✅ Collapsible sidebar with week/day navigation
- ✅ Progress bars and circular indicators
- ✅ Basic gamification visuals

**What Needs Enhancement:**
- ⚠️ More sophisticated animations and micro-interactions
- ⚠️ Enhanced visual hierarchy and spacing
- ⚠️ Better mobile experience with gestures
- ⚠️ More engaging gamification visuals
- ⚠️ Improved content organization and readability
- ⚠️ Advanced data visualizations
- ⚠️ Better loading states and transitions

---

## **Core Features**

### **1. Dashboard View**
- Overview of 5 journeys with progress cards
- Gamification stats (points, coins, level, streak)
- Daily motivation quotes
- Achievement showcase
- Weekly calendar overview
- **Current State**: Functional but needs visual polish

### **2. Coursera-Style Layout**
- Top navigation bar with progress indicator
- Left sidebar: collapsible week modules with day lessons
- Main content: day details, resources, quizzes
- Previous/Next day navigation
- Mobile: Sheet component for sidebar
- **Current State**: Basic structure in place, needs enhancement

### **3. Gamification System**
- Points system (50 base + streak bonuses)
- Gold coins (10 base + bonuses)
- Level system (XP-based, 100 XP per level)
- Achievement system (12+ achievements)
- Streak tracking with warnings
- **Current State**: Logic complete, visuals need upgrade

### **4. Interactive Quizzes**
- Progressive quizzes with immediate feedback
- Question-by-question progression
- Score tracking
- Explanations for answers
- **Current State**: Functional, needs better UI

### **5. Progress Tracking**
- Real-time progress visualization
- Circular progress indicators
- Linear progress bars
- Statistics display
- **Current State**: Basic implementation

### **6. Resource Links**
- Clickable learning resources throughout
- External links with icons
- Resource cards with previews
- **Current State**: Basic links, needs previews

---

## **Five Journey Types**

### **1. Body Transformation** (💪)
- **Duration**: 90 days
- **Time Block**: 5:30-6:30 AM
- **Content**: 
  - Daily workout plans (Upper/Lower/Core/Functional/Mobility)
  - Workout video links
  - Nutrition guidelines
  - Mindset affirmations
  - Recovery resources
- **Special Features**: Video thumbnails, workout tracking

### **2. Dual Brand** (🎨)
- **Duration**: 90 days
- **Time Block**: 8:30-9:30 PM
- **Content**:
  - Ryxen brand tasks (⚡)
  - HavenX brand tasks (🚀)
  - Social media resources
  - Content creation guides
  - Learning resources per day
- **Special Features**: Dual-column layout, brand-specific styling

### **3. Reading** (📚)
- **Duration**: 90 days
- **Time Block**: Multiple time blocks
- **Content**:
  - E-books reading sessions
  - Physical books reading
  - Bible reading
  - Reading comprehension guides
  - Note-taking strategies
- **Special Features**: Session tracking, reading time estimates

### **4. Writer's Journey** (✍️)
- **Duration**: 60 days
- **Time Block**: 3:30-4:30 PM
- **Content**:
  - Learning phase (15 min)
  - Execution phase (40 min)
  - Reflection phase (5 min)
  - Writing resources
  - Freelance guides
  - Pitching templates
- **Special Features**: Phase-based layout, time tracking

### **5. Software Engineering** (💻)
- **Duration**: 90 days
- **Time Block**: 5 hours daily
- **Content**:
  - Daily learning (90 minutes)
  - Cursor IDE workflows
  - Mini-projects with requirements
  - Interactive quizzes
  - Learning resources with time estimates
  - Progressive curriculum (HTML → CSS → JS → React → Next.js)
- **Special Features**: Code blocks, quiz integration, project cards

---

## **Gamification Elements (Detailed)**

### **Points System**
- **Base Reward**: 50 points per completed day
- **Streak Bonus**: +10 points per consecutive day
- **Achievement Rewards**: 50-10,000 points per achievement
- **Level-Up Bonus**: 100 points per level
- **Visual**: Animated counter with number roll effect

### **Gold Coins System**
- **Base Reward**: 10 coins per completed day
- **Streak Bonus**: +1 coin per 3 consecutive days
- **Achievement Rewards**: 10-1,000 coins per achievement
- **Visual**: Animated coin collection with particle effects

### **Level System**
- **XP Calculation**: 100 XP per level (scales: level 1 = 100, level 2 = 200, etc.)
- **Level-Up Celebration**: Confetti animation, modal dialog
- **Visual**: Circular progress ring with glow effect
- **Current State**: Basic implementation, needs visual upgrade

### **Achievement System**
- **12+ Achievements**:
  - First Steps (Complete 1 day)
  - Week Warrior (Complete 7 days)
  - Month Master (Complete 30 days)
  - Completionist (Complete all days)
  - Streak Master (10+ day streak)
  - And more...
- **Progress Tracking**: Shows progress toward locked achievements
- **Unlock Animation**: Bounce effect, particle burst
- **Visual**: Grid layout with locked/unlocked states

### **Streak System**
- **Current Streak**: Tracks consecutive days
- **Longest Streak**: Records best streak
- **Streak Warnings**: Alerts when streak is in danger
- **Visual**: Fire icon (🔥) with animation intensity based on streak length
- **Current State**: Functional, needs better visuals

---

## **Current UI Components (Detailed)**

### **1. Dashboard Components**

**Header Section:**
- Title: "Your Ascension Journey"
- Subtitle: Date range and description
- **Needs**: Hero section with animated background

**Stats Grid:**
- 4 StatsCard components (Points, Coins, Level, Streak)
- Animated number counters
- Circular progress for level
- **Needs**: More sophisticated animations, hover effects

**Journey Cards:**
- 5 JourneyCard components in grid
- Progress bars with gradients
- Radial progress indicators
- 3D hover effects
- **Needs**: Enhanced hover states, better visual hierarchy

**Gamification Components:**
- GamificationSystem: Points/coins/level display
- AchievementSystem: Grid of achievements
- DailyMotivation: Rotating quotes
- **Needs**: Better visual integration, animations

**Weekly Overview:**
- Calendar grid showing current week
- Day cells with activities
- **Needs**: Interactive calendar, better visual design

### **2. Coursera-Style Layout Components**

**Top Navigation Bar:**
- Back button
- Journey title and icon
- Week/Day breadcrumb
- Progress bar
- Mobile menu button
- **Needs**: Enhanced styling, user profile integration

**Sidebar Navigation:**
- Collapsible week modules
- Day lessons with completion status
- Progress indicators per week
- **Needs**: Better visual hierarchy, smooth scrolling

**Main Content Area:**
- Day header with completion button
- Content sections (varies by journey type)
- Resource cards
- Quiz sections
- Navigation buttons (Previous/Next)
- **Needs**: Better content organization, tabs, expand/collapse

### **3. Interactive Components**

**Quiz Component:**
- Question display
- Multiple choice options
- Progress indicator
- Immediate feedback
- Score display
- **Needs**: Better UI, animations, progress visualization

**Progress Tracker:**
- Statistics display
- Progress charts
- **Needs**: Data visualizations, charts

**Resource Cards:**
- Icon + title + link
- Hover effects
- **Needs**: Previews, thumbnails, better styling

---

## **Design Requirements for Advanced UI**

### **Visual Style Enhancements**

**Current Foundation:**
- ✅ Dark theme with glassmorphism
- ✅ Gradient accents
- ✅ Basic animations

**Needed Improvements:**

1. **Typography Hierarchy**
   - More distinct heading sizes
   - Better line-height and spacing
   - Improved readability
   - Gradient text effects for emphasis

2. **Color System**
   - Expand color palette for different journey types
   - Better contrast ratios
   - Semantic color usage
   - Theme customization options

3. **Spacing & Layout**
   - Consistent spacing scale
   - Better grid systems
   - Improved content width constraints
   - Better mobile spacing

4. **Shadows & Depth**
   - Layered shadow system
   - Better elevation hierarchy
   - Subtle depth cues

5. **Borders & Dividers**
   - Subtle border system
   - Gradient borders for emphasis
   - Better divider styles

### **Key UI Improvements Needed**

#### **1. Dashboard Enhancements**

**Hero Section:**
- Animated gradient background
- Large stats display with counters
- Call-to-action buttons
- Quick navigation to active journeys

**Journey Cards:**
- Enhanced 3D hover effects
- Better progress visualization
- Quick action buttons
- Preview on hover
- Better iconography

**Stats Cards:**
- More sophisticated animations
- Interactive hover states
- Better icon integration
- Micro-interactions

**Achievement Showcase:**
- Carousel or grid with better layout
- Achievement preview cards
- Unlock animations
- Progress indicators

**Calendar:**
- Interactive hover states
- Better day cell design
- Activity icons
- Completion indicators

#### **2. Coursera Layout Enhancements**

**Top Bar:**
- User profile integration
- Better progress visualization
- Quick actions menu
- Search functionality

**Sidebar:**
- Sticky positioning with smooth scroll
- Better week/day organization
- Completion indicators
- Active state highlighting
- Progress rings per week

**Content Sections:**
- Tabbed organization
- Expand/collapse sections
- Better typography hierarchy
- Code blocks with syntax highlighting
- Video thumbnail previews
- Resource cards with previews
- Better spacing and readability

**Navigation:**
- Smooth page transitions
- Better Previous/Next buttons
- Breadcrumb navigation
- Quick jump to week/day

#### **3. Gamification Visuals**

**Points & Coins:**
- Animated number roll effects
- Particle effects on collection
- Floating animations
- Celebration bursts

**Level System:**
- Enhanced progress rings with glow
- Level-up modal with animations
- XP visualization
- Milestone markers

**Achievements:**
- Unlock animations (particle burst, bounce)
- Progress bars for locked achievements
- Hover previews
- Achievement detail modals

**Streaks:**
- Animated fire icon
- Intensity based on streak length
- Streak milestone celebrations
- Visual streak calendar

#### **4. Interactive Elements**

**Animations:**
- Smooth page transitions (fade, slide)
- Loading skeletons
- Hover micro-interactions
- Click feedback
- Scroll-triggered animations

**Feedback:**
- Toast notifications for rewards
- Modal dialogs for achievements
- Tooltips for guidance
- Success/error states

**Gestures (Mobile):**
- Swipeable cards
- Pull-to-refresh
- Swipe navigation
- Touch-optimized buttons

#### **5. Mobile Experience**

**Navigation:**
- Bottom navigation bar (already implemented)
- Swipe gestures
- Collapsible sections
- Touch-friendly targets (min 44x44px)

**Layout:**
- Stack layout for mobile
- Responsive typography
- Optimized images
- Touch-optimized interactions

**Performance:**
- Optimized animations
- Lazy loading
- Image optimization
- Smooth scrolling

#### **6. Advanced Features**

**Dark Mode:**
- Already implemented, but needs refinement
- Better contrast
- Theme persistence

**Customization:**
- Journey-specific themes
- Customizable colors
- Layout preferences

**Data Visualization:**
- Progress charts over time
- Streak visualization
- Achievement progress
- Statistics dashboard

**Search:**
- Global search across all content
- Filter by journey, week, day
- Quick navigation

**Export:**
- Progress reports
- Achievement certificates
- Statistics export

---

## **Color Palette (Enhanced)**

### **Current Colors:**
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Deep Purple)
- Success: `#4caf50` (Green)
- Warning: `#ffc107` (Amber)
- Accent: `#f59e0b` (Gold)
- Background: Dark theme

### **Recommended Expansion:**
- **Journey-Specific Colors:**
  - Body Transformation: `#667eea` (Purple/Blue)
  - Dual Brand: `#f093fb` (Pink/Purple)
  - Reading: `#4facfe` (Blue/Cyan)
  - Writer's Journey: `#43e97b` (Green/Emerald)
  - Software Engineering: `#fa709a` (Pink/Rose)

- **Semantic Colors:**
  - Info: `#3b82f6` (Blue)
  - Error: `#ef4444` (Red)
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)

---

## **Typography System**

### **Current:**
- System fonts (San Francisco, Segoe UI, etc.)
- Basic heading hierarchy

### **Recommended:**
- **Headings**: Bold, gradient text effects, larger sizes
- **Body**: Clean, readable sans-serif (Inter, System UI)
- **Code**: Monospace (JetBrains Mono, Fira Code)
- **Display**: Large, bold for hero sections
- **Labels**: Medium weight, uppercase for badges

### **Scale:**
- Display: 4xl (2.25rem)
- H1: 3xl (1.875rem)
- H2: 2xl (1.5rem)
- H3: xl (1.25rem)
- H4: lg (1.125rem)
- Body: base (1rem)
- Small: sm (0.875rem)
- XS: xs (0.75rem)

---

## **Animation Principles**

### **Timing:**
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (transitions)
- **Slow**: 500ms (page transitions)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design)

### **Effects:**
- **Bounce**: For celebrations (0.6s)
- **Pulse**: For important elements (2s infinite)
- **Slide-in**: For new content (0.3s)
- **Fade**: For overlays (0.2s)
- **Scale**: For hover effects (0.2s)

### **Performance:**
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- 60fps target

---

## **User Experience Goals**

1. **Engaging**: Gamification makes it fun and addictive
2. **Encouraging**: Positive reinforcement throughout journey
3. **Professional**: Clean, modern design that feels premium
4. **Intuitive**: Easy navigation, clear hierarchy
5. **Motivating**: Visual progress and achievements drive completion
6. **Accessible**: WCAG 2.1 AA compliance
7. **Performant**: Smooth 60fps animations
8. **Responsive**: Seamless experience on all devices

---

## **Specific UI Patterns to Implement**

### **1. Card Designs**
- **Elevated Cards**: Multiple shadow levels
- **Hover Effects**: Lift, scale, glow
- **Border Gradients**: For emphasis
- **Icon Badges**: Top-right corner indicators
- **Action Buttons**: Integrated in cards

### **2. Progress Indicators**
- **Circular Progress**: SVG rings with gradients
- **Linear Progress**: Animated bars with glow
- **Step Indicators**: Multi-step progress
- **Milestone Markers**: Visual checkpoints

### **3. Buttons**
- **Primary**: Gradient backgrounds, hover scale
- **Secondary**: Outlined, subtle hover
- **Ghost**: Transparent, hover fill
- **Loading States**: Spinner, disabled state
- **Icon + Text**: Proper spacing

### **4. Forms/Inputs**
- **Floating Labels**: Animated labels
- **Focus States**: Glow effects
- **Validation**: Real-time feedback
- **Smooth Transitions**: All state changes

### **5. Navigation**
- **Breadcrumbs**: Clear path indication
- **Active States**: Highlighted current page
- **Smooth Scrolling**: To sections
- **Back Button**: With context

### **6. Modals & Dialogs**
- **Achievement Unlocks**: Celebratory modals
- **Level-Up**: Animated celebrations
- **Confirmations**: For important actions
- **Overlays**: Backdrop blur

### **7. Loading States**
- **Skeletons**: Content placeholders
- **Spinners**: For async operations
- **Progress Bars**: For long operations
- **Optimistic Updates**: Immediate feedback

---

## **Technical Constraints**

### **Must Maintain:**
- Existing React component structure
- Current routing system
- LocalStorage persistence
- All gamification logic
- All journey content

### **Must Work With:**
- Tailwind CSS (already configured)
- Framer Motion (already installed)
- Radix UI components (already in use)
- Responsive breakpoints
- Dark theme system

### **Performance Requirements:**
- 60fps animations
- < 3s initial load time
- Smooth scrolling
- Optimized images
- Lazy loading where appropriate

### **Browser Support:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### **Responsive Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1919px
- Large Desktop: 1920px+

---

## **Deliverables Expected**

1. **Complete UI Design System**
   - Color palette with usage guidelines
   - Typography scale and hierarchy
   - Spacing system
   - Component library specifications

2. **Component Designs**
   - All major components redesigned
   - Mobile and desktop variants
   - Interactive states (hover, active, disabled)
   - Loading and error states

3. **Animation Specifications**
   - Timing and easing curves
   - Animation sequences
   - Micro-interaction details
   - Performance considerations

4. **Responsive Designs**
   - Mobile layouts
   - Tablet layouts
   - Desktop layouts
   - Breakpoint specifications

5. **Interactive Prototype** (if possible)
   - Clickable prototype
   - Animation demonstrations
   - User flow examples

6. **CSS/Styling Recommendations**
   - Tailwind class suggestions
   - Custom CSS where needed
   - Animation implementations
   - Responsive utilities

7. **Accessibility Guidelines**
   - Color contrast ratios
   - Focus states
   - Screen reader considerations
   - Keyboard navigation

8. **Implementation Guide**
   - Step-by-step upgrade path
   - Component migration strategy
   - Testing checklist

---

## **Inspiration References**

- **Coursera**: Course interface, sidebar navigation, progress tracking
- **Duolingo**: Gamification, streak system, achievement unlocks
- **Notion**: Clean design, content organization, smooth interactions
- **Linear**: Smooth animations, modern aesthetics, micro-interactions
- **Stripe**: Documentation style, code blocks, clear hierarchy
- **Figma**: Component organization, design system approach

---

## **Success Criteria**

The advanced UI should:

1. **Increase Engagement**: 40%+ increase in daily active users
2. **Feel Premium**: Professional, polished design
3. **Maintain Functionality**: All features work as before
4. **Enhance Gamification**: More engaging reward system
5. **Improve Usability**: Intuitive for first-time users
6. **Work Seamlessly**: Perfect on all devices and browsers
7. **Perform Well**: 60fps animations, fast load times
8. **Be Accessible**: WCAG 2.1 AA compliant

---

## **Priority Areas**

### **High Priority:**
1. Dashboard visual enhancements
2. Gamification visual upgrades
3. Mobile experience improvements
4. Animation system
5. Content readability

### **Medium Priority:**
1. Advanced data visualizations
2. Search functionality
3. Theme customization
4. Export features

### **Low Priority:**
1. Social sharing
2. Advanced analytics
3. Third-party integrations

---

## **Additional Context**

### **Current Pain Points:**
- Some components feel basic despite functionality
- Mobile experience could be more engaging
- Gamification visuals don't match the excitement of the system
- Content organization could be clearer
- Loading states are minimal

### **User Feedback Goals:**
- "This looks amazing!"
- "I want to use this every day"
- "The animations are so satisfying"
- "It's so easy to navigate"
- "I feel motivated to complete my journey"

---

**Please create a comprehensive, modern UI design that transforms this application into a premium, engaging experience that motivates users to complete their 90-day transformation journey. Focus on making the gamification system visually exciting, improving content readability, and creating a seamless mobile experience.**

---

## **File Structure Reference**

For implementation, the key files to consider:
- `src/components/Dashboard.jsx` - Main dashboard
- `src/components/JourneyDetail.jsx` - Journey wrapper
- `src/components/CourseraLayout.jsx` - Content layout
- `src/components/GamificationSystem.jsx` - Gamification logic
- `src/components/ui/*.jsx` - UI components
- `src/index.css` - Global styles and Tailwind config
- `tailwind.config.js` - Tailwind configuration

---

**Thank you for creating an amazing design that will inspire users on their transformation journey! 🚀**

