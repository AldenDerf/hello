# UI/UX GUIDE — hello.aldenderf.com

## 1. Product Intent

`hello.aldenderf.com` is a private, mobile-first, guided interactive experience.

It is not a conventional website, dashboard, portfolio, SaaS app, or marketing landing page.

It should feel like:

> A carefully made private message that happens to be a website.

The intended emotional flow is:

curious → comfortable → amused → intrigued → surprised

Never:

overwhelmed → pressured → confused → invaded → creeped out

---

## 2. Core Visual Direction

Primary style:

**Cinematic Minimalism**

Secondary accent:

**Subtle Glassmorphism**

The experience should rely on:

- large typography
- strong whitespace
- near-black backgrounds
- restrained color
- controlled motion
- few elements per screen
- deliberate pacing
- one main idea per scene

Avoid filling empty space unnecessarily.

---

## 3. Visual Personality

The interface should feel:

- confident, not needy
- playful, not childish
- personal, not invasive
- slightly romantic, not cheesy
- technical, but not hacker-themed
- premium, but not pretentious
- mysterious, but not suspicious
- memorable, but not visually chaotic

A useful mental reference:

> Apple-style product reveal × private Instagram DM × interactive short film

Do not literally copy another brand.

---

## 4. Mobile-First Design

Primary target:

`390 × 844`

Primary mobile range:

`320px – 480px`

Secondary range:

`481px – 768px`

Desktop should preserve the same guided experience with more whitespace.

Do not turn desktop into a dashboard or multi-column layout unless there is a deliberate reason.

Use:

`100dvh`

for full-screen scenes.

Prefer natural scrolling over shrinking content aggressively.

---

## 5. Layout Rules

Default layout:

- single-column
- vertically centered when appropriate
- approximately `420px–520px max-width`
- `16px–24px` horizontal mobile padding
- large spacing between emotional beats

Typical scene:

