<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# AGENTS.md

## Project Overview

This project powers the private interactive experience hosted at:

`hello.aldenderf.com`

It is a mobile-first, guided, one-person interactive experience.

It is not a conventional website, dashboard, portfolio, SaaS app, or marketing landing page.

The experience should feel like:

> A carefully made private message that happens to be a website.

The intended emotional flow is:

curious → comfortable → amused → intrigued → surprised

Never:

overwhelmed → pressured → confused → creeped out

---

## Product Principles

The experience should feel:

- confident, not needy
- playful, not childish
- personal, not invasive
- slightly romantic, not overly sentimental
- technical, but not hacker-themed
- premium, but not pretentious
- memorable, but not visually overwhelming

The interface should support the storytelling rather than compete with it.

The visitor should remember the experience and the personality behind it, not the UI framework.

---

## UI/UX

Before creating or modifying any user-facing UI, read:

`docs/UI-UX-GUIDE.md`

The visual direction is:

- Cinematic minimalism
- Subtle glassmorphism only as an accent
- Near-black, white, and restrained cool-blue palette
- Geist typography
- Material UI for component infrastructure
- Motion for purposeful animation
- Mobile-first design

Do not introduce a new visual language without a deliberate reason.

Avoid:

- generic SaaS styling
- default Material UI appearance
- excessive cards
- excessive glassmorphism
- excessive gradients
- neon cyberpunk styling
- large amounts of decorative UI
- unnecessary icons
- random animation
- desktop-first layouts
- unnecessary navigation
- navbar or footer unless specifically required by the experience

Prefer:

- whitespace
- typography
- concise copy
- purposeful interaction
- clear hierarchy
- strong mobile usability
- accessibility
- simple maintainable code

Material UI is implementation infrastructure, not the visual identity.

Do not allow the application to look like a default Material UI application.

---

## Mobile-First Rules

The primary design target is mobile.

Design primarily around approximately:

`390 × 844`

The experience must remain usable from approximately:

`320px – 480px`

Then adapt gracefully for larger screens.

Use:

`100dvh`

where full viewport height behavior is required.

Avoid depending on:

`100vh`

for critical mobile layouts.

Desktop should generally preserve the same guided experience with additional whitespace rather than becoming a completely different layout.

Critical controls should remain easy to reach with one hand.

Minimum interactive touch target should generally be:

`48px`

Avoid tiny buttons, small hit areas, and controls located only in difficult-to-reach corners.

---

## UI Density

Default to fewer elements.

One screen should ideally communicate one main idea.

Do not fill empty space simply because it exists.

If a screen feels slightly empty, that may be intentional.

Avoid:

- card inside card layouts
- unnecessary sections
- unnecessary decorative elements
- visual clutter
- information-heavy screens

The experience gets most of its personality from:

- copy
- timing
- typography
- interaction
- motion

---

## Copy and Storytelling

Copy is part of the interface.

Do not automatically combine short lines into large paragraphs.

Whitespace may be used intentionally as pacing.

A screen may contain only a short phrase such as:

`Wait.`

or:

`Interesting.`

when that serves the storytelling.

Avoid overly dramatic, desperate, apologetic, or manipulative wording.

Do not introduce language that pressures the visitor to reply, continue, accept an invitation, or provide attention.

Do not imply romantic certainty or assume attraction.

Humor should generally be dry, self-aware, and restrained.

---

## Motion

Use Motion for purposeful animation.

Motion should support storytelling and hierarchy.

Typical timing guidance:

- 150ms for micro-interactions
- 250–400ms for standard transitions
- 500–800ms for selected dramatic reveals

Preferred animation types:

- fade
- slight translate
- subtle scale
- staggered text
- controlled blur reveal
- restrained progress animation

Avoid:

- constant bouncing
- large spinning effects
- excessive parallax
- giant zoom transitions
- animation on every element
- animation that blocks the user unnecessarily

The user should not feel like they are waiting for animation.

Respect:

`prefers-reduced-motion`

Important state transitions must not depend on an animation completing successfully.

Core logic must remain functional even when animation is reduced or unavailable.

---

## Material UI

Use Material UI for component infrastructure.

Commonly appropriate primitives include:

- Box
- Stack
- Typography
- Button
- TextField
- IconButton
- Dialog
- Fade
- Collapse
- Chip

Customize components to follow the project design system.

Avoid default Material UI visual behavior when it conflicts with the intended experience.

