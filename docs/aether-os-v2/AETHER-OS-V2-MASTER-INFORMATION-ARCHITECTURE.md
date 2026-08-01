# AETHER OS V2 — MASTER INFORMATION ARCHITECTURE

**Classification:** Internal product architecture specification  
**Status:** Binding information architecture doctrine  
**Source of truth:** `AETHER-OS-V2-MASTER-PRODUCT-VISION.md` (only)  
**Audience:** Founders, product, architecture, design systems leadership  
**Constraint:** Logical organization of the operating system only. No UI. No code. No visual design. No implementation.

This document defines **how Aether is structured as an operating system**: where concepts live, how they nest, how a human moves between them, and what is forbidden at each altitude.

If a proposal cannot be placed cleanly inside this IA without violating the Vision’s principles, the proposal is rejected.

---

# Document Laws

These laws govern every section below. They are derived exclusively from the Master Product Vision.

1. **Primary object = Session of Becoming.** Everything else exists to create, protect, evaluate, and compound Sessions.  
2. **Life → Season → Domain → Journey → Project → Goal → System → Habit → Daily Action → Session → Reflection → Analytics → Mastery → Legacy.** Skipping levels creates fake progress.  
3. **Domains are organs, not apps.** Interconnection is first-class.  
4. **Execution over intention.** Intention objects never outrank evidence objects.  
5. **Seasons are finite.** Infinite hierarchy without season context is forbidden.  
6. **Clarity over completeness.** Navigation shows the right altitude for the job, not every object in the universe.  
7. **Scoreboard integrity is sacred.** Structure must never make inflation easy.  
8. **Legacy is first-class.** Archives are destinations, not trash.  
9. **AI is a systems coach with memory of evidence**, bound by the same principles as the OS.  
10. **North-star filter:** Does this help a person execute their becoming — across interconnected domains — with evidence that compounds into mastery and legacy?

---

# Canonical Containment Stack (Reference)

```text
Life
 └─ Season
     └─ Domain (selected for Season; Domain persists across Seasons)
         └─ Journey
             └─ Project
                 └─ Goal
                     └─ System
                         └─ Habit
                             └─ Daily Action
                                 └─ Session  ← PRIMARY OBJECT
                                     └─ Reflection
                                         └─ Analytics
                                             └─ Mastery
                                                 └─ Legacy
```

**Altitude note:** Domains endure beyond a single Season. A Season *selects and activates* Domains; it does not own them permanently. Journeys and Projects may end; Domains persist. Legacy and Mastery accumulate across Life.

---

# 1. Root Navigation

## Purpose

Root Navigation answers: **Am I outside the OS, entering the OS, or inside the OS — and in which mode of attention?**  
It is the outermost partition of the product’s conceptual space.

## Responsibilities

- Separate public/identity surfaces from the authenticated Personal OS.  
- Separate first-run / season-setup commitment from day-to-day operation.  
- Establish the user’s current **attention mode** once inside the OS Shell.  
- Protect the OS Shell from marketing, legal, and auth noise.

## Parent

- None (root of the product information space).

## Children

| Root space | Role |
|------------|------|
| **Public / Entry** | Landing, invite, legal, marketing narrative |
| **Identity Gate** | Sign-in, sign-up, recovery, session integrity |
| **Onboarding / Season Setup** | First Season commitment; later new-Season commissioning |
| **OS Shell** | The Personal Operating System itself |
| **System Integrity** | Account security, device sessions, billing (future), export/delete |

### OS Shell attention modes (children of OS Shell)

| Mode | Altitude | Job |
|------|----------|-----|
| **Operate** | Today / Now | Execute Sessions |
| **Steer** | Week / Season | Adjust Systems, Goals, Journeys |
| **Understand** | Analytics / Mastery | Read evidence and patterns |
| **Remember** | Legacy / Archive | History and meaning |
| **Configure** | Settings | Preferences and integrity |
| **Coach** | AI | Systems coaching with evidence |

## Relationships

- Public / Entry → Identity Gate → Onboarding / Season Setup → OS Shell.  
- System Integrity is reachable from Configure and from Identity Gate, but is not a Domain.  
- Coach mode may overlay Operate/Steer/Understand without becoming a separate life domain.  
- Leaving OS Shell to Public is rare and intentional (sign-out, legal, account deletion).

## Navigation flow

1. Unauthenticated user lands in Public / Entry.  
2. Identity Gate authenticates.  
3. If no active Season → Onboarding / Season Setup (mandatory before Operate).  
4. If Season active → OS Shell in Operate mode (default).  
5. User may switch Shell modes; Root does not change unless they exit auth or open System Integrity flows that suspend operation.

## Rules

- No Domain may be a Root peer of the OS Shell.  
- No Session may live outside OS Shell once authenticated.  
- Marketing content must not appear inside OS Shell.  
- Onboarding must establish Season identity, selected Domains, and victory conditions before Daily Actions/Sessions are presented as “the product.”  
- Root modes are few and fixed; users do not invent custom Root tabs.

## What belongs there

- Partition of life into Entry / Identity / Setup / Shell / System.  
- Shell attention modes that map to Vision altitudes (execute, steer, understand, remember, configure, coach).

## What should never belong there

- Domain-specific deep content (e.g., “Gym” as a Root destination equal to Life).  
- Task inboxes as Root home.  
- Infinite custom Root destinations.  
- Analytics widgets as Root peers to Identity.  
- Intention-only surfaces (boards of plans) as the Root default.

---

# 2. Global Navigation

## Purpose

Global Navigation answers: **Which primary OS job am I doing, regardless of which Domain I last visited?**  
It is the persistent spine of the OS Shell.

## Responsibilities

- Provide always-available destinations for the Vision’s core jobs.  
- Keep Session execution one step from anywhere.  
- Expose Season, Mastery, Legacy, Coach, and Settings without burying them in Domains.  
- Express interconnection by making cross-domain Home the default Operate surface.

## Parent

- OS Shell (Root Navigation).

## Children (canonical Global destinations)

1. **Home** — Operate: today’s Sessions across Domains.  
2. **Domains** — Organ map; entry to Domain Architecture.  
3. **Season** — Current chapter: identity, domains in play, victory conditions.  
4. **Journeys** — Active arcs across selected Domains (may nest under Domains + Season; Global exposes “active journeys”).  
5. **Mastery** — Trajectories of competence and integrity.  
6. **Analytics** — Evidence surfaces.  
7. **Legacy** — Long-term archive and narrative.  
8. **Coach (AI)** — Systems coach entry.  
9. **Search** — Global Search Architecture.  
10. **Command** — Command Palette (invoke, not a content destination).  
11. **Notifications** — Attention lane for OS signals.  
12. **Settings** — Configure mode.

Optional Global-adjacent (not Domains):

- **Quick Actions** — Universal quick actions (see Session / Home rules).  
- **Archive** — May be entered via Legacy; Archive is the mechanism, Legacy is the meaning.

## Relationships

- Home consumes Daily Actions → Sessions from all active Domains.  
- Domains feed Home, Season, Analytics, Mastery.  
- Season constrains which Domains and Journeys are “in play.”  
- Coach reads Sessions, Reflections, Analytics, Season goals; never invents Mastery.  
- Search and Command can deep-link into any Global child without becoming parents of those objects.

## Navigation flow

- Default Global landing after auth + Season = **Home**.  
- From any Global destination, user can: open Command, Search, Notifications, return Home, enter a Domain, open Season.  
- Completing a Session may route to Session Reflection, then back to Home or next Session — not to a celebration destination that becomes the product.  
- Season end routes to Season Reflection → Analytics → Mastery update → Legacy archive package → optionally new Season Setup.

## Rules

- Global destinations are **jobs**, not content dumps.  
- Domains never replace Home as the default Operate surface.  
- “Projects” and “Sessions” are not Global roots; they are reached through Domain / Journey / Home.  
- Global nav must not grow into a second Root.  
- Adding a Global destination requires Vision north-star justification and must not violate Law of Minimum Domains (don’t Globalize every Domain feature).

## What belongs there

- Cross-domain OS jobs: operate, map organs, steer season, read mastery/analytics, remember legacy, coach, configure, find, command.

## What should never belong there

- Per-exercise library browsers as Global peers.  
- Social feeds.  
- Arbitrary note gardens.  
- Per-Domain dashboards duplicated at Global level (Domain has its own architecture).  
- Intention boards that outrank today’s Sessions.

---

# 3. Screen Hierarchy

## Purpose