```text
context label
↓
main statement
↓
supporting copy
↓
primary interaction

Not every scene needs every element.
Avoid:
- nested cards
- sidebars
- navbars
- footers
- hamburger menus
- dense sections
This is a guided experience, not a normal website.
6. Whitespace
Whitespace is intentional.
It may communicate:
- pause
- confidence
- anticipation
- emphasis
- emotional pacing
If a screen feels slightly empty, that may be correct.
Do not add decoration simply to occupy space.
7. Color System
Primary background:
#080808
Elevated background:
#101010
Surface:
#141414
Primary text:
rgba(255,255,255,0.96)
Secondary text:
rgba(255,255,255,0.62)
Muted text:
rgba(255,255,255,0.40)
Border:
rgba(255,255,255,0.08)
Strong border:
rgba(255,255,255,0.14)
Accent:
#7C9EFF
Use the accent sparingly.
Good uses:
- focus states
- selected states
- access success
- small highlights
- subtle progress indicators
Avoid bright neon styling or multiple competing accent colors.
8. Typography
Primary typeface:
Geist
Suggested scale:
Hero
42px–56px
Weight 600–700
Letter spacing around -0.03em to -0.05em
Headline
30px–38px
Subheading
20px–24px
Body
16px–18px
Line height 1.5–1.65
Small
13px–14px
Uppercase should mainly be reserved for short system states such as:
- ACCESS GRANTED
- ACCESS DENIED
- ONE-TIME ACCESS
Do not overuse monospace typography.
Monospace may be used sparingly for:
- access codes
- system labels
- technical jokes
- status text
9. Copy Is Part of the Interface
Copy controls pacing.
Do not automatically combine short lines into large paragraphs.
Example:
I've seen you before.

You probably didn't notice me.

But I noticed you.

A scene may intentionally contain only:
Wait.

or:
Interesting.

That is acceptable.
Tone should be:
- natural
- confident
- conversational
- self-aware
- lightly playful
- restrained
Avoid:
- begging
- guilt
- pressure
- exaggerated romance
- desperation
- overly dramatic language
- excessive emojis
- overexplaining
Humor should generally be dry and self-aware.
10. Share-Safe Content
Assume screenshots may be shared.
The content should remain acceptable outside its original context.
Avoid:
- obsessive language
- possessive wording
- manipulative messages
- highly private claims
- embarrassing oversharing
- sexual pressure
- anything that would become creepy if screenshotted
The experience should remain respectful even if shared.
11. Buttons and Actions
Minimum touch target:
48px
Preferred button height:
48px–56px
Preferred radius:
12px–16px
Prefer:
- one primary action
- one optional secondary action
- up to three choices when necessary
Avoid too many equal-weight buttons.
Prefer contextual labels over repetitive:
Next
Examples:
- Continue
- Reveal it
- Alright. I'm listening.
- I'm focused. Continue.
Clarity matters more than cleverness.
12. Material UI Philosophy
Material UI is infrastructure, not the visual identity.
Use it for:
- accessibility
- responsive primitives
- reliable components
- consistent behavior
Appropriate primitives include:
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
Customize them to match this project.
Avoid default MUI appearance such as:
- generic Material purple
- enterprise-style forms
- default Paper cards everywhere
- unnecessary elevation
- obvious dashboard styling
Repeated visual patterns should move into the theme or reusable components when appropriate.
Do not prematurely create a large design system.
13. Glassmorphism Rules
Glassmorphism is an accent only.
Good places:
- access panel
- modal
- temporary system panel
- choice container
Suggested feel:
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(16px);

Avoid:
- glass card inside glass card
- entire screens made of floating glass panels
- excessive blur
14. Motion Philosophy
Use Motion for purposeful storytelling.
Typical timings:
- microinteraction: 150ms
- normal transition: 250–400ms
- selected dramatic reveal: 500–800ms
Preferred effects:
- fade
- slight translateY
- slight scale
- restrained blur reveal
- staggered copy
- subtle progress animation
Avoid:
- constant bouncing
- spinning
- giant zooms
- heavy parallax
- flashy transitions on every scene
- animation that makes the visitor wait unnecessarily
The experience should feel calm.
15. Reduced Motion
Respect:
prefers-reduced-motion
When enabled:
- reduce movement distance
- simplify blur effects
- reduce stagger
- prefer fades
- shorten decorative animation
Core functionality must remain unchanged.
16. Animation and Logic
Business state must not depend on animation completion.
Preferred architecture:
state / business logic
↓
UI presentation
↓
motion enhancement

Do not make important database or session updates depend solely on an animation callback.
17. Interaction Philosophy
Avoid repetitive:
Next
Next
Next
Next

Use varied interactions only when they support the narrative.
Possible patterns:
- enter code
- tap to continue
- choose an answer
- reveal
- hold to continue
- fake analysis
- finish
Every interaction should have a reason.
If the interaction is only there because it looks cool, simplify it.
18. Scene Design
Each scene should have one main purpose.
Examples:
- authenticate
- warn
- intrigue
- joke
- reveal
- ask
- conclude
Avoid putting multiple emotional beats into one crowded screen.
Use approximately one major visual effect per scene.
Examples:
Access success
soft glow + reveal
Warning
subtle glass panel
Fake analysis
controlled progress animation
Sincere reveal
almost no effects
The most sincere moments should generally be the simplest.
19. Accessibility
Maintain:
- readable contrast
- semantic HTML
- visible focus states
- keyboard support
- accessible labels
- correct button semantics
- reasonable touch targets
- meaningful error states
Do not rely exclusively on color.
Do not disable browser zoom.
Use ARIA only when native HTML semantics are insufficient.
20. One-Handed Mobile UX
Critical controls should be easy to reach.
Avoid required actions only in the top-right corner.
Forms must behave properly when the mobile keyboard opens.
Avoid:
- hidden buttons behind the keyboard
- layout jumps
- fixed elements covering inputs
- tiny icon-only controls
Account for safe-area insets when needed.
21. Inputs
Inputs should feel integrated into the experience.
For access codes:
- clear readable text
- visible focus state
- easy correction
- mobile-friendly input
- minimal form chrome
Do not make the access screen look like a corporate login page.
Do not obscure the code like a password unless required.
22. Loading States
Prefer contextual loading copy over generic spinners.
Examples:
Checking your code...

or:
Running completely unnecessary analysis...

Do not artificially slow real network operations for drama.
If a fake analysis sequence exists, it should be clearly harmless and separate from real server latency.
23. Error States
Errors should be human-readable.
Instead of:
Error 401

prefer:
That code doesn't look right.

For system failures:
Something went wrong on my side.

Try that again.

Do not blame the visitor.
Do not expose stack traces or internal database messages.
24. Privacy and Trust
The experience should feel private because of access design, not surveillance.
Do not implement:
- precise location tracking
- browser fingerprinting
- device fingerprinting
- hidden analytics
- unnecessary IP logging
- microphone access
- camera access
- clipboard monitoring
- contact access
Do not imply capabilities the browser does not have.
Never show misleading messages such as:
- I know you took a screenshot.
- I know where you are.
- I know you switched apps.
- I can see your screen.
The website cannot reliably prevent screenshots or screen recordings.
Design everything to remain share-safe.
25. Fake System / Technical Humor
System-style UI may be used sparingly.
Examples:
- ACCESS GRANTED
- ACCESS DENIED
- CHECKING CODE
- ONE-TIME ACCESS
Do not make the entire site look like a terminal.
Technical humor should be understandable even to someone who is not a developer.
Good example:
A normal person would've sent "hi."

Avoid jokes that depend on niche programming knowledge.
Fake analysis must never pretend to collect real personal information.
Good:
Checking level of unnecessary effort...

Avoid:
Scanning your device...

26. Navigation
This is a guided experience.
Traditional navigation is generally unnecessary.
Avoid:
- navbar
- sidebar
- breadcrumbs
- hamburger menu
- footer navigation
Browser Back should not produce broken states.
Do not create unnecessary history entries for every tiny scene transition.
27. Exit and Decline Paths
Do not create dark patterns.
The visitor should always be able to leave.
Optional invitations should remain optional.
If a choice such as coffee or milk tea is presented, include a respectful decline path where appropriate.
Do not use:
- guilt
- fake urgency
- countdown pressure
- emotional punishment
- forced choices
Declining should not trigger a sad or manipulative response.
28. One-Time Experience Messaging
One-time messaging must remain truthful.
Good:
One first run.

Avoid misleading claims such as:
This disappears forever if you look away.

unless that is literally how the system works.
Accidental refresh should not be treated as intentional completion.
29. First-Run Experience
The first-run flow should prioritize:
- curiosity
- pacing
- humor
- sincerity
- confidence
Do not rush directly into the most personal message.
Build toward it.
Sincere scenes should reduce:
- animation
- glow
- glass effects
- jokes
- system styling
Let the copy carry the moment.
30. Return-Visit Experience
A return visit may be slightly more playful.
It should still look and feel like the same product.
Return recognition should be factual and playful.
Good:
Wait.

Bumalik ka?

Do not imply hidden tracking beyond the invite/session state.
31. Completion
The ending should feel intentional and calm.
Do not end abruptly on a blank screen.
Do not turn the ending into a funnel with multiple CTAs.
Avoid stacking:
- message me
- follow me
- share this
- click here
- subscribe
The ending should preserve confidence.
32. Responsive Behavior
Mobile
- full-screen scenes
- large touch targets
- focused content
Tablet
- same experience
- more whitespace
Desktop
- narrow centered content
- approximately 480px–560px max-width
- no unnecessary multi-column redesign
Landscape
- remain usable
- allow natural scrolling
- reduce spacing if needed
- never hide important controls
Avoid horizontal scrolling.
33. Spacing and Radius
Use a consistent spacing system based around:
4px
Common increments:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64
Suggested radii:
Controls
10px–14px
Buttons
12px–16px
Panels
16px–24px
Avoid making everything pill-shaped.
34. Gradients, Shadows, and Effects
Gradients are allowed only when subtle.
Good uses:
- faint radial atmosphere
- soft success glow
- restrained background illumination
Avoid:
- loud rainbow gradients
- gradient text everywhere
- generic purple-blue AI backgrounds
Use shadows sparingly.
Prefer:
- subtle border
- surface contrast
- restrained glow
over giant floating-card shadows.
35. Performance
Prioritize fast loading on mobile connections.
Avoid unnecessary:
- large client bundles
- heavy videos
- oversized images
- decorative 3D assets
- dependencies for one tiny effect
Prefer server components when client interactivity is not required.
Use 'use client' only where necessary.
Do not autoplay audio.
If media is added later, it must not be required to understand the experience.
36. Component Philosophy
Do not prematurely componentize every layout.
Create reusable components only when a meaningful pattern exists.
Possible future components:
- ExperienceShell
- Scene
- PrimaryAction
- SecondaryAction
- ChoiceButton
- AccessCodeInput
- SystemMessage
- RevealText
- SceneTransition
These are possibilities, not requirements.
Prefer readable scene code over unnecessary abstraction.
37. Avoid Generic AI Website Styling
Actively avoid:
- glowing purple-blue backgrounds
- floating orb decorations
- excessive glass cards
- giant gradient headings
- generic startup hero layouts
- meaningless cards
- cyberpunk effects
- random animated blobs
The project should feel authored, not generated from a trendy template.
38. Avoid Dating-App Styling
Do not use:
- heart particles
- Valentine's styling
- bright pink/red as the primary identity
- swipe-card interfaces
- excessive romantic iconography
The experience should feel personal and confident, not like a dating product.
39. Design Anti-Patterns
Avoid:
- excessive glassmorphism
- excessive gradients
- excessive shadows
- neon hacker styling
- retro styling without purpose
- brutalism without purpose
- heavy neumorphism
- giant card collections
- tiny buttons
- walls of text
- repetitive Next buttons
- horizontal scrolling
- decorative clutter
- unnecessary settings
- theme toggles
- navbars
- footers
- sidebars
unless explicitly required.
40. Design Review Checklist
Before finalizing a scene, ask:
1. What is the one thing this screen is communicating?
2. Is anything competing with it?
3. Is the primary action obvious?
4. Does it work well around 390px width?
5. Are touch targets large enough?
6. Is the copy readable?
7. Is motion helping?
8. Does it feel confident rather than needy?
9. Is it respectful?
10. Would it still look okay in a screenshot?
11. Can anything be removed?
41. Interaction Review Checklist
Before adding an interaction, ask:
1. Why does the visitor need to do this?
2. Is it understandable?
3. Is it mobile-friendly?
4. Does the action provide immediate feedback?
5. Is there a simpler alternative?
6. Does it improve the story?
If not, remove it.
42. Motion Review Checklist
Before adding motion, ask:
1. Does it communicate state?
2. Does it improve pacing?
3. Does it improve hierarchy?
4. Would the experience still work without it?
5. Is it respectful of reduced-motion users?
If it exists only because it looks cool, reconsider it.
43. Core Decision Rule
Before adding any user-facing element, ask:
Does this make the experience clearer, more intentional, or more memorable?

If not, do not add it.
When multiple solutions are valid, prefer the one that is:
- simpler
- clearer
- more mobile-friendly
- more accessible
- easier to maintain
- less visually noisy
44. Final Design Goal
The interface should not feel like:
a Material UI project

or:
an AI-generated trendy landing page

or:
a romantic template

It should feel like:
Someone deliberately made this one small experience for one person.

45. Most Important Rule
The UI should disappear behind the interaction.
The visitor should not finish thinking:
That was a nice interface.

The intended reaction is closer to:
What was that? 😂

That was actually cute.

Build toward that.

Save mo exactly as:

```text
docs/UI-UX-GUIDE.md

After that, ready na tayo sa Phase 00 Codex prompt.