Repeated styling should move into:

- theme configuration
- shared components
- shared style utilities

when repetition becomes meaningful.

Do not prematurely abstract every component.

---

## Component Philosophy

Create reusable components when a real pattern exists.

Potential reusable components may include:

- ExperienceShell
- Scene
- PrimaryAction
- ChoiceButton
- AccessCodeInput
- SystemMessage
- ProgressDots
- RevealText

Do not force every scene into the same component structure if the storytelling requires different layouts.

Prefer readable composition over excessive abstraction.

---

## Accessibility

Maintain accessibility even though the experience is private.

Requirements include:

- readable contrast
- semantic HTML
- keyboard accessibility
- visible focus states
- accessible form labels
- appropriate ARIA attributes where needed
- information must not rely exclusively on color

Support reduced motion preferences.

Do not disable zoom.

Do not block standard browser accessibility behavior.

---

## Privacy and Trust

The experience should feel private because of its access design, not because of surveillance.

Do not collect unnecessary personal information.

Do not implement:

- precise location tracking
- browser fingerprinting
- device fingerprinting
- invasive analytics
- hidden tracking behavior
- unnecessary IP logging
- microphone or camera access
- contact access

Do not imply capabilities the application does not have.

Never display misleading statements such as:

- “I know you took a screenshot.”
- “I know where you are.”
- “I know what app you opened.”
- “I can see your screen.”

Do not attempt to block screenshots or screen recordings using fake security mechanisms.

Keep the experience share-safe.

---

## Engineering Principles

Prefer the simplest implementation that preserves the intended experience.

Keep changes focused and minimal.

Do not refactor unrelated code while implementing a requested feature.

Prefer incremental, reviewable changes over large rewrites.

Do not add features that were not requested.

When a task is UI-only, do not modify database behavior, access-control behavior, or session behavior unless required.

Separate concerns clearly.

Prefer:

business/state logic
→ presentation
→ animation enhancement

Do not make business logic dependent on animation state.

Avoid unnecessary dependencies.

Before adding a new dependency, verify that it provides meaningful value and is not already covered by the existing stack.

---

## Technology Stack

The expected core stack is:

- Next.js
- React
- TypeScript
- App Router
- React Compiler
- Material UI
- Emotion
- Motion
- Prisma
- PostgreSQL

Development database:

`mva_dev`

Production database:

`mva`

Development work must use the development database.

Do not accidentally connect development work to production.

---

## Environment and Secrets

Never expose secrets to client components.

Never commit:

- `.env`
- `.env.local`
- database passwords
- direct database credentials
- Supabase service-role keys
- API secrets
- session secrets
- production secrets
- private invite codes

Environment-specific values must remain outside tracked source code.

Development and production credentials must remain separate.

Before committing configuration-related changes, verify that no secrets were added to tracked files.

If a secret is discovered inside a tracked file, stop and report it.

Do not commit the secret.

---

## Database Safety

The invitation experience shares database infrastructure with another project.

Its data must remain logically isolated.

Do not modify unrelated MVA tables.

Do not create foreign keys from the private experience to unrelated MVA business tables unless explicitly required.

Prefer isolated tables or schema organization for the private experience.

Development schema/database changes must be tested against:

`mva_dev`

before being applied to:

`mva`

Do not manually apply production database changes unless explicitly requested.

Prefer reproducible migrations.

Never delete production data unless explicitly requested and the impact has been clearly reviewed.

---

## Invite Code Security

Sensitive invite-code validation must happen server-side.

Do not validate or redeem private invite codes purely in browser JavaScript.

Do not expose raw invite codes through public API responses.

Do not store real invite codes in plaintext when a secure hash is appropriate.

The real invite flow may include states such as:

- UNUSED
- ACTIVE
- COMPLETED

Development may use a reusable test code.

The reusable test code must not provide an unintended production bypass.

Production behavior should distinguish test behavior from real invite behavior safely.

---

## Session Rules

The first-run experience should tolerate accidental refreshes or temporary connection loss.

Do not permanently consume the invite merely because a page was refreshed.

A valid first-run session should be resumable for a reasonable limited period.

The invite should be considered completed only through deliberate completion logic.

Session identifiers should be generated securely.

Prefer secure, HttpOnly cookies for sensitive session state where appropriate.

Do not expose sensitive session tokens to browser-accessible storage unless there is a clear reason.

---

## Error Handling

Errors should be human-readable.