Screen Hierarchy defines the **logical surfaces** a user can occupy — conceptual places in the OS — ordered by altitude and dependency.  
“Screen” here means *information surface*, not UI layout.

## Responsibilities

- Define allowed depths of attention.  
- Prevent infinite nested destinations that recreate Notion sprawl.  
- Ensure every surface has a clear parent and a clear job.  
- Map Vision stack levels to navigable surfaces.

## Parent

- Global Navigation destinations (and Root spaces for Entry/Setup).

## Children (logical surface tree)

```text
Root surfaces
 ├─ Public / Entry surfaces
 ├─ Identity Gate surfaces
 ├─ Onboarding / Season Setup surfaces
 └─ OS Shell surfaces
     ├─ Home surface
     ├─ Domains index surface
     │   └─ Domain surface
     │       ├─ Domain Overview
     │       ├─ Domain Journeys index
     │       │   └─ Journey surface
     │       │       ├─ Journey Overview
     │       │       ├─ Projects index
     │       │       │   └─ Project surface
     │       │       │       ├─ Goals
     │       │       │       └─ Systems (linked)
     │       │       ├─ Systems index (Journey-scoped)
     │       │       └─ Journey Sessions / history
     │       ├─ Domain Systems
     │       ├─ Domain Analytics
     │       └─ Domain Mastery
     ├─ Season surface
     │   ├─ Season Identity & victory conditions
     │   ├─ Season Domains in play
     │   ├─ Season Reviews
     │   └─ Season Archive (at close)
     ├─ Session surfaces
     │   ├─ Session Ready (pre-execution)
     │   ├─ Session Active (execution)
     │   ├─ Session Complete (evidence close)
     │   └─ Session Reflection
     ├─ Reflection surfaces (weekly / season altitudes)
     ├─ Analytics surfaces (Life / Season / Domain / Journey)
     ├─ Mastery surfaces
     ├─ Legacy surfaces
     ├─ Coach surfaces
     ├─ Search results surface
     ├─ Notifications surface
     ├─ Settings surfaces
     └─ Archive surfaces
```

## Relationships

- Deeper surfaces inherit Season and Domain context when applicable.  
- Session surfaces can be entered from Home, Domain, Journey, Project, Notification, Search, Command, Coach — but Session remains the same object.  
- Analytics and Mastery surfaces are largely **read / interpret**; they do not create Sessions.  
- Legacy surfaces are largely **read / curate**; they do not mutate past Session evidence.

## Navigation flow

**Operate depth (shallow):** Home → Session Ready → Active → Complete → Reflection → Home.  
**Steer depth (medium):** Season or Domain → Journey → Project / System → adjust → back.  
**Understand depth:** Analytics or Mastery → optional Domain drill → optional Session evidence trail.  
**Remember depth:** Legacy → Season Archive package → artifacts / principles.  
**Rule of return:** Deep Steer/Understand must always offer return to Home Operate without climbing the entire tree manually (conceptually: “return to today”).

## Rules

- Maximum conceptual depth should remain cognitively short: prefer Home → Session over Domain → Journey → Project → Goal → System → Habit → Action → Session for daily use. Deep tree exists for Steer; Operate bypasses it.  
- Empty surfaces must ask for Season/Domain commitment, not present a blank canvas.  
- No surface may mark progress without Session evidence (Vision Principle 1).  
- Surfaces that create objects (Goals, Systems, Projects) belong to Steer mode altitudes, not Operate default.

## What belongs there

- One surface per clear job at each altitude.  
- Session lifecycle surfaces as first-class.  
- Season and Legacy as first-class, not buried.

## What should never belong there

- Duplicate “second homes” per Domain that replace Global Home.  
- Surfaces whose only job is aesthetic configuration.  
- Surfaces that auto-complete Sessions by clock.  
- Infinite wiki-like page trees without Session/Season binding.

---

# 4. Object Hierarchy

## Purpose

Object Hierarchy defines the **canonical nouns** of Aether and their containment — the data-model-of-meaning, independent of screens.

## Responsibilities

- Name every first-class object in the Vision stack.  
- Define which objects contain which.  
- Define which objects are ephemeral vs durable.  
- Prevent fake first-class objects (tags as life containers, streaks as identity, etc.).

## Parent

- Life (ultimate container of meaning).

## Children (objects, with durability)

| Object | Durability | Role |
|--------|------------|------|
| **Life** | Permanent | Continuous identity across decades |
| **Season** | Bounded chapter | Finite campaign with victory conditions |
| **Domain** | Enduring organ | Stable arena of self |
| **Journey** | Finite arc | Curriculum/narrative inside Domain |
| **Project** | Finite artifact/outcome | Externalized proof |
| **Goal** | Mid-stack target | Proof target under Project/Journey |
| **System** | Durable protocol | Repeatable process (heart of OS) |
| **Habit** | Supporting atom | Implementation detail of System |
| **Daily Action** | Date-scoped | Translation of System → today |
| **Session** | Event of truth | Primary object — executed identity |
| **Reflection** | Event / document | Sense-making at multiple altitudes |
| **Analytics** | Derived evidence | Computed from Sessions + Reflections |
| **Mastery** | Durable trajectory | Competence + integrity over time |
| **Legacy** | Curated archive | Life viewed with evidence |
| **Principle** | Durable insight | Hard-won rule extracted via Reflection |
| **Artifact** | Durable output | Shipped proof (writing, software, brand asset, etc.) |
| **Interconnection Signal** | Derived | Cross-domain risk/opportunity |

## Relationships

- Season **selects** Domains; Domains **host** Journeys/Systems.  
- Journey **contains** Projects and may bind Systems.  
- Project **contains** Goals; Goals **achieved via** Systems + Sessions.  
- System **generates** Habits + Daily Actions; Daily Actions **group into** Sessions.  
- Session **triggers** Reflection (optional at session altitude; required at week/season).  
- Sessions + Reflections **feed** Analytics → Mastery → Legacy.  
- Artifacts attach primarily to Projects/Journeys; Principles attach to Reflection/Legacy.  
- Interconnection Signals relate Domain ↔ Domain via Analytics/Coach.

## Navigation flow (object traversal)

Users do not navigate “objects” abstractly; they navigate surfaces that resolve objects:

- Operate resolves **Daily Action → Session**.  
- Steer resolves **Season → Domain → Journey → Project/System**.  
- Understand resolves **Analytics → Mastery** with drill to Session evidence.  
- Remember resolves **Legacy → Season Archive → Artifacts / Principles**.

## Rules

- **No Session evidence, no progress.**  
- Goals never outrank Season identity.  
- Habits never become the ceiling of the product.  
- Daily Actions are not Mastery.  
- Analytics objects are derived; users do not “create analytics.”  
- Domains are expensive to add (Law of Minimum Domains).  
- Systems shrink under friction; they do not vanish (Law of Shrink, Don’t Skip).

## What belongs there

- The Vision transformation stack objects, plus Principle, Artifact, Interconnection Signal as supporting first-class concepts.

## What should never belong there

- “Task” as primary object.  
- “Note” as primary object.  
- “Streak” as a container (streak is a metric of Session integrity, not a parent).  
- “Folder” / freeform page as Life architecture.  
- Social posts as Domains.  
- XP events without Session evidence.

---

# 5. Navigation Rules

## Purpose

Navigation Rules are the **laws of motion** through the OS — how movement is allowed, forced, blocked, or demoted.

## Responsibilities

- Keep Operate path short.  
- Keep Steer path honest (evidence before redesign).  
- Prevent intention inflation via navigation.  
- Encode Vision anti-goals into movement constraints.

## Parent

- Document Laws + Global Navigation + Object Hierarchy.

## Children (rule classes)

1. **Altitude rules** — which mode for which job.  
2. **Bypass rules** — Operate may bypass deep tree.  
3. **Commitment rules** — Season before Operate.  
4. **Evidence rules** — no progress routes without Session close.  
5. **Return rules** — always recoverable to Home/Today.  
6. **Demotion rules** — Later/backlog cannot outshout Now.  
7. **Domain expense rules** — adding Domain is a Season-level act.  
8. **Archive rules** — Seasons archive by default; delete is exceptional.

## Relationships

- Navigation Rules constrain Screen Hierarchy and all Architecture sections below.  
- Coach navigation suggestions must obey the same rules (AI cannot invent shortcuts that grant Mastery).  
- Notifications deep-links must land on legal surfaces with correct altitude.

## Navigation flow (canonical paths)

