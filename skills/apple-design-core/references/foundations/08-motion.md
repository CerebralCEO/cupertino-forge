# 08 Motion

Source of truth: `tokens/motion.json`. SwiftUI's default animation is a spring with response 0.55 and damping fraction 1.0; presets smooth (bounce 0), snappy (0.15), bouncy (0.3) use duration 0.5.

## Spring model

Duration d and bounce b convert to physics (mass 1): stiffness = (2 pi / d)^2, damping = 4 pi (1 - b) / d.

| Token | Duration | Bounce | Use |
|---|---|---|---|
| default | 0.55 | 0 | anything without a rule |
| smooth | 0.5 | 0 | layout and size changes, fades with movement |
| snappy | 0.5 | 0.15 | selection, toggles, segmented indicator |
| bouncy | 0.5 | 0.3 | playful confirmations, drop into place (rare) |
| interactive | 0.15 | 0 | finger tracking, drag follow |
| press | 0.2 | 0 | press down |
| release | 0.35 | 0.15 | release after press, glass settle |
| sheet | 0.5 | 0 | sheets, detents |
| push | 0.5 | 0 | navigation push and pop |
| popover | 0.35 | 0.1 | menus, popovers, alerts in |
| glassMorph | 0.45 | 0.2 | glass shapes merging and splitting |

Implementation:
- Web: `motion` (Framer Motion) with `spring('snappy')` helper from generated TS; pure CSS transitions use `var(--cf-ease-snappy)` and `var(--cf-dur-snappy)` (a sampled spring curve).
- Flutter: `AppleSprings.snappy` with `SpringSimulation` or `AnimationController.animateWith`.
- Never use ease, ease-in, ease-out, ease-in-out, linear (keywords or Curves.easeInOut) for movement. Opacity only crossfades may use 200ms with the smooth curve.

## Transitions catalog

| Transition | Spec |
|---|---|
| Navigation push | incoming slides from trailing edge 100 percent; outgoing moves to leading 30 percent and dims 10 percent; spring push; interruptible; back swipe from leading 20pt edge |
| Sheet present | slides from bottom with spring sheet; scrim fades in the same spring; drag down to dismiss with velocity 600 pt/s or 40 percent distance |
| Alert | scale 1.08 to 1 and opacity 0 to 1, spring popover; dismiss opacity 150ms |
| Menu / popover | grows from its source button: scale 0.6 to 1 anchored at the source, opacity, spring popover; glass morphs out of the button; close scale 0.8 and fade 180ms |
| Context menu | target lifts 1.04, background blurs 20, menu springs in |
| Tab switch | content crossfade 150ms (no slide); selection capsule slides with snappy |
| Tab bar minimize | glassMorph while scrolling down, restore on scroll up |
| Toggle | knob snappy, knob stretches to 1.25 width while pressed, track color crossfade 150ms |
| Segmented | indicator slides snappy, stretches while dragging |
| List row tap | highlight appears instantly, fades out 250ms after release |
| Expand / collapse | height and opacity smooth; chevron rotates 90 degrees with snappy |
| Drag and drop | lift 1.03 to 1.05 with shadow, follow with interactive, drop with snappy and rigid haptic |
| Pull to refresh | rubber band, spinner appears after threshold with light haptic |

## Gestures

- Track the finger 1:1 (interactive spring), then hand off velocity to the settle spring. Never snap without velocity.
- Rubber band past edges: offset = (1 - 1 / ((x * 0.55 / d) + 1)) * d.
- Scroll deceleration 0.998 per ms (normal), 0.99 (paging feel).
- Every animation can be interrupted mid flight by a new gesture.

## Reduced motion

Replace movement with 200ms crossfades, set bounce 0, disable parallax and glass wobble, keep state feedback. Generated CSS already swaps easing under prefers-reduced-motion; JS code must check `useReducedMotion()` / `MediaQuery.disableAnimations`.

## Do not

Animate on page load for decoration, stagger lists on every visit, bounce primary navigation, animate blur radius, animate box-shadow on scroll, use durations over 600ms for UI, loop anything except activity indicators.