Avoid exposing raw stack traces, database errors, or internal implementation details to the visitor.

Prefer copy such as:

`That code doesn't look right.`

or:

`Something went wrong on my side. Try that again.`

Actual technical errors should still be logged appropriately during development.

Do not blame the user for system failures.

---

## Loading States

Avoid generic spinners when a better experience is appropriate.

Loading copy may support the storytelling when reasonable.

Examples:

`Checking your code...`

or:

`Running completely unnecessary analysis...`

However, distinguish intentional playful delays from real network activity.

Do not intentionally make real network requests slower merely for dramatic effect.

---

## Performance

Prioritize a fast first load, especially on mobile connections.

Avoid unnecessarily large client bundles.

Prefer server components when client-side interactivity is not required.

Use client components only where interaction requires them.

Avoid importing large libraries for a single small effect.

Optimize images and media when used.

Do not autoplay heavy media unnecessarily.

---

## Git and Version Control

Use Git conservatively.

Keep changes easy to review.

### General Rules

Always inspect the current branch and working tree before making changes.

Preserve unrelated local changes.

Do not discard, reset, overwrite, or revert unrelated user work.

Do not use destructive Git commands unless explicitly requested.

Do not use commands such as:

`git reset --hard`

unless explicitly authorized.

Do not force-push.

Do not rewrite shared history.

Do not amend an existing commit unless explicitly requested.

Do not merge branches unless explicitly requested.

Do not rebase unless explicitly requested.

Do not delete branches unless explicitly requested.

Do not change branches when doing so would risk losing uncommitted work.

---

## Git Branching

Prefer a focused feature branch for meaningful changes.

Use descriptive branch names when creating a branch is appropriate.

Examples:

- `feat/access-gate`
- `feat/first-run-experience`
- `feat/return-visit-flow`
- `feat/invite-session`
- `ui/cinematic-theme`
- `fix/session-resume`

Do not create unnecessary branches for every tiny change.

If the user has already specified the working branch, continue on that branch unless instructed otherwise.

Before switching branches:

1. Check the current branch.
2. Check the working tree.
3. Ensure uncommitted work will not be lost.

---

## Git Commits

Do not automatically commit every edit.

Default workflow:

implement
→ validate
→ summarize
→ wait for permission to commit

Create a commit only when:

- the requested scope is complete
- the code is in a valid state
- appropriate checks have passed
- the user has requested or authorized the commit

Prefer one focused commit per coherent change.

Do not bundle unrelated changes into the same commit.

Use clear commit messages.

Prefer Conventional Commit-style messages when appropriate.

Examples:

`feat: add invite access gate`

`feat: add first-run experience`

`feat: add return visit flow`

`feat: add invite session handling`

`fix: preserve active invite session on refresh`

`ui: add cinematic dark theme`

`refactor: isolate invite session logic`

`docs: add project agent guidelines`

Avoid vague commit messages such as:

`update`

`changes`

`stuff`

`fix`

`misc`

---

## Before Committing

Before creating a commit:

1. Run `git status`.
2. Review the relevant diff.
3. Ensure unrelated files are not staged.
4. Run appropriate validation.
5. Report known warnings or failures.
6. Verify no secrets are included.
7. Verify generated or temporary files are not accidentally staged.

Do not blindly stage everything if unrelated changes exist.

Avoid:

`git add .`

when the working tree contains unrelated changes.

Prefer explicit staging of relevant files.

---

## Validation

Run validation appropriate to the scope of the task.

Possible validation may include:

`pnpm lint`

`pnpm typecheck`

`pnpm build`

tests or targeted scripts where they exist.

Only use scripts that actually exist in `package.json`.

Do not invent commands and report them as successful.

If there is no typecheck script, use an appropriate existing TypeScript validation method only when necessary.

For a small UI-only change, use proportionate validation.

For database or session-related changes, perform stronger validation.

If validation cannot be completed, explain why.

Never report checks as passed unless they actually ran successfully.

---

## Git Staging

Stage only files related to the requested task.

Review staged changes before committing.

Use:

`git diff --staged`

when useful.

Do not accidentally stage:

- environment files
- local database files
- editor files
- logs
- screenshots
- unrelated generated files
- unrelated user work

---

## Git Reporting

After completing a coding task, report:

- current branch
- what was implemented
- files changed
- validation performed
- any warnings
- unresolved issues
- whether a commit was created
- commit hash if a commit was created
- whether the working tree is clean