| Intent | Legal path |
|--------|------------|
| Do today’s work | Home → Session lifecycle → Home |
| Change a protocol | Evidence glance (Analytics/Reflection) → System edit (Steer) → next Sessions |
| Start new Domain | Season Setup / Season amend (expensive) → Domain activation → Journey/System seed |
| Understand pattern | Analytics → Domain/Journey drill → Session evidence |
| Close a Season | Season Review Reflection → Mastery update → Legacy archive → rest/commission next |
| Find anything | Search or Command → object surface |
| Get coached | Coach → cited recommendation → optional System/Session action |

## Rules (normative)

1. **Default is Operate.** After auth, land on Home unless Season missing.  
2. **Season gate.** No Operate without active Season (except read-only Legacy during inter-season rest, if product allows rest state).  
3. **Session primacy.** From anywhere, “next Session” must be reachable in one conceptual hop.  
4. **Backlog silence.** Later lists exist; they cannot be the default landing.  
5. **No calendar-complete.** Navigating past a date never completes Sessions.  
6. **Shrink path.** When user signals overload, navigation offers shrink Session/System, not skip Domain.  
7. **Interconnection surfacing.** Cross-domain risk may route user to supporting Domain Session, not only nag.  
8. **Scoreboard protection.** Navigation into “adjust Mastery” manually is forbidden; Mastery updates via evidence pipeline.  
9. **Clarity budget.** A surface may emphasize one primary action set; secondary destinations are demoted.  
10. **Anti-configuration loop.** Settings and object creation must not become the daily path.

## What belongs there

- Motion laws, gates, demotions, mandatory returns, season/domain expense, evidence requirements.

## What should never belong there

- UI gesture specs.  
- Animation timing.  
- Per-persona totally different IA (personas change defaults/intensity, not the noun graph).  
- Social growth loops as navigation incentives.

---

# 6. Dashboard Architecture

## Purpose

Dashboard Architecture defines the **Understand / Steer evidence cockpit** — where the organism is reviewed as a whole — distinct from Home’s Operate job.

## Responsibilities

- Present cross-domain evidence without becoming a metric toy.  
- Support weekly/season decision-making.  
- Surface interconnection signals.  
- Feed Season reviews and System adaptation.  
- Never replace Session execution.

## Parent

- Global → Analytics (primary) and optionally Season Review; conceptually “Dashboard” is the composed Analytics + Mastery pulse for the Life/Season organism.

## Children (logical zones)

1. **Season pulse** — identity, time remaining, victory-condition progress (evidence-based).  
2. **Domain health strip** — integrity/consistency per Domain in play.  
3. **Interconnection signals** — coupled risks/opportunities.  
4. **Mastery vectors** — trajectory summaries (not vanity XP).  
5. **System stress indicators** — which Systems are shrinking, failing, or compounding.  
6. **Evidence trail entry** — drill to Sessions/Reflections that produced the numbers.  
7. **Adaptation queue** — proposed System changes (human or Coach-cited), awaiting Steer action.

## Relationships

- Consumes Analytics derived from Sessions + Reflections.  
- Reads Season constraints and Domain set.  
- Writes nothing to Mastery directly; proposes Steer actions that change Systems/Goals.  
- Coach may annotate Dashboard zones with cited reasons.  
- Home may show a *tiny* Season pulse; full Dashboard lives in Understand altitude.

## Navigation flow

- Enter via Global Analytics / Mastery / Season Review.  
- Drill: Zone → Domain or Journey → Session evidence.  
- Exit to Steer: open System/Journey for adaptation.  
- Exit to Operate: return Home for next Session.  
- Forbidden exit: “mark week complete” without Session evidence.

## Rules

- Dashboard is **evidence-first**, emotion-second (Principle 5).  
- No zone may show progress that cannot drill to Sessions.  
- Interconnection is mandatory, not optional chrome.  
- Dashboard must not become daily Home.  
- Celebrate quietly; no fake confetti as primary purpose (Vision §7).  
- Intensity spikes without consistency must not dominate ranking.

## What belongs there

- Organism-level evidence, domain health, interconnection, mastery trajectories, system stress, adaptation queue.

## What should never belong there

- Today’s full Session execution UI (that is Home).  
- Raw note dumps.  
- Intention boards.  
- Social leaderboards as core.  
- Configuration panels.  
- Metrics that cannot cite Sessions.

---

# 7. Home Architecture

## Purpose

Home is the **Operate surface**: the daily center of the Personal OS.  
It answers the Vision’s ruthless daily question: *What must be executed now for the person you are becoming?*

## Responsibilities

- Present today’s Sessions across Domains with clarity, not clutter.  
- Carry Season identity as context (who you are becoming), not as a second dashboard.  
- Order attention: Now > Next > Later.  
- Enable Session start/complete with integrity.  
- Offer shrink-not-skip when load is high.  
- Keep interconnection visible without drowning execution.

## Parent

- Global Navigation → Home (Operate mode).

## Children (logical regions)

1. **Season identity pulse** — short identity statement + season horizon.  
2. **Today Sessions rail** — executable Sessions derived from Daily Actions across Domains.  
3. **Now Session** — single primary focus.  
4. **Up next** — ordered queue.  
5. **Deferred / Later** — demoted, silenced.  
6. **Minimum faithful set** — shrink offerings when chaos detected.  
7. **Evening close cue** — path to daily Reflection altitude (not a second product).  
8. **Cross-domain caution** — lightweight interconnection flags (e.g., training drop → deep work risk).

## Relationships

- Home **reads** Season, Domains in play, Systems → Daily Actions → Sessions.  
- Home **writes** Session state transitions (ready → active → complete).  
- Home **links** to Domain/Journey only as secondary navigation.  
- Home **does not** create Projects/Goals as primary actions.  
- Notifications and Coach may inject into Today Sessions rail with rules.

## Navigation flow

1. Land on Home.  
2. Select Now Session → Session Ready → Active → Complete.  
3. Optional Session Reflection.  
4. Return Home; next Session becomes Now.  
5. If all complete → integrity state (day earned), optional evening Reflection.  
6. If incomplete → honest miss state; Reflection may capture why; Systems may shrink tomorrow — history not rewritten.

## Rules

- Home emphasizes **today’s Sessions**, not entire backlog (Principle 9).  
- One Now. Many Next. Silent Later.  
- Domain cards do not replace Session list.  
- Scheduling is scaffolding; completion is score.  
- Home must work for Beginner persona (few Domains, clear Sessions) and Founder persona (protected non-negotiables) without splitting into different products.  
- No XP for opening Home.

## What belongs there

- Season context, today’s executable Sessions, shrink controls, light interconnection cautions, path to daily Reflection.

## What should never belong there

- Full Analytics Dashboard.  
- Deep Project planning.  
- Settings sprawl.  
- Infinite note capture as the center.  
- Marketing.  
- “Mark all done” without Session closes.  
- Social feeds.

---

# 8. Domain Architecture

## Purpose

Domain Architecture defines how an **enduring organ of the self** is organized inside the OS — not as a separate app, but as a coherent arena sharing Season, identity, calendar truth, energy, and mastery language.

## Responsibilities

- Hold Journeys, long-running Systems, Domain Analytics, Domain Mastery.  
- Express Domain identity (Athlete, Builder, Writer, Operator, etc.).  
- Expose interconnection ports to other Domains.  
- Provide Steer surfaces for Domain-specific protocols without fragmenting Life.

## Parent

- Life (enduring).  
- Season (activation / selection).  
- Global → Domains index.

## Children

1. **Domain Identity** — who you are in this arena.  
2. **Active Journeys**  
3. **Standing Systems** (may outlive Journeys)  
4. **Projects** (via Journeys or Domain-level)  
5. **Domain Session history**  
6. **Domain Analytics**  
7. **Domain Mastery**  
8. **Interconnection ports** — declared couplings (e.g., Body → Software energy)  
9. **Domain Principles** — hard-won Domain rules  
10. **Domain Artifacts** index (proof)

### Default Domains (Vision launch set)

| Domain | Organ meaning |
|--------|----------------|
| **Body** | Physiological substrate; energy, mood stability, cognitive endurance |
| **Reading** | Knowledge intake; judgment, language, models of reality |
| **Writing** | Clarity, courage, distribution of thought |
| **Software** | Leverage, shipping, problem-solving power |
| **Brand** | Market feedback, reputation, opportunity surface |

Future Domains (expensive): Faith, Finance, Relationships, etc.

## Relationships

