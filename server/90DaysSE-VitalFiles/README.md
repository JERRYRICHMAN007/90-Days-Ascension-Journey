# Senior React Native Engineer Pre-Qualification Test Guide

## COMFORT App - Complete Study Guide with Real-Life Explanations

> **Repository**: [Senior-Mobile-App-Engineer-React-Native-iOS-Android-](https://github.com/JERRYRICHMAN007/Senior-Mobile-App-Engineer-React-Native-iOS-Android-)

This comprehensive guide provides detailed explanations for the COMFORT App Senior React Native Engineer pre-qualification test, with real-life analogies and step-by-step breakdowns to help you understand every concept.

---

## 📚 Table of Contents

1. [Section 1: Quick Screen](#section-1-quick-screen)
   - [Architecture Thinking](#architecture-thinking)
   - [Scenario Responses](#scenario-responses)
   - [Small Code Challenge](#small-code-challenge)
2. [Section 2: Take-Home Task](#section-2-take-home-task)
   - [Project Structure](#project-structure-explained)
   - [Implementation Details](#implementation-details)
   - [Testing Guide](#testing-guide)
3. [Section 3: Reflection & Attitude](#section-3-reflection--attitude)
   - [Trade-offs](#trade-offs-question)
   - [Collaboration Style](#collaboration-style)
   - [Learning & Curiosity](#learning--curiosity)
   - [Integrity in Work](#integrity-in-work)

---

# Section 1 — Quick Screen

## Architecture Thinking

### Understanding the Architecture

Think of building a mobile app like building a restaurant:

- **UI Layer** = The dining room (what customers see)
- **Service Layer** = The kitchen (does the actual work)
- **Storage Layer** = The pantry (keeps ingredients safe)
- **Backend** = The suppliers (provides resources)

### Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App Layer                      │
│  (This is what users see and interact with)             │
├─────────────────────────────────────────────────────────┤
│  UI Layer (React Native)                                 │
│  ├─ Home Screen (Pickup/Dropoff Input)                  │
│  │  → Like a taxi booking form                           │
│  ├─ Map View (React Native Maps)                        │
│  │  → Shows where you are and nearby cars               │
│  ├─ Trip Status Screen                                  │
│  │  → Shows "Driver arriving in 2 minutes"              │
│  └─ Error Boundary                                      │
│     → Catches crashes and shows a friendly message      │
├─────────────────────────────────────────────────────────┤
│  State Management Layer                                  │
│  (Keeps track of what's happening in the app)           │
│  ├─ Zustand/Redux (Real-time trip state)                │
│  │  → Like a whiteboard showing current order status    │
│  ├─ Offline Queue (Redux Persist / AsyncStorage)        │
│  │  → Like a notepad for orders when internet is down   │
│  └─ Location State Manager                              │
│     → Tracks where you are right now                     │
├─────────────────────────────────────────────────────────┤
│  Service Layer                                           │
│  (The "workers" that do the actual work)                │
│  ├─ WebSocket Service (Socket.io / Native WebSocket)   │
│  │  → Like a walkie-talkie for instant updates          │
│  ├─ Location Service (Background Tasks)                 │
│  │  → Like GPS in your car, works even when app closed  │
│  ├─ Map Service (Google Maps / Mapbox)                  │
│  │  → Shows the map and nearby vehicles                 │
│  ├─ Push Notification Service (FCM / APNS)              │
│  │  → Like a doorbell notification                      │
│  └─ CodePush Service (OTA Updates)                      │
│     → Updates app without app store                     │
├─────────────────────────────────────────────────────────┤
│  Storage Layer                                           │
│  (Where we keep important stuff safe)                   │
│  ├─ Secure Storage (react-native-keychain)              │
│  │  └─ JWT Tokens (Like a safe for passwords)           │
│  ├─ AsyncStorage (Offline Cache)                        │
│  │  ├─ Last Known Location                             │
│  │  ├─ Map Tiles Cache                                  │
│  │  └─ Pending Requests Queue                           │
│  └─ SQLite (Optional - Complex offline data)            │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│  Backend API    │  │  WebSocket      │
│  (REST/GraphQL) │  │  Server         │
└─────────────────┘  └─────────────────┘
```

**Real-life scenario**: Like a restaurant menu (UI) that customers see, but the kitchen (services) does the work.

### Key Architecture Decisions Explained

#### 1. WebSockets vs REST API

**Real-Life Analogy:**

- **REST API** = Sending a letter (you send, wait, get response)
- **WebSocket** = Phone call (instant, two-way conversation)

**Why WebSocket for Real-Time Updates:**

- When driver accepts your trip, you need to know INSTANTLY
- REST API would require constant checking (polling) = battery drain
- WebSocket = server pushes updates to you automatically

**Code Example:**

```typescript
// REST API (Slow - like sending letters)
setInterval(() => {
  fetch("/api/trip-status").then(updateUI);
}, 5000); // Check every 5 seconds = battery drain!

// WebSocket (Fast - like phone call)
socket.on("trip.accepted", (data) => {
  updateUI(data); // Instant update!
});
```

#### 2. Offline-First Strategy

**The Problem:**
Users in areas with poor connectivity (rural areas, tunnels, elevators)

**The Solution:**
Save actions locally, send when online

**Real-Life Analogy:**
Like writing a letter when you're in a tunnel (no signal), then mailing it when you reach a post office (get signal)

**Implementation:**

```typescript
// When offline: Save to queue
if (!isOnline) {
  await saveToQueue(tripRequest);
}

// When back online: Send queued requests
if (isOnline) {
  await sendQueuedRequests();
}
```

#### 3. Secure Storage for JWT Tokens

**The Problem:**
JWT tokens are like temporary ID cards. If stolen, someone could pretend to be you.

**The Solution:**
Use encrypted storage (react-native-keychain)

**Real-Life Analogy:**

- **AsyncStorage** = Drawer (simple, but anyone can open)
- **Keychain** = Bank vault (encrypted, secure)

**Why It Matters:**
If someone steals your phone and gets your token, they could:

- Book trips on your account
- Access your personal information
- Make payments from your account

#### 4. CodePush for OTA Updates

**The Problem:**
App store updates take 1-2 days for approval

**The Solution:**
Push updates directly to users (like updating a website)

**Real-Life Analogy:**

- **App Store Update** = Renovating a building (takes weeks, needs permits)
- **CodePush** = Changing a website (instant, no approval needed)

**Use Cases:**

- Fix critical bugs immediately
- Update business logic without app store delay
- A/B testing new features

---

## Scenario Responses

### Scenario 1: Battery Drain During Tracking

#### The Problem Explained

Location tracking uses GPS, which is like leaving your phone's flashlight on all day - it drains battery quickly.

#### Debugging Steps (Like a Detective)

**Step 1: Find the Culprit**

```typescript
// Use React Native Performance Monitor
// Shows: "Location updates happening 10 times per second!"
// That's the problem! Too frequent!
```

**Step 2: Check What's Using Battery**

- Location service: 40% battery
- Map rendering: 30% battery
- WebSocket: 10% battery

**Step 3: Identify the Issue**

- Problem: App requests location every 1 second
- Reality: You don't need to know location every second!
- Solution: Only update when user moves significantly

#### Real-Life Fix

```typescript
// BAD: Updates every second (like checking your watch every second)
setInterval(() => {
  getCurrentPosition(); // Drains battery!
}, 1000);

// GOOD: Only update when moved 50+ meters
watchPosition({
  distanceFilter: 50, // Only update if moved 50 meters
  useSignificantChanges: true, // iOS optimization
});
```

**Additional Optimizations:**

1. Reduce map re-renders (only update when needed)
2. Use significant location changes (iOS/Android built-in)
3. Like a car's GPS that updates less when stationary

---

### Scenario 2: Emergency Permission Change (Friday 5pm)

#### The Situation

Regulatory notice requires immediate action - like a restaurant being told to stop serving a dish immediately.

#### Step-by-Step Response

**Step 1: Don't Panic, But Act Fast**
Like a fire drill: Stay calm, but move quickly

**Step 2: Create Hotfix Branch**

```bash
git checkout -b hotfix/disable-location-permission
```

**Step 3: Add Feature Flag**

```typescript
const ENABLE_LOCATION = false; // Turn off immediately
```

**Step 4: Update Permission Files**

- iOS: `Info.plist` (remove location permission requests)
- Android: `AndroidManifest.xml` (same thing)

**Step 5: Deploy via CodePush (Not App Store)**

- App Store: Takes 1-2 days (too slow!)
- CodePush: Takes 5 minutes (like updating a website)
- Users get update within hours, not days

**Step 6: Communicate**
Tell PM: "Deployed in 30 minutes, users will get update in 1-2 hours"

**Step 7: Plan Proper Fix**
This was a band-aid, plan real fix for Monday

#### Real-Life Analogy

Like a restaurant removing a dish from the menu immediately (hotfix) while planning a permanent menu change (proper fix).

---

### Scenario 3: WebSocket Payload Change Causing Crashes

#### The Problem

Backend changed data format without telling mobile team.

**Expected Format:**

```json
{ "driver": { "name": "John" } }
```

**New Format (Causes Crash):**

```json
{ "driverName": "John" }
```

App crashes because it can't find `driver.name`!

#### How to Handle (Defensive Programming)

**BAD Code (Assumes data is always correct):**

```typescript
const driverName = data.driver.name; // CRASHES if driver doesn't exist!
```

**GOOD Code (Defensive - checks first):**

```typescript
const driverName = data?.driver?.name || data?.driverName || "Unknown Driver";
```

#### Step-by-Step Solution

**Step 1: Add Try-Catch (Safety Net)**

```typescript
try {
  const driverName = payload.driver.name;
  updateUI(driverName);
} catch (error) {
  showError("Unable to load driver info");
  logError(error, payload);
}
```

**Step 2: Add Validation (Like a Bouncer)**

```typescript
import { z } from "zod";

const WebSocketPayloadSchema = z.object({
  driver: z.object({
    name: z.string(),
    id: z.string(),
  }),
});

const result = WebSocketPayloadSchema.safeParse(payload);
if (!result.success) {
  console.error("Invalid payload shape:", result.error);
}
```

**Step 3: Version Payloads**

```typescript
if (payload.version === 1) {
  const name = payload.driver.name; // Old format
} else if (payload.version === 2) {
  const name = payload.driverName; // New format
}
```

**Step 4: Communicate with Backend Team**
"Hey, we're getting crashes. Can we add versioning?"

---

### Scenario 4: Apple Rejection - Background Location

#### The Problem

Apple is strict about privacy - like a bouncer checking if you really need to be in the VIP area.

#### Why Apple Rejects

1. Privacy concerns
2. Battery drain
3. Users might not understand why location is needed

#### How to Respond

**Step 1: Update Info.plist with Clear Description**

BAD (Vague):

```
"App needs location for better experience"
```

GOOD (Specific):

```
"Location is used to track your trip and notify you when your driver arrives.
Location is only used when you have an active trip."
```

**Step 2: Implement Smart Permission Requests**

Don't ask for "Always" permission immediately. Start with "While Using App".

**Step 3: Show User-Facing Explanation**

```typescript
// In your app, before requesting permission:
"To track your trip and notify you when your driver arrives,
we need location access. You can turn this off anytime in Settings."
```

**Step 4: Submit Detailed Justification to Apple**

"Background location is essential because:

1. Users need to see driver approaching in real-time
2. We notify users when driver is 2 minutes away
3. Location is only used during active trips
4. Users can disable anytime in Settings
5. We follow Apple's best practices for battery optimization"

**Step 5: Alternative Approach (If Still Rejected)**

- Use "While Using App" as primary
- Only request "Always" when trip is active
- Show clear UI: "Trip active - location needed for tracking"

---

## Small Code Challenge

### Complete Implementation with Explanations

```typescript
import * as z from "zod";
// Zod is like a bouncer that checks if data is valid
// Like checking ID at a club: "Are you 21? Is this ID real?"

import * as Keychain from "react-native-keychain";
// Keychain is like a safe for storing passwords/tokens
// Like a bank vault for your login credentials

// Step 1: Define what a valid location looks like
const PickupDropoffSchema = z.object({
  lat: z.number().min(-90).max(90), // Latitude must be between -90 and 90
  lng: z.number().min(-180).max(180), // Longitude must be between -180 and 180
});

// Step 2: Define what a valid trip request looks like
const TripRequestSchema = z
  .object({
    pickup: PickupDropoffSchema, // Must have valid pickup location
    dropoff: PickupDropoffSchema, // Must have valid dropoff location
    tripType: z.enum(["intra_city", "inter_city"]), // Must be one of these two
    estimatedDistanceKm: z.number().positive(), // Distance must be positive
    leadTimeMinutes: z.number().int().min(0), // Time must be integer, >= 0
  })
  // Step 3: Add custom business rule
  .refine(
    (data) => {
      // Custom rule: Inter-city trips need at least 3 minutes lead time
      if (data.tripType === "inter_city") {
        return data.leadTimeMinutes >= 3;
      }
      return true; // Intra-city trips don't have this requirement
    },
    {
      message: "leadTimeMinutes must be >= 3 for inter_city trips",
      path: ["leadTimeMinutes"],
    }
  );

// Validation function
export const validateTripRequest = (
  payload: unknown
):
  | { valid: true; data: z.infer<typeof TripRequestSchema> }
  | {
      valid: false;
      error: { code: number; message: string; fields?: Record<string, string> };
    } => {
  try {
    const data = TripRequestSchema.parse(payload);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fields[err.path.join(".")] = err.message;
        }
      });
      return {
        valid: false,
        error: {
          code: 400,
          message: "Validation failed",
          fields,
        },
      };
    }
    return {
      valid: false,
      error: {
        code: 400,
        message: "Invalid request payload",
      },
    };
  }
};

// Auth Guard - Like a security guard checking your ID
export const withAuthGuard = async <T>(
  handler: (token: string) => Promise<T>
): Promise<T | { code: 401; message: string }> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials || !credentials.password) {
      return { code: 401, message: "Unauthorized: No token found" };
    }
    return await handler(credentials.password);
  } catch (error) {
    return { code: 401, message: "Unauthorized: Failed to retrieve token" };
  }
};

// Usage example
export const requestTrip = async (payload: unknown) => {
  return withAuthGuard(async (token) => {
    const validation = validateTripRequest(payload);
    if (!validation.valid) {
      return validation.error;
    }

    // Make API call with token
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    return await response.json();
  });
};
```

### Real-Life Example

**User sends this (WRONG):**

```json
{
  "pickup": { "lat": "37.7749", "lng": -122.4194 },
  "dropoff": { "lat": 37.7849, "lng": -122.4294 },
  "tripType": "inter_city",
  "estimatedDistanceKm": 10,
  "leadTimeMinutes": 2
}
```

**Validation returns:**

```json
{
  "valid": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "fields": {
      "pickup.lat": "Expected number, got string",
      "leadTimeMinutes": "leadTimeMinutes must be >= 3 for inter_city trips"
    }
  }
}
```

---

# Section 2 — Take-Home Task

## Project Structure Explained

```
comfort-passenger-app/
├── src/
│   ├── screens/          → Full-page views (like different rooms)
│   │   ├── HomeScreen.tsx    → Where user enters pickup/dropoff
│   │   └── MapScreen.tsx     → Shows map with vehicles
│   │
│   ├── components/        → Reusable UI pieces (like furniture)
│   │   ├── MapView.tsx       → The map itself (reusable)
│   │   ├── LocationInput.tsx → Input field for addresses
│   │   └── VehicleMarker.tsx → Icon showing a vehicle on map
│   │
│   ├── services/         → Workers that do the actual work
│   │   ├── websocket.ts      → Handles real-time communication
│   │   ├── location.ts        → Handles GPS location
│   │   └── storage.ts        → Handles saving/loading data
│   │
│   ├── store/            → Global state (like a shared whiteboard)
│   │   └── tripStore.ts      → Keeps track of current trip status
│   │
│   ├── utils/            → Helper functions (like tools)
│   │   └── errorBoundary.tsx → Catches crashes and shows error screen
│   │
│   └── types/            → TypeScript definitions (like a dictionary)
│       └── index.ts          → Defines what data structures look like
```

**Real-life analogy:**

- Screens = rooms (Home, Map)
- Components = furniture (reusable)
- Services = workers (do the work)
- Store = shared whiteboard (everyone can see/update)
- Utils = tools (helpers)

## WebSocket Service Explained

```typescript
// services/websocket.ts
import io from "socket.io-client";
// Socket.io is like a walkie-talkie for instant communication

import { getToken } from "./storage";

let socket: any = null;

export const connectWebSocket = async () => {
  // Step 1: Get the user's authentication token
  const token = await getToken();

  // Step 2: Connect to the WebSocket server
  socket = io("wss://api.comfort.com", {
    auth: { token },
    transports: ["websocket"],
  });

  // Step 3: Listen for "trip.accepted" event
  socket.on("trip.accepted", (data) => {
    tripStore.setTripStatus("accepted");
    tripStore.setDriver(data.driver);
    showNotification("Driver accepted your trip!");
  });

  return socket;
};

export const requestTrip = (pickup: Location, dropoff: Location) => {
  socket?.emit("trip.requested", { pickup, dropoff });
};
```

**Real-life flow:**

1. User clicks "Request Trip" → `requestTrip()` sends event
2. Server finds driver → sends "trip.accepted"
3. App receives event → updates UI automatically

## Offline Handling Explained

```typescript
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check if device is online
export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

// Save last known location (for offline use)
export const saveLastLocation = async (location: Location) => {
  await AsyncStorage.setItem("lastLocation", JSON.stringify(location));
};

// Get last known location (when offline)
export const getLastLocation = async (): Promise<Location | null> => {
  const stored = await AsyncStorage.getItem("lastLocation");
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

// Queue requests when offline
export const queueRequest = async (request: TripRequest) => {
  const queue = await getRequestQueue();
  queue.push(request);
  await AsyncStorage.setItem("requestQueue", JSON.stringify(queue));
};

// Send queued requests when back online
export const syncQueuedRequests = async () => {
  if (!(await isOnline())) {
    return;
  }

  const queue = await getRequestQueue();

  for (const request of queue) {
    try {
      await sendTripRequest(request);
      removeFromQueue(request.id);
    } catch (error) {
      console.error("Failed to sync request:", error);
    }
  }
};
```

**Real-life analogy:**
Like a restaurant taking orders on paper when the POS is down, then entering them when it's back online.

## Testing Guide

### Unit Test Example

```typescript
// __tests__/utils.test.ts
import { validateTripRequest } from "../src/utils/validation";

describe("validateTripRequest", () => {
  it("should accept valid intra_city trip", () => {
    const payload = {
      pickup: { lat: 37.7749, lng: -122.4194 },
      dropoff: { lat: 37.7849, lng: -122.4294 },
      tripType: "intra_city",
      estimatedDistanceKm: 5,
      leadTimeMinutes: 2,
    };

    const result = validateTripRequest(payload);

    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should reject inter_city trip with leadTime < 3", () => {
    const payload = {
      pickup: { lat: 37.7749, lng: -122.4194 },
      dropoff: { lat: 37.7849, lng: -122.4294 },
      tripType: "inter_city",
      estimatedDistanceKm: 50,
      leadTimeMinutes: 2, // Too short!
    };

    const result = validateTripRequest(payload);

    expect(result.valid).toBe(false);
    expect(result.error.fields).toHaveProperty("leadTimeMinutes");
  });
});
```

### E2E Test Example

```typescript
// __tests__/e2e/trip-request.e2e.ts
describe("Trip Request Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should complete trip request flow", async () => {
    await element(by.id("pickup-input")).typeText("Airport");
    await element(by.id("dropoff-input")).typeText("Hotel");
    await waitFor(element(by.id("map-view")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id("request-button")).tap();
    await waitFor(element(by.id("trip-accepted-message")))
      .toBeVisible()
      .withTimeout(10000);
    expect(element(by.id("driver-name"))).toBeVisible();
  });
});
```

## README Template

```markdown
# COMFORT Passenger App

## Assumptions & Decisions

1. **State Management**: Chose Zustand for simplicity and performance
2. **Maps**: Using React Native Maps with Google Maps provider
3. **Offline Strategy**: Cache last known location and map tiles in AsyncStorage
4. **WebSocket**: Socket.io client for real-time communication
5. **Testing**: Jest for unit tests, Detox for E2E

## Setup Instructions

1. Install dependencies: `npm install` or `yarn install`
2. iOS: `cd ios && pod install && cd ..`
3. Configure environment variables (WebSocket URL, API keys)
4. For Android: Ensure Android SDK and emulator are set up

## How to Run Locally & Test

### Development

- iOS: `npm run ios`
- Android: `npm run android`

### Testing

- Unit tests: `npm test`
- E2E: `npm run e2e:android` (requires emulator running)

### Manual Testing Checklist

1. Open app → verify location permission
2. Enter pickup/dropoff → verify map updates
3. Click "Request Trip" → verify WebSocket event sent
4. Mock trip.accepted event → verify UI updates
5. Turn off network → verify offline mode (cached location shown)

## What I'd Improve with +4 Hours

1. **Error Handling**: More comprehensive error boundaries
2. **Animations**: Smooth transitions for trip status changes
3. **Testing**: More unit tests for edge cases
4. **Performance**: Optimize map rendering
5. **Accessibility**: Add proper labels and screen reader support
6. **Offline Queue**: Implement proper request queuing and retry logic
```

---

# Section 3 — Reflection & Attitude

## Trade-offs Question

### The Situation

2 hours before launch. You can either:

- Write missing tests for GPS permission flows, OR
- Implement "favorite locations" feature

### Answer: Write Tests for GPS Permission Flows

### Why (Explained Simply)

**1. Risk Management**

- Permission issues can cause app store rejections
- Like checking the brakes before a road trip

**2. Technical Debt**

- Missing tests create future maintenance burden
- Like skipping oil changes - works now, breaks later

**3. User Impact**

- Permission failures block core functionality
- Like a restaurant where you can't order

**4. Feature Priority**

- "Favorite locations" is nice-to-have
- Like adding a sunroof vs fixing the engine

**5. Launch Readiness**

- Tests protect against regressions
- Like a safety check before takeoff

### Real-Life Analogy

Before opening a restaurant, fix the kitchen (tests) before adding a dessert menu (favorite locations).

---

## Collaboration Style

### Giving Feedback Example

```typescript
// Code Review Example:

// BEFORE (What I see in PR):
const requestTrip = async (data) => {
  const token = await AsyncStorage.getItem('token');
  fetch('/api/trips', {
    method: 'POST',
    headers: { 'Authorization': token },
    body: JSON.stringify(data),
  });
};

// My Feedback:
"Hey! Good start on the trip request function. A few suggestions:

1. **Security**: Storing JWT in AsyncStorage isn't encrypted. Consider using
   react-native-keychain for sensitive data.

2. **Error Handling**: The fetch call doesn't handle errors. What if network fails?
   Consider adding try-catch and user-friendly error messages.

3. **Type Safety**: Adding TypeScript types would help catch bugs early.

4. **Testing**: This would be a great candidate for a unit test!

Overall great work! These are just suggestions to make it more robust."
```

### Receiving Feedback Example

```typescript
// When someone reviews my code:

// Their Feedback:
"The WebSocket connection should be a singleton to avoid multiple connections."

// My Response:
"Great catch! You're right - I didn't consider that multiple components might
try to connect. I'll refactor it to use a singleton pattern.

Quick question: Should I also add reconnection logic in case the connection drops?
I'm thinking exponential backoff. What's your experience with that?

Thanks for the review!"
```

---

## Learning & Curiosity

### Example Answer

**Topic:** React Native performance optimization with Flipper

**How I Learned It:**

1. **Problem**: App was slow, didn't know why
2. **Research**: Read docs, watched tutorials
3. **Hands-On**: Built test app with intentional issues
4. **Implementation**: Applied fixes, measured improvements (30% faster)
5. **Sharing**: Wrote blog post, shared with team

**What I Learned:**

- How to use Flipper's performance monitor
- How to identify re-render issues
- How to optimize React Native lists
- How to measure performance improvements

### Real-Life Analogy

Like learning to fix your own car: problem → research → practice → apply → share.

---

## Integrity in Work

### The Situation

Stakeholder asks to hide crash logs for a demo. "Fix it later."

### Answer: Decline and Explain Why

### Example Response

```
"I understand the pressure to have a perfect demo, but I have concerns about
hiding crash logs:

1. **Risk**: If the demo crashes, it will look worse than being upfront about
   known issues. Stakeholders will lose trust.

2. **Ethics**: Hiding problems misrepresents the product's true state. This
   could lead to unrealistic expectations.

3. **Better Solution**: Let's use a stable build for the demo (one without
   crashes), and I'll work on fixing the crashes in parallel. This way:
   - Demo goes smoothly
   - We're transparent about the work
   - Crashes get fixed properly

4. **Timeline**: I can have the crashes fixed by [realistic date]. For the demo,
   we can use build v1.2.3 which is stable.

What do you think? I'm happy to work extra hours to get this right."
```

### Real-Life Analogy

Like a mechanic refusing to hide a problem: "I won't cover this up, but here's how we can fix it properly."

---

## Summary: Key Concepts for Beginners

1. **Architecture**: Organize code into layers (UI, Services, Storage)
2. **WebSockets**: Instant, two-way communication (like phone call vs letter)
3. **Offline-First**: App works without internet (like taking notes offline)
4. **Secure Storage**: Encrypted storage for sensitive data (like a safe)
5. **Testing**: Automated checks to catch bugs (like car inspection)
6. **Code Review**: Team members review each other's code (like peer review)
7. **Integrity**: Do the right thing, even under pressure (like being honest)

---

## Additional Tips for Success

1. **Architecture**: Draw a clear diagram showing data flow
2. **Code Quality**: Use TypeScript, proper error handling, clean code
3. **Testing**: Include both unit and E2E tests
4. **Documentation**: Clear README with setup and decisions
5. **Time Management**: Prioritize core features first

---

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Zod Validation Library](https://zod.dev/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)
- [CodePush Documentation](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)

---

**Good luck with your test! Remember:**

- Answer honestly and clearly
- Incomplete answers are fine if you explain your reasoning
- Show your thought process
- Demonstrate ownership and curiosity

---

_This guide was created to help you understand the COMFORT App Senior React Native Engineer pre-qualification test. All explanations use real-life analogies to make complex concepts easier to understand._