Keep the report concise but complete.

Do not claim the working tree is clean without checking it.

---

## Remote Git Operations

Do not push to a remote repository unless explicitly requested.

Do not create a pull request unless explicitly requested.

Do not merge a pull request unless explicitly requested.

Do not modify repository settings unless explicitly requested.

If asked to push:

1. verify the intended branch
2. verify the intended remote
3. verify the working tree and commit state
4. push only the requested branch

Never force-push unless explicitly authorized and clearly necessary.

---

## Scope Control

Do not expand the task unnecessarily.

When implementing a requested feature:

- modify the smallest reasonable set of files
- preserve existing behavior outside the requested scope
- avoid opportunistic refactors
- avoid unrelated formatting changes
- avoid dependency upgrades unless required
- do not redesign unrelated screens

If another issue is discovered during implementation, report it rather than automatically fixing it unless it blocks the requested work.

---

## Code Quality

Write code that is:

- readable
- typed
- maintainable
- reasonably small
- consistent with the project
- easy for another developer or coding agent to continue

Prefer clear names over clever abstractions.

Avoid unnecessary comments that merely restate the code.

Add comments when they explain:

- non-obvious behavior
- security decisions
- state transitions
- unusual browser behavior
- important constraints

Do not leave dead code or commented-out experimental implementations.

---

## TypeScript

Prefer strong TypeScript types.

Avoid unnecessary `any`.

Do not silence TypeScript errors merely to make validation pass.

Avoid unsafe casts unless there is a justified reason.

Keep shared domain types in appropriate reusable locations when patterns emerge.

Do not over-engineer type abstractions for tiny local state.

---

## React Rules

Use modern React patterns.

Do not add `useMemo` or `useCallback` automatically.

The project uses React Compiler.

Allow the compiler to optimize ordinary component logic unless manual memoization is genuinely required.

Keep state as local as practical.

Avoid large global state solutions unless the product actually needs them.

Do not place sensitive server state into client-side global stores.

---

## Next.js Rules

Use App Router conventions.

Prefer server components by default.

Add `'use client'` only when required.

Client components should be kept as focused as practical.

Sensitive database operations belong on the server.

Do not import server-only modules into client components.

Do not expose environment variables to the browser unless they are intentionally public.

Use server actions or route handlers where appropriate.

---

## Database Migrations

Prefer migrations over one-off manual schema modifications.

Migration changes should be:

- focused
- reproducible
- reviewable
- safe for existing data

Test migrations against:

`mva_dev`

before applying them to:

`mva`

Do not apply production migrations automatically unless explicitly requested.

Do not reset the production database.

Do not delete existing production migrations casually.

---

## Testing Philosophy

Test behavior that matters.

Prioritize tests around:

- invite validation
- invite state transitions
- session recovery
- completion behavior
- return-visit behavior
- server-side security boundaries

Do not write large amounts of low-value tests merely to increase test count.

For UI behavior, use lightweight targeted verification when appropriate.

Critical security and state logic should receive stronger verification than decorative UI.

---

## UX Safety

Do not create dark patterns.

Do not intentionally make exit paths difficult.

Do not guilt the visitor into continuing.

Do not imply consequences for declining.

Do not make acceptance the only obvious button when a meaningful optional interaction should allow refusal.

Any invitation or second-visit escalation should remain easy to decline.

The experience should remain respectful even when the visitor does not engage further.

---

## Final Implementation Check

Before declaring a task complete, ask:

1. Does this match the requested scope?
2. Does it follow `docs/UI-UX-GUIDE.md`?
3. Is it mobile-first?
4. Is the interaction clear?
5. Is the implementation simpler than necessary, or appropriately simple?
6. Did this introduce unrelated changes?
7. Are secrets protected?
8. Is sensitive logic server-side?
9. Were appropriate checks actually run?
10. Is there anything the user should know before approving the change?

---

## Core Design Test

Before implementing a user-facing idea, ask:

> Does this make the experience clearer, more intentional, or more memorable?

If not, do not add it.

When multiple solutions are valid, prefer the one that is:

- simpler
- more readable
- more mobile-friendly
- more accessible
- easier to maintain
- less visually noisy

---

## Most Important Rule

The UI should disappear behind the interaction.

The visitor should not finish the experience thinking:

> That was a nice Material UI interface.

The intended reaction is closer to:

> What was that? 😂 That was actually cute.

Build toward that.

<!-- END:nextjs-agent-rules -->