- Domain ↔ Season: selected or paused.  
- Domain → Journey → Project → Goal → System → … → Session.  
- Domain ↔ Domain: Interconnection Signals.  
- Reading → Writing → Brand pipeline is first-class coupling.  
- Body supports all Domains’ deep work capacity.  
- Software Projects may become Brand proof Artifacts.  
- Writing may consume Reading highlights as raw material (conceptual link).

## Navigation flow

- Domains index → Domain Overview → (Operate shortcut to today’s Domain Sessions) or Steer into Journeys/Systems.  
- From Domain Analytics → Session evidence.  
- From Domain Mastery → unlock harder Journeys (conceptual gate).  
- Never: Domain as isolated login world.

## Rules

- Domains are not separate apps (Vision §6.3, §8.4).  
- Adding a Domain is Season-expensive (Law of Minimum Domains).  
- Typical Season runs **3–5 Domains max**.  
- Pausing a Domain is allowed; deleting Domain history is exceptional.  
- Domain Overview may show health, but daily execution still prefers Home.  
- Domain-specific libraries (exercises, books, stacks) are **resources under Systems/Journeys**, not peer Domains.

## What belongs there

- Identity, Journeys, Systems, Projects, Domain evidence, mastery, interconnection ports, principles, artifacts.

## What should never belong there

- Life-level Settings.  
- Other Domains’ full trees duplicated.  
- Social network features as Domain core.  
- Intention-only boards with no Session path.  
- “Mini-apps” that hide interconnection.

---

# 9. Season Architecture

## Purpose

Season Architecture defines the **bounded chapter of identity** — the finite campaign that creates urgency without panic, endings that allow rest, and archives that become Legacy (Vision §6.2, §8.6).

## Responsibilities

- Hold identity statement, duration, primary Domains, non-negotiables, definition of “season won,” archive policy.  
- Constrain attention for a chapter of Life.  
- Trigger deep Reflection → Analytics → Mastery → Legacy at close.  
- Prevent infinite self-improvement guilt.

## Parent

- Life.  
- Global → Season.  
- Entered also via Onboarding / Season Setup (Root).

## Children

1. **Season Identity statement**  
2. **Duration / horizon**  
3. **Domains in play** (selected subset)  
4. **Non-negotiables** (Systems/Sessions that shrink but don’t die)  
5. **Victory conditions** (“season won” definition)  
6. **Season Goals** (proof targets subordinate to identity)  
7. **Active Journeys** (Season-scoped view)  
8. **Season Reviews** (weekly / mid / final Reflection altitudes)  
9. **Season Analytics package**  
10. **Season Mastery delta**  
11. **Season Archive package** (on close)  
12. **Rest / Inter-season state** (optional sacred pause)

## Relationships

- Season selects Domains; does not destroy Domains at end.  
- Season bounds which Journeys are “campaign-active.”  
- Season Reviews consume Analytics across Domains.  
- Season close writes Legacy entry.  
- Next Season may continue Domains with new Journeys/identity.  
- Coach uses Season goals as coaching north for the chapter.

## Navigation flow

**Commission:** Root Season Setup → identity → Domains → non-negotiables → victory conditions → enter Operate.  
**Live:** Global Season surface for Steer; Home shows pulse only.  
**Review:** Season Review Reflection → adaptation of Systems/Goals.  
**Close:** Final Reflection → Analytics → Mastery update → Legacy archive → Rest or next Season Setup.  
**Forbidden:** Endless Season with no victory condition.

## Rules

- Seasons are finite (Law of Finite Seasons).  
- Victory conditions must be evidence-checkable via Sessions/Projects/Artifacts — not vibes.  
- Season identity outranks Goals (Principle 3).  
- Mid-season Domain add is expensive and must re-open commitment.  
- Archive by default; delete only via explicit Legacy/Settings integrity path.  
- Wedge narrative (Vision): 6-month mastery protocol is a valid Season shape — not the only possible duration forever, but the proving wedge.

## What belongs there

- Identity, horizon, domain selection, non-negotiables, victory conditions, reviews, close/archive pipeline.

## What should never belong there

- Daily Session execution as the Season surface’s main job (that’s Home).  
- Infinite goal lists without Domains.  
- Perpetual “New Year reset” gimmicks that wipe identity.  
- Social season competitions as core architecture.

---

# 10. Journey Architecture

## Purpose

Journey Architecture defines **structured multi-week/month arcs inside a Domain** — curriculum and narrative momentum when Domains alone are too abstract (Vision §6.4).

## Responsibilities

- Provide beginning, middle, end inside a Domain.  
- Contain Projects and bind Systems.  
- Progress exclusively via Sessions.  
- End cleanly while Domain persists.  
- Carry narrative (“Ship Comfort,” “Hypertrophy block,” “Essay cadence install”).

## Parent

- Domain (required).  
- Season (activation / campaign relevance).

## Children

1. **Journey Identity / thesis**  
2. **Curriculum phases** (logical stages, not UI)  
3. **Projects**  
4. **Bound Systems**  
5. **Journey Goals**  
6. **Journey Session stream**  
7. **Journey Reflections** (phase and end)  
8. **Journey Analytics**  
9. **Journey Artifacts**  
10. **Completion / abandonment states** (honest endings)

## Relationships

- Journey → Projects → Goals.  
- Journey ↔ Systems (generates Daily Actions/Sessions).  
- Multiple Journeys may coexist in a Domain only if Season attention allows (clarity over completeness).  
- Journey completion feeds Domain Mastery and possibly Legacy Artifacts.  
- Abandoned Journeys remain evidence (integrity), not deleted shame.

## Navigation flow

- Domain → Journeys index → Journey Overview → Project/System/Session.  
- Home may surface today’s Sessions tagged by Journey without forcing Journey open.  
- Journey end → Reflection → Analytics → Mastery contribution → optional archive under Domain/Legacy.

## Rules

- Journeys end; Domains persist.  
- A Journey without Sessions is fiction.  
- Journey count per Domain/Season is constrained by clarity.  
- Curriculum may guide Beginner persona; Operator/Founder may run thinner Journeys.  
- Switching Journeys mid-stream requires Reflection (evidence-based improvement), not aesthetic reboot addiction.

## What belongs there

- Thesis, phases, projects, systems, goals, session stream, reflections, completion states, artifacts.

## What should never belong there

- Life Settings.  
- Other Domains’ full content.  
- Eternal Journeys with no end condition.  
- Gamified map for its own sake without Session evidence.

---

# 11. Project Architecture

## Purpose

Project Architecture defines **concrete artifacts or outcomes** — externalized proof that practice became reality (Vision §6.5).

## Responsibilities

- Turn mastery pursuit into shipped or completed proof.  
- Break into Goals and attach Systems.  
- Feed Mastery and Legacy Artifacts on completion.  
- Prevent “practice forever, ship never” failure mode (especially Software / Brand / Writing).

## Parent

- Journey (primary).  
- Occasionally Domain-level for standing outcomes, still Season-aware.

## Children

1. **Project definition / outcome statement**  
2. **Goals** (proof targets)  
3. **Linked Systems** (how work gets done)  
4. **Milestones** (optional mid-proof points — still evidence-bound)  
5. **Project Sessions stream**  
6. **Artifacts produced**  
7. **Completion record**  
8. **Project Reflection**

## Relationships

- Project completion → Artifact(s) → Legacy eligibility.  
- Engineering Projects may link to Brand as proof-of-work Artifact.  
- Writing Projects may link to Brand distribution Systems.  
- Reading “finish Book N” can be a Project feeding Writing raw material.  
- Body “12-week strength block” is a Project with training Systems — outcome is measurable capacity, not vibes.

## Navigation flow

- Journey → Projects → Project → Goals/Systems → Sessions (or Home Sessions already derived).  
- Complete Project → Reflection → Mastery/Legacy contribution.  
- Do not force Project open to execute today’s Session if Daily Action already exists.

## Rules

- Projects need definition of done.  
- Hours alone do not complete Software Projects (Vision persona: craft maximalist — shipped outcomes).  
- Projects are mid-stack; they do not replace Season identity.  
- Infinite project creation without completion is intention inflation — OS should make completion the celebrated path.  
- Projects archive on completion; they do not vanish.

## What belongs there

- Outcome definition, goals, systems, sessions, artifacts, completion, reflection.

## What should never belong there

- Habit streaks as Project success.  
- Notes without outcome.  
- Domain interconnection settings (those live on Domain).  
- Unbounded “areas” pretending to be Projects.

---

# 12. Session Architecture

## Purpose

