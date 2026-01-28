# Week 1 Testing & Trials Update

## Timeline Configuration

### Updated Schedule
- **Day 0**: January 18, 2026 (Sunday) - Preparation/Setup Day
- **Week 1 (Testing)**: January 19-24, 2026 (Days 1-6) - Testing & Trials Week
  - **No actual content** - System exploration and testing only
  - **No time slots** - Free exploration
  - **No iterations** - Just familiarization
- **Week 2 (Actual Content Starts)**: January 25, 2026 onwards (Day 7+)
  - **Actual content execution begins**
  - **Time slots active** - All journeys follow their scheduled time blocks
  - **Full content** - Learning, projects, quizzes, reflections

## Changes Made

### 1. Date Constants Updated (`src/utils/dates.js`)
- Added `TESTING_WEEK_START`: January 19, 2026
- Added `TESTING_WEEK_END`: January 24, 2026
- Added `ACTUAL_CONTENT_START`: January 25, 2026 (Day 7)
- Updated `isTestingWeek()` to check Days 1-6 (not 1-7)
- Added `isActualContentDay()` helper function

### 2. Journey Data Updated (`src/data/journeyData.js`)
- All journeys now check `dayNumber <= 6` for testing week (not `<= 7`)
- Week 1 (Days 1-6): Testing content only
- Week 2 (Day 7+): Actual content with proper time slots

### 3. Content Behavior

#### Week 1 (Days 1-6, Jan 19-24)
- **Body Transformation**: "System Testing - No Workout"
- **Reading**: Empty reading sessions, testing tasks only
- **Dual Brand**: Empty tasks, testing focus
- **Writer's Journey**: Testing tasks only
- **Software Engineering**: "System Testing" placeholder content
- **No time slots** - `scheduledContent` is `null` for test runs
- **No projects** - Placeholder projects only
- **No quizzes** - `dailyQuiz` is `null`

#### Week 2 (Day 7+, Jan 25 onwards)
- **All journeys**: Full actual content
- **Time slots active**: All scheduled time blocks are active
- **Full projects**: Real project requirements and iterations
- **Quizzes active**: Daily quizzes available
- **Reflections**: Actual reflection questions
- **Learning content**: Real learning materials

## Time Slots (Active from Week 2 onwards)

### Body Transformation
- **Time**: 5:30-6:30 AM (Monday-Friday)

### Dual Brand
- **Time**: 4:45-5:30 AM (Mon-Fri), 5:00-6:00 AM (Saturday)

### Reading
- **Bible**: 6:00-6:15 AM (Weekdays & Sunday)
- **E-Book**: 6:15-6:45 AM (Mon-Wed)
- **Physical**: 6:15-6:45 AM (Thu-Fri), 8:00-8:30 PM (Sat)

### Writer's Journey
- **Time**: 12:30-1:00 PM (Weekdays)

### Software Engineering
- **Mobile**: 6:45-8:00 AM (Mon-Wed), 1:30-3:00 PM Rev (Sat)
- **Frontend**: 6:45-8:00 AM (Thu-Fri), 3:00-4:00 PM Rev (Sat)
- **Backend**: 7:30-9:00 PM (Fri), 4:00-5:00 PM Rev (Sat)
- **WordPress**: 5:00-6:00 AM (Sun)

## Verification

All journeys now correctly:
- ✅ Show testing content for Days 1-6 (Jan 19-24)
- ✅ Show actual content from Day 7+ (Jan 25 onwards)
- ✅ Apply time slots only from Week 2 onwards
- ✅ Use proper content week numbers (Week 2 = contentWeekNum 1, Week 3 = 2, etc.)

## User Experience

### During Week 1 (Jan 19-24)
- Users see "Testing & Trials Week" messages
- Minimal placeholder content
- No time slot restrictions
- Focus on system exploration

### From Week 2 (Jan 25 onwards)
- Full content experience
- Time slots enforced
- Real projects and learning
- Complete journey execution




