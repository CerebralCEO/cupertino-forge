# 08 Motion

Source of truth: `tokens/motion.json`. SwiftUI `Spring` presets: `default` (0.55, 0), `smooth` (0.5, 0), `snappy` (0.5, 0.15), and `bouncy` (0.5, 0.3) -> verified `(mass: 1.0, stiffness: 157.9, damping: 17.6)` directly against Apple SwiftUI documentation `[official]`. Scroll `decelerationRate`: `0.998` normal / `0.99` fast `[official]`. Custom transitions and rubber-band constant `c = 0.55` carry `[inferred]` / `[estimate]` provenance.

## Spring model

Duration d and bounce b convert to physics (mass 1 `[official]`): stiffness = (2 pi / d)^2, damping = 4 pi (1 - b) / d.

| Token | Duration | Bounce | Provenance | Use |
|---|---|---|---|---|
| default | 0.55 | 0 | `[official]` | anything without a rule |
| smooth | 0.5 | 0 | `[official]` | layout and size changes, fades with movement |
| snappy | 0.5 | 0.15 | `[official]` | selection, toggles, segmented indicator |
| bouncy | 0.5 | 0.3 | `[official]` | playful confirmations, drop into place (rare) |
| interactive | 0.15 | 0 | `[estimate]` | finger tracking, drag follow |
| press | 0.2 | 0 | `[estimate]` | press down |
| release | 0.35 | 0.15 | `[estimate]` | release after press, glass settle |
| sheet | 0.5 | 0 | `[estimate]` | sheets, detents |
| push | 0.5 | 0 | `[estimate]` | navigation push and pop |
| popover | 0.35 | 0.1 | `[estimate]` | menus, popovers, alerts in |
| glassMorph | 0.45 | 0.2 | `[estimate]` | glass shapes merging and splitting |

Implementation:
- Web: `motion` (Framer Motion) with `spring('snappy')` helper from generated TS; pure CSS transitions use `var(--cf-ease-snappy)` and `var(--cf-dur-snappy)` (a sampled spring curve).
- Flutter: `AppleSprings.snappy` with `SpringSimulation` or `AnimationController.animateWith`.
- Never use ease, ease-in, ease-out, ease-in-out, linear (keywords or Curves.easeInOut) for movement. Opacity only crossfades may use 200ms with the smooth curve.

## Transitions catalog

| Interaction -> Motion | Spec | Interruptible | Reduced Motion (`[inferred]`) |
|---|---|---|---|
| Navigation push | incoming slides from trailing edge 100%; outgoing moves to leading 30% (`[inferred]`) and dims 10%; spring push; back swipe from leading 20pt edge `[estimate]` | Yes | 200ms crossfade, no slide/parallax |
| Shared element / Zoom | SwiftUI `NavigationTransition.zoom` + `matchedTransitionSource` (`[official]`) / `matchedGeometryEffect`; Web View Transitions API / `layoutId`; Flutter `Hero` | Yes | 200ms crossfade |
| Sheet present | slides from bottom with spring sheet; scrim fades; drag dismiss velocity 600 pt/s or 40% distance `[estimate]` | Yes | 200ms crossfade, bounce 0 |
| Alert | scale 1.08 to 1 and opacity 0 to 1, spring popover; dismiss opacity 150ms `[estimate]` | Yes | 200ms crossfade, no scale |
| Menu / popover | grows from source button: scale 0.6 to 1 anchored at source, spring popover; close scale 0.8 and fade 180ms `[estimate]` | Yes | 200ms crossfade |
| Context menu | target lifts 1.04, background blurs 20, menu springs in `[estimate]` | Yes | 200ms crossfade, no blur animation |
| Tab switch | content crossfade 150ms `[estimate]`; selection capsule slides with snappy | Yes | 150ms crossfade only |
| Tab bar minimize | `.tabBarMinimizeBehavior(.onScrollDown)` `[official]` + glassMorph `[estimate]` | Yes | instant/200ms crossfade |
| Toggle / Segmented | knob snappy, knob stretches 1.25 `[estimate]`, track color crossfade 150ms | Yes | instant/150ms color crossfade, bounce 0 |
| List row tap | highlight appears 0ms, fades out 250ms `[estimate]` | Yes | 200ms fade |
| Expand / collapse | height and opacity smooth; chevron rotates 90 deg snappy `[estimate]` | Yes | 200ms crossfade |
| Drag and drop | lift 1.03–1.05, follow interactive, drop snappy + rigid haptic `[estimate]` | Yes | no overshoot, bounce 0 |
| Pull to refresh | rubber band (`c=0.55` `[inferred]`), spinner after threshold + light haptic | Yes | spinner fade 200ms |

## Gestures

- Track finger 1:1 (`interactive` spring), hand off velocity to settle spring.
- Rubber band past edges: offset = (1 - 1 / ((x * 0.55 / d) + 1)) * d (`[inferred]`).
- Scroll deceleration: `0.998` per ms (`normal`), `0.99` (`fast`) (`UIScrollView.DecelerationRate` `[official]`).
- Input modality (`[official]` HIG Motion): Liquid Glass responds with stronger emphasis on touch than on trackpad/mouse (`1.08–1.12` vs `1.02` `[inferred]`).

## Reduced motion

Replace x/y/z slides, scales, and blur transitions (`Avoid animating into and out of blurs` `[official]`) with 200ms crossfades (`[inferred]`), set bounce 0, disable parallax and glass wobble. CSS swaps automatically under `prefers-reduced-motion`; Web React MUST wrap root in `<MotionConfig reducedMotion="user">` (`[official]`); Flutter checks `MediaQuery.disableAnimationsOf(context)`.

## Do not

Animate on page load for decoration, stagger lists on every visit, bounce primary navigation, animate blur radius, animate box-shadow on scroll, use durations over 600ms for UI, loop anything except activity indicators.