Session Architecture defines the **sacred unit of execution** — the primary object of the OS (Vision §6.10, §8.2).  
Everything above is architecture; Sessions are life.

## Responsibilities

- Bound work with clear “done.”  
- Capture evidence of completion (not vibes, not time passing).  
- Update streaks, analytics inputs, mastery inputs, AI memory — only on integrity close.  
- Support shrink-not-skip minimum faithful Session.  
- Allow mood/emotion as annotation, never as completion substitute.

## Parent

- Daily Action (date-scoped derivation).  
- System / Journey / Project (provenance).  
- Presented primarily via Home; also reachable from Domain/Journey/Notification/Command/Search/Coach.

## Children (Session lifecycle objects)

1. **Session Intent** — what this block is for (identity-aligned).  
2. **Done definition** — evidence criteria.  
3. **Scope** — full vs shrunk minimum.  
4. **State** — Ready / Active / Completed / Missed / Deferred (deferred ≠ completed).  
5. **Evidence payload** — what was executed (domain-appropriate proof).  
6. **Annotations** — mood, friction, notes (non-scoring).  
7. **Session Reflection** (optional micro; links to Reflection Architecture).  
8. **Provenance links** — System, Journey, Project, Goal, Domain, Season.  
9. **Integrity flags** — manual complete allowed; honesty culturally central; future sensors raise confidence only.

## Relationships

- Session completion is the primary event feeding Analytics, Mastery inputs, Coach memory.  
- Missed Sessions feed Reflection without rewriting history.  
- Shrunk Sessions still count if done definition for shrink tier is met — teaches resilience, not cheating, when tiers are predefined by System.  
- Interconnection: missed Body Sessions may emit signals affecting Software/Writing readiness.

## Navigation flow

**Canonical Operate path:**  
Home → Session Ready → Session Active → Session Complete (evidence) → optional Session Reflection → Home.

**Steer path into Session design:**  
System/Journey edit → future Daily Actions → future Sessions (never retroactive fake completes).

**Evidence path:**  
Analytics/Mastery → Session evidence trail → read-only Session record.

## Rules

- **No session evidence, no progress.**  
- No auto-complete by clock.  
- No XP for opening Session Ready.  
- Manual complete allowed; audit/reflection keep honesty central (Principle 10).  
- Emotion annotates; emotion does not complete (Principle 5).  
- Shrink tiers must be System-defined before crisis — not invented after the fact to farm scoreboard.  
- Deferred is honest; converting Deferred to Complete without execution is forbidden.  
- Session is not a Note. Session is not a Habit checkbox alone.

## What belongs there

- Intent, done definition, scope tiers, state machine, evidence, annotations, provenance, integrity.

## What should never belong there

- Full Season planning.  
- Multi-project roadmap editing.  
- Settings.  
- Social sharing as required close step.  
- Fake duration timers as sole evidence.  
- Bundling five Domains into one vague “life session” that destroys Domain truth (multi-domain day is multiple Sessions).

---

# 13. Reflection Architecture

## Purpose

Reflection Architecture defines **structured sense-making** that closes the learning loop — converting raw completion into system learning (Vision §4 reflection, §6.11).  
Execution without reflection is motion; reflection without execution is therapy cosplay.

## Responsibilities

- Operate at multiple altitudes: Session, Daily close, Weekly, Mid-season, Season end, Legacy narrative.  
- Annotate Analytics with human meaning.  
- Propose System changes (evidence-based).  
- Update Identity language **only if earned**.  
- Capture emotion without overwriting scoreboard.  
- Extract Principles for Legacy.

## Parent

- Session (micro).  
- Home evening close / Season / Journey (meso/macro).  
- Feeds Analytics, Mastery narrative, Legacy.

## Children (reflection altitudes)

| Altitude | Job |
|----------|-----|
| **Session Reflection** | What happened; friction; honesty |
| **Daily Reflection** | Day integrity; energy; tomorrow shrink/adjust |
| **Weekly Reflection** | Pattern detection; System tune |
| **Journey Reflection** | Arc learning; continue/stop |
| **Season Reflection** | Chapter verdict; mastery narrative; archive story |
| **Legacy Reflection** | Multi-year meaning (rare, deep) |

### Reflection payload concepts

- What was executed (cite Sessions).  
- What failed (cite misses).  
- Emotional context (non-scoring).  
- Interconnection observations.  
- Proposed System adaptations.  
- Principle candidates.  
- Identity language review (earned only).

## Relationships

- Reflection **reads** Sessions/Analytics.  
- Reflection **proposes** System/Goal changes (Steer).  
- Reflection **writes** Principles and narrative into Legacy eligibility.  
- Coach may prompt Reflection with cited evidence; Coach does not write fake Reflections.  
- Analytics may display Reflection annotations beside metrics.

## Navigation flow

- After Session Complete → optional Session Reflection → Home.  
- End of day → Daily Reflection.  
- Cadence → Weekly Reflection from Season or Home cue.  
- Journey/Season end → mandatory deep Reflection before archive.  
- From Analytics “why” → open related Reflection.

## Rules

- Reflection cannot mark Sessions complete.  
- Season close requires Season Reflection.  
- Identity upgrades require evidence, not affirmations.  
- “I feel behind” must be checkable against completion (Principle 5).  
- Zombie consistency (wrong System, perfect streak) is a Reflection failure mode Reflection must catch.  
- Beginner persona: heavier guided prompts; less analytics jargon.  
- Founder persona: detect self-erasure patterns.

## What belongs there

- Structured prompts, evidence citations, emotion annotations, adaptation proposals, principle extraction, identity review.

## What should never belong there

- Freeform second brain replacing Domains.  
- Therapy replacement claims.  
- Scoreboard edits.  
- Social journaling feeds as core.  
- Planning next Season without evidence review (order: reflect → then commission).

---

# 14. Analytics Architecture

## Purpose

Analytics Architecture defines **evidence surfaces** that make self-deception harder and adaptation smarter (Vision §6.12).  
Analytics consume Session + Reflection data; they do not invent progress.

## Responsibilities

- Measure completion, consistency, quality proxies, cross-domain correlations, mastery vectors.  
- Provide drill-down to Session evidence.  
- Inform Goals/Systems and Season reviews.  
- Uphold scoreboard integrity.  
- Prefer decade-capable structures over disposable dashboards.

## Parent

- Global → Analytics.  
- Also Domain Analytics, Journey Analytics, Season Analytics packages.  
- Dashboard Architecture is the organism composition of Analytics (+ Mastery pulse).

## Children (evidence families)

1. **Completion evidence** — Sessions completed vs planned (integrity).  
2. **Consistency evidence** — streak integrity, cadence adherence, shrink usage rate.  
3. **Quality proxies** — Domain-appropriate (shipped artifacts, training load integrity, publishing cadence, reading finished sessions, etc.) — never vanity alone.  
4. **System health** — which protocols produce Sessions reliably.  
5. **Interconnection correlations** — e.g., training slip ↔ deep work risk.  
6. **Goal progress** — proof targets vs evidence.  
7. **Season victory tracking** — evidence against victory conditions.  
8. **Persona-sensitive views** — same data, different emphasis (Athlete vs Creator), not different truth.

## Relationships

- Inputs: Sessions, Reflections, Project/Artifact completions.  
- Outputs: Dashboard zones, Season Reviews, Coach citations, System adaptation cues.  
- Mastery aggregates Analytics over time.  
- Legacy may snapshot Analytics packages per Season.

## Navigation flow

- Global Analytics → Season or Domain filter → Journey/Project → Session evidence.  
- From Dashboard zone → same drill.  
- From Coach claim → Analytics citation → Session.  
- Exit to Steer only after evidence seen (cultural rule: don’t redesign blind).

## Rules

- No metric without Session lineage (or explicit Artifact completion event tied to Sessions).  
- No auto-inflation.  
- Emotion metrics annotate; they don’t replace completion.  
- Brand Analytics must not reduce the person to vanity metrics alone (Creator persona protection).  
- Software Analytics prefer shipped outcomes over IDE hours alone.  
- Consistency weighted over intensity spikes (Principle 4).  
- Cross-domain correlations are first-class (Principle 8).

## What belongs there

- Evidence families above, filters by Season/Domain/Journey, drill to Sessions, interconnection, system health.

## What should never belong there

- Editable scoreboard.  
- Engagement metrics (time-in-app as success).  
- Leaderboards as core truth.  
- Intention counts (notes created, goals created) as success metrics (anti-goal §8.3).  
- Aesthetic “dashboard builder” as product.

---

# 15. Legacy Architecture

## Purpose

Legacy Architecture defines the **curated long-term archive of seasons, artifacts, principles, and mastery maps** — Life viewed in reverse with evidence (Vision §6.14, §4 legacy).  
Legacy orients the OS beyond self-optimization into meaning.

## Responsibilities

- Preserve Season Archive packages.  
- Hold mastery maps across decades.  
- Curate Artifacts and Principles.  
- Provide narrative surfaces for “I became this on purpose.”  
- Increase switching costs by meaning, not spite (Vision §2 retention).

## Parent

- Life.  
- Global → Legacy.  
- Season close writes into Legacy.

## Children

1. **Season Archive packages** (ordered chapters)  
2. **Mastery maps** (Domain and Life)  
3. **Artifact vault** (shipped proofs)  
4. **Principle library** (hard-won rules)  
5. **Identity timeline** (Season identity statements over years)  
6. **Interconnection history** (how organs coupled across chapters)  
7. **Legacy narratives** (optional curated storytelling — selective, not fiction replacing evidence)  
8. **Exportable life record** (integrity/portability concept — not implementation)

## Relationships

- Legacy is primarily **read-only history** with selective curation.  
- Does not mutate past Sessions.  
- Mastery writes into Legacy; Legacy does not invent Mastery.  
- Domains persist; Legacy shows Domain arcs across Seasons.  
- Coach may read Legacy for long-term identity coaching; still cannot grant unearned Mastery.

## Navigation flow

- Global Legacy → Season Archive → artifacts/principles/analytics snapshot.  
- From Season close ceremony → land in new Legacy entry, then Rest or next Season.  
- From Mastery → Legacy historical comparison.  
- Search may find Principles/Artifacts in Legacy.

## Rules

- Seasons archived, never deleted by default (Principle 6).  
- Legacy is sacred — not a recycle bin.  
- Curation may hide/show narrative emphasis; it may not fabricate Sessions.  
- Legacy gravity increases with age — IA must not reset every January.  
- Beginner may have thin Legacy; structure still exists from Season one.

## What belongs there

- Archives, mastery maps, artifacts, principles, identity timeline, interconnection history, selective narrative.

## What should never belong there

- Active Session execution.  
- Mutable past evidence.  
- Social scrapbook without execution basis.  
- Settings.  
- Temporary scratch notes.  
- “Memories” unrelated to becoming/evidence.

---

# 16. AI Architecture

## Purpose

AI Architecture defines **where and how intelligence participates** in the OS as a **systems coach with memory of evidence** (Vision §8.10) — not a chatbot roommate, not an engagement engine.

## Responsibilities

- Observe Sessions, Reflections, Analytics, Season goals.  
- Propose adaptations with **cited reasons**.  
- Protect interconnection awareness.  
- Never grant Mastery without evidence.  
- Serve long-term identity, not engagement metrics.  
- Soften tone with emotional context without inventing progress.  
- Obey all product principles and anti-goals.

## Parent

- Global → Coach.  
- Also embedded **interaction points** inside Home, Session, Reflection, Season Review, Analytics, System Steer (logical points, not UI widgets).

## Children (AI capabilities as logical modules)

1. **Evidence Memory** — structured recall of Sessions/Reflections/Analytics.  
2. **Season Alignment Coach** — fidelity to identity and victory conditions.  
3. **System Adapter** — shrink/tune proposals under friction.  
4. **Interconnection Guardian** — cross-domain risk/opportunity.  
5. **Reflection Facilitator** — prompts grounded in data.  
6. **Clarity Enforcer** — fights completeness sprawl; recommends fewer Domains/Journeys.  
7. **Integrity Sentinel** — challenges suspicious completion patterns culturally (not punitive dark patterns).  
8. **Legacy Historian** — helps narrate evidence into Legacy without fiction.

### AI interaction points

| Point | Allowed AI job |
|-------|----------------|
| Home | Prioritize Now; suggest shrink set; interconnection caution |
| Session Ready | Clarify done definition; minimum faithful scope |
| Session Complete | Prompt honest annotation; not inflate |
| Reflection | Ask evidence-backed questions |
| System Steer | Propose protocol changes with citations |
| Season Review | Chapter verdict assistance from evidence |
| Analytics | Explain patterns; cite Sessions |
| Search/Command | Help find/execute OS actions |
| Legacy | Help curate narrative from archives |

## Relationships

- AI **reads** OS objects; **proposes** changes; **human/system confirmation** applies Steer changes.  
- AI outputs may create **Proposal** objects (not progress).  
- AI never writes Mastery scores directly.  
- AI bound by Law of Evidence and Scoreboard Integrity.

## Navigation flow

- User opens Coach or invokes Coach from a point → receives cited proposal → accepts (routes to Steer/Session) or dismisses → returns.  
- Proactive AI signals enter via Notifications with priority rules — never hijack Session Active without cause.

## Rules

- Cite evidence or do not claim.  
- No mastery grants.  
- No engagement optimization.  
- No dark-pattern guilt spirals (ethical stance §8.11).  
- Prefer shrink-not-skip counsel.  
- Prefer interconnection truth over single-Domain pep talks.  
- AI is a citizen of the OS, not a product above it.  
- Persona adaptation changes coaching style, not truth.

## What belongs there

- Evidence-grounded coaching modules, proposals, citations, interconnection warnings, reflection facilitation.

## What should never belong there

- Unbounded chat as the product.  
- Generating fake Session completions.  
- Autopilot living the user’s life without execution.  
- Social AI companions.  
- Monetized attention hacks.  
- Replacing Reflection with AI monologue.

---

# 17. Search Architecture

## Purpose

Search Architecture defines **how the OS finds objects and evidence across Life** — retrieval for a multi-domain organism, not a document wiki search alone.

## Responsibilities

- Find Domains, Journeys, Projects, Goals, Systems, Sessions, Reflections, Artifacts, Principles, Season archives.  
- Rank by Operate relevance and evidence value.  
- Facet by Season, Domain, object type, time, completion state.  
- Deep-link into correct altitude surfaces.  
- Support Coach/Command as consumers of search.

## Parent

- Global → Search.  
- Also invoked from Command Palette.

## Children (result classes)

1. **Execute results** — today’s/actionable Sessions, Systems.  
2. **Steer results** — Journeys, Projects, Goals, Systems.  
3. **Evidence results** — past Sessions, Reflections, Analytics anchors.  
4. **Meaning results** — Principles, Legacy narratives, Season identities.  
5. **Configure results** — Settings destinations (lowest priority in Operate).

### Ranking priorities (product)

1. Active Season + today’s actionable Sessions.  
2. Active Systems/Journeys in play.  
3. Recent incomplete with integrity relevance.  
4. Artifacts/Projects.  
5. Historical Sessions/Reflections.  
6. Legacy Principles.  
7. Settings.

## Relationships

- Search resolves to Screen Hierarchy surfaces.  
- Does not create progress.  
- Interconnection: searching one Domain may suggest coupled Domain objects when relevant.  
- Archive/Legacy contents are searchable with clear “historical” facet.

## Navigation flow

- Invoke Search → query → select result → land on object surface at correct altitude → return via standard rules.  
- Empty query may show recent + Today Sessions (clarity), not entire object universe.

## Rules

- Search must not become a second Notion.  
- Results must preserve Season/Domain context badges conceptually.  
- Completed vs incomplete must be unmistakable.  
- Settings results demoted during Operate.  
- No ranking by time-in-app engagement.

## What belongs there

- OS nouns, evidence, legacy meaning, demoted settings; facets; deep links.

## What should never belong there

- Web browsing.  
- Social graph search as core.  
- Unstructured file dump without object typing.  
- Creating Mastery via search tricks.

---

# 18. Command Palette

## Purpose

Command Palette is the **keyboard of the Personal OS** — intent → action without wandering the tree.  
It is an invoke surface, not a content destination.

## Responsibilities

- Execute universal actions quickly.  
- Jump to Global destinations and objects.  
- Start/complete/shrink Sessions.  
- Open Coach with context.  
- Capture constrained commands (not infinite note creation as success).  
- Keep power users fast without making configuration the game.

## Parent

- Global → Command (invoke).  
- Available across OS Shell modes.

## Children (command classes)

1. **Navigate commands** — Home, Season, Domain X, Analytics, Legacy, Settings…  
2. **Session commands** — Start Now, Complete, Shrink, Defer, Open Reflection.  
3. **Steer commands** — Create/Edit System (gated), Open Project, Open Journey.  
4. **Season commands** — Open Review, View victory conditions.  
5. **Coach commands** — Ask with current context.  
6. **Search commands** — Palette may federate Search.  
7. **Integrity commands** — Export, sign out (rare, confirm-gated conceptually).

## Relationships

- Command uses Search Architecture for discovery.  
- Command triggers same state machines as Home/Session (no special complete powers).  
- Notifications may suggest commands.  
- AI may recommend commands; cannot invent illegal ones.

## Navigation flow

- Invoke → type intent → run command → land on resulting surface or close palette after action.  
- Destructive/integrity commands require confirmation altitude.  
- During Session Active, palette prefers Session commands; demotes Steer sprawl.

## Rules

- Commands that complete Sessions still require evidence rules.  
- No “complete all” god command.  
- Create-object commands are Steer-gated and rate-limited by clarity (fight intention inflation).  
- Palette is not a chatbot (Coach is).  
- Palette must work as conceptual model even when input method differs (voice later) — IA defines verbs, not UI.

## What belongs there

- Verbs for navigate, execute session lifecycle, constrained steer, coach, search federate, rare integrity.

## What should never belong there

- Arbitrary scripting playground as core.  
- Social commands.  
- Scoreboard hacks.  
- Unbounded object spam creation.  
- Theme/aesthetic fiddling as top commands.

---

# 19. Notifications Architecture

## Purpose

Notifications Architecture defines the **attention lane** for OS signals that protect Sessions, Systems, Seasons, and interconnection — without becoming addiction infrastructure (Vision §8.11).

## Responsibilities

- Deliver time-sensitive Operate cues (Session windows, non-negotiables).  
- Deliver Steer cues (weekly Reflection due, System failure patterns).  
- Deliver Integrity/Interconnection warnings.  
- Deliver Season milestones (mid/end reviews).  
- Deep-link to legal surfaces.  
- Suppress noise; prefer clarity.

## Parent

- Global → Notifications.  
- Signals originate from Systems, Season engine, Analytics thresholds, Coach Integrity/Interconnection modules.

## Children (notification types)

| Type | Intent |
|------|--------|
| **Session Due / Window** | Operate |
| **Non-negotiable At Risk** | Operate / shrink |
| **Reflection Due** | Reflection altitudes |
| **System Failure Pattern** | Steer |
| **Interconnection Risk** | Cross-domain Operate/Steer |
| **Season Review** | Season Architecture |
| **Victory Condition Progress** | Evidence checkpoint (not fake hype) |
| **Integrity Caution** | Scoreboard culture |
| **Coach Proposal Ready** | AI Architecture |
| **Legacy/Season Archived** | Remember |

### Priority lanes

1. **Critical integrity** — non-negotiable at risk, season close.  
2. **Operate** — session windows.  
3. **Steer** — system patterns, reviews.  
4. **Informational** — archive confirmations, soft tips.  
5. **Suppressible coaching** — user can quiet without breaking OS.

## Relationships

- Notification payload includes target object + deep link + optional suggested command.  
- Must not complete Sessions.  
- Analytics thresholds may emit System Failure / Interconnection notifications.  
- Settings controls cadence — but cannot disable all integrity for Domains in play without Season acknowledgment.

## Navigation flow

- Receive → open → land on Session/Reflection/Season/System → act → dismiss.  
- Batch informational; never batch-complete work.

## Rules

- No notification for merely opening the OS.  
- No dark-pattern re-engagement loops.  
- Prefer fewer, higher-signal notifications (clarity).  
- Interconnection warnings must be evidence-cited.  
- Beginner: more guidance, still not spam.  
- Founder: protect non-negotiables against self-erasure.  
- Athlete: readiness/recovery signals matter; still Session-evidence bound.

## What belongs there

- Session, system, season, interconnection, reflection, integrity, coach proposal signals with deep links.

## What should never belong there

- Marketing.  
- Social likes.  
- Streak shame storms.  
- “Come back and configure” loops.  
- Fake urgency for intention objects.

---

# 20. Settings Architecture

## Purpose

Settings Architecture defines **Configure mode** — preferences, integrity, account, and policy — subordinate to becoming, never the daily path.

## Responsibilities

- Account and security.  
- Persona-sensitive defaults (without forking IA).  
- Notification policies.  
- Season/Domain commitment tools (expensive actions).  
- Evidence/export/delete integrity.  
- Integration permissions (future) that raise evidence confidence without lowering standards.  
- AI coaching preference bounds (tone, proactivity) — not truth off-switches for scoreboard.

## Parent

- Global → Settings.  
- Root System Integrity overlaps for account-level actions.

## Children (settings tree)

1. **Account & Security** — identity gate, devices, recovery.  
2. **Profile & Persona defaults** — coaching intensity, guided vs sparse.  
3. **Season & Domain commitments** — active Season tools; add/pause Domain (expensive).  
4. **Systems defaults** — shrink tier policies, week structure.  
5. **Notifications** — lanes and quiet hours.  
6. **AI Coach** — proactivity, tone; cannot disable evidence rules.  
7. **Integrity & Data** — export, archive policies, delete account/data.  
8. **Integrations** (future) — sensors, calendars, GitHub, etc., as evidence aids.  
9. **Legal & Ethics** — policies aligned to Vision ethical stance.

## Relationships

- Settings change future Daily Actions/Sessions; do not rewrite past evidence casually.  
- Domain add from Settings must still pass Season commitment rules.  
- Integrations may increase evidence confidence; never auto-complete without standards (Principle 10).  
- Legacy archive policy configured here; Legacy content not edited as Settings.

## Navigation flow

- Enter Settings → adjust → return to previous mode (usually Home).  
- Dangerous actions → confirmation → possible Root System Integrity.  
- Settings must not trap user in configuration loops (anti-goal: aesthetic configuration as success).

## Rules

- Settings is not Home.  
- No Mastery editing.  
- No Session fabrication tools.  
- Expensive Domain/Season changes require explicit commitment language.  
- Beginner defaults: guided protocols, fewer Domains, light Analytics.  
- Clarity over completeness applies to Settings itself — few controls, strong defaults.

## What belongs there

- Account, defaults, commitments, notifications, AI bounds, integrity/data, future integrations, legal.

## What should never belong there

- Daily Session lists.  
- Analytics exploration.  
- Full Journey curriculum editing (belongs in Domain/Journey Steer).  
- Theme playground as identity.  
- Social graph management as core.

---

# 21. Archive Architecture

## Purpose

Archive Architecture defines the **mechanical preservation layer** for finished or paused chapters and objects — the substrate Legacy curates and meaning-izes.  
Archive is how the OS obeys long-term compounding; Legacy is why.

## Responsibilities

- Store Season Archive packages on close.  
- Preserve completed Journeys/Projects/Artifacts.  
- Preserve Reflections and Analytics snapshots.  
- Support pause states (Domain paused, Journey abandoned) without deletion.  
- Provide retrieval for Search, Legacy, Coach Historian.  
- Default retain; exceptional delete via Integrity Settings.

## Parent

- Life storage integrity.  
- Written by Season close, Journey/Project completion, Domain pause.  
- Read by Legacy, Search, Analytics historical views, AI Historian.

## Children (archive layers)

1. **Season Archives** — full chapter packages.  
2. **Journey Archives** — completed/abandoned arcs.  
3. **Project Archives** — outcomes and artifacts.  
4. **Session Evidence Store** — immutable completion records (conceptual immutability).  
5. **Reflection Archives**  
6. **Analytics Snapshots**  
7. **Principle & Artifact indexes**  
8. **Tombstones** — rare deletions with audit (integrity)

### Season Archive package (logical contents)

- Identity statement and victory conditions (claimed vs evidenced).  
- Domains in play and interconnection notes.  
- Journeys/Projects outcomes.  
- Session integrity summary.  
- Reflections (weekly + final).  
- Analytics snapshot.  
- Mastery delta.  
- Principles extracted.  
- Artifacts produced.  
- Archive policy metadata.

## Relationships

- Archive ≠ trash.  
- Legacy selects and narrates from Archive.  
- Operate rarely writes Archive except through completion/close events.  
- Paused Domains remain archived-available for reactivation in future Seasons.

## Navigation flow

- User rarely “goes to Archive” as a job; they go to **Legacy** (meaning) or historical Analytics.  
- Explicit Archive browser may exist under Legacy for power retrieval.  
- Season close → write Archive → available in Legacy.  
- Search historical facet → Archive-backed objects.

## Rules

- Default retain (Principle 6).  
- Do not rewrite Session evidence in Archive.  
- Abandonment is a valid archived state (honesty).  
- Archive must remain decade-capable.  
- Deleting Archive is an integrity event, not a casual Setting toggle.  
- Rest between Seasons may freeze Operate writes; Archive/Legacy remain readable.

## What belongs there

- Completed/paused chapter and object packages, immutable evidence, snapshots, rare tombstones.

## What should never belong there

- Active Today Sessions as mutable workspace.  
- Draft intention spam without lifecycle.  
- Social content vaults.  
- Temporary caches presented as Legacy.  
- Soft-delete of failures to beautify history (destroys scoreboard integrity).

---

# 22. Cross-domain Relationships

## Purpose

Cross-domain Relationships define the **Law of Interconnection** in structural form — Domains as organs of one organism (Vision §8.4, Principle 8).

## Responsibilities

- Declare default couplings among launch Domains.  
- Define signal types (support, feed, risk, proof).  
- Specify how signals appear in Home, Dashboard, Notifications, Coach.  
- Ensure Season reviews evaluate the whole organism.  
- Prevent suite-of-apps regression.

## Parent

- Life / Season organism model.  
- Domain Architecture interconnection ports.  
- Analytics interconnection correlations.  
- AI Interconnection Guardian.

## Children (relationship types)

| Type | Meaning | Example |
|------|---------|---------|
| **Supports** | Capacity substrate | Body → Software / Writing deep work |
| **Feeds** | Input pipeline | Reading → Writing |
| **Distributes** | Output pipeline | Writing → Brand |
| **Proves** | Artifact coupling | Software → Brand |
| **Risks** | Failure propagation | Body slip → cognitive endurance risk |
| **Sustains** | Anti-burnout | Body ↔ Brand energy; Body ↔ Creator sustainability |
| **Informs** | Judgment coupling | Reading → Brand / Engineering taste |

### Default interconnection map (launch)

```text
Body ──supports──► Reading, Writing, Software, Brand
Reading ──feeds──► Writing ──distributes──► Brand
Software ──proves──► Brand
Reading ──informs──► Software, Brand
Writing ──informs──► Software (clarity of thought)
Season Review evaluates all couplings as one organism
```

### Signal objects

- **Interconnection Signal** — emitted from Analytics patterns or Session misses.  
- **Coupling Declaration** — Domain port configuration (defaults strong; user muting is Steer-advanced).  
- **Organism Review Item** — Season Reflection checklist item for couplings.

## Relationships

- Signals route to Home (caution), Notifications (risk), Dashboard (zone), Coach (guardian).  
- Pipelines may create material links (Reading highlights → Writing Project inputs) as object relationships.  
- Proof links attach Artifacts across Domains.

## Navigation flow

- Signal → supporting Domain Session or System Steer.  
- Season Review → organism couplings checklist → adaptations.  
- Artifact proof → Brand Domain evidence without double-counting Mastery illegitimately (one evidence, multiple views).

## Rules

- Interconnection is default on for launch Domains.  
- Users may de-emphasize signals; they may not pretend Domains are isolated apps at the IA level.  
- Signals must be evidence-cited.  
- Do not create notification storms from one miss (clarity; shrink counsel).  
- Cross-domain does not mean one mush Session; Sessions remain Domain-true.  
- Whole-organism Season Review is mandatory architecture, not optional report cards only.

## What belongs there

- Coupling types, default map, signals, pipeline material links, organism review items.

## What should never belong there

- Forced social comparison across users as “interconnection.”  
- Fake correlations without evidence.  
- Merging Domains into one junk drawer.  
- Letting Brand vanity metrics override Body/Reading truth.

---

# 23. Future Expansion Strategy

## Purpose

Future Expansion Strategy defines **how the OS may grow** without betraying Personal OS doctrine — expensive Domains, deeper organs, longer Life, more evidence confidence — never infinite feature glitter.

## Responsibilities

- Order expansion axes by Vision fidelity.  
- Protect Law of Minimum Domains.  
- Keep Session primary as surface area grows.  
- Ensure archives/mastery remain decade-capable.  
- Define what must never be expanded into.

## Parent

- Master Product Vision north-star + this IA.  
- Governed by Document Laws.

## Children (expansion axes, ordered)

### Axis A — Deepen existing Domains (first)

- Richer Body periodization & recovery Systems.  
- Reading → Writing → Brand pipeline strength.  
- Software shipping Project rigor.  
- Domain Mastery models with integrity.  
**Why first:** Moat is philosophy + execution data, not feature count.

### Axis B — Season engine maturity

- Multiple Season lengths; rest seasons; multi-year arcs.  
- Stronger victory condition languages.  
- Better archive packages.  
**Why:** Finite seasons are category-defining.

### Axis C — Evidence confidence upgrades

- Integrations that raise proof quality (training, shipping, publishing).  
- Never lower Session standards.  
**Why:** Scoreboard integrity.

### Axis D — New Domains (expensive)

- Faith, Finance, Relationships, Family, Service, etc.  
- Each Domain requires: identity language, Systems patterns, Session done-definitions, interconnection ports, mastery meaning, archive behavior.  
**Gate:** Season commitment cost; not a settings checkbox.

### Axis E — Multi-horizon Life tools

- Decade mastery maps, legacy publishing for self/family, principle inheritance.  
**Why:** Year 10–20 retention forces.

### Axis F — AI coach deepening

- Better memory, better citations, better interconnection guardianship.  
- Still not chatbot product.  
**Why:** AI era wedge requires structured execution data — which this OS creates.

### Axis G — Selective multiplayer (last, constrained)

- Accountability covenants, coach-human roles — only if they serve becoming and never turn into social performance anti-goal.  
**Gate:** Must not make social performance success (§8.3).

## Relationships

- Each expansion must map into Object Hierarchy without new primary object displacing Session.  
- New Domains must register Cross-domain Relationships.  
- Expansion must update Archive/Legacy packages.  
- Personas may gain Domain defaults; IA nouns stay stable.

## Navigation flow (for expansions)

- New Domain → Season Setup commitment → Domain Architecture seed → Home Sessions appear.  
- New integration → Settings Integrity → evidence confidence on Sessions — no auto-mastery.  
- New AI capability → Coach modules + citation requirements.

## Rules

- **Compatibility rule:** If an expansion fails the north-star question, reject.  
- **Expense rule:** Domain add feels expensive because it is.  
- **Primary object rule:** No expansion demotes Session.  
- **Anti-suite rule:** No expansion creates isolated apps under one login.  
- **Anti-intention rule:** No expansion rewards object creation counts.  
- **Ethics rule:** Beauty and ritual allowed; captivity forbidden.  
- **Wedge honesty:** 6-month five-domain protocol remains valid proving Season even as Life expands.

## What belongs in expansion strategy

- Ordered axes, gates, compatibility rules, decade readiness, Domain admission criteria.

## What should never belong in expansion strategy

- Random competitor feature parity roadmaps.  
- Engagement growth hacks.  
- Infinite customization as vision.  
- Replacing OS doctrine with “AI chat everything.”  
- Resetting identity yearly for marketing seasons.  
- Building Notion/Todoist/Calendar clones inside Aether.

### Explicit non-expansion (resist)

- Time-in-app as success.  
- Social performance as success.  
- Aesthetic configuration as success.  
- Motivation spikes as success.  
- Number of notes/goals/tasks created as success.

---

# IA Compliance Checklist (use forever)

Before adding any concept to Aether, answer:

1. Where does it live in Root / Global / Screen / Object hierarchy?  
2. What is its parent and children?  
3. Does it increase Session execution clarity — or intention inflation?  
4. Does it respect Season finitude and Domain expense?  
5. Can Analytics cite evidence for it?  
6. How does it archive into Legacy?  
7. How does it interconnect (if Domain-touching)?  
8. Can AI touch it without violating evidence laws?  
9. What must never be placed beside it?  
10. Does it survive the north-star question?

If any answer is weak, the concept is not ready for the OS.

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — Master Information Architecture |
| Version | 2.0 |
| Mode | Information architecture only |
| Source of truth | Master Product Vision 1.0 |
| Explicit non-goals | UI, visual design, code, schema, tickets, implementation |
| Supersedes | Prior IA draft structured around fewer sections |
| Successor docs (later) | Domain specs, Season engine spec, Session state machine, Mastery model, AI coach doctrine, Analytics metric dictionary |

**End of Master Information Architecture.**
