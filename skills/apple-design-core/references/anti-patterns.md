# Anti-patterns: instant fails and their fixes

Read once per session. The lint hook detects the ones marked (lint).

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| Raw hex, rgb, hsl in components (lint) | breaks dark mode, HC, consistency | semantic token |
| Tailwind palette classes like text-gray-500, bg-blue-600, slate, zinc (lint) | not Apple colors | text-label-2, bg-accent |
| shadcn defaults: bg-primary, text-muted-foreground, border-input left unmapped (lint) | shadcn look | adapter remaps them; prefer cf names |
| rounded-md, rounded-lg, border-radius in px without squircle (lint) | corner kink | radius token plus squircle utility, or capsule |
| box-shadow typed by hand, shadow-md, shadow-lg (lint) | wrong depth | elevation token |
| transition with ease, ease-in-out, linear on transform (lint) | not spring | spring token |
| font-size not in the type scale, e.g. 14px, 18px (lint) | off scale | named text style |
| font-family Roboto, Arial, Helvetica directly (lint) | wrong font | cf font stack |
| Material ripple, InkWell, ElevatedButton, FloatingActionButton, Scaffold AppBar default (lint, Flutter) | Material feel | Cupertino based primitives from the adapter |
| Curves.easeInOut, Curves.linear for motion (lint, Flutter) | not spring | AppleSprings |
| BorderRadius.circular on rect containers (lint warn, Flutter) | corner kink | SquircleBorder |
| Gradient buttons | not Apple | tinted glass or filled accent |
| Card shadows in iOS lists | content layer has no shadows | grouped backgrounds |
| 1px gray borders around inputs and cards on iOS | web form look | fill backgrounds, no border |
| Hamburger menu | not iOS or macOS | tab bar (iOS), sidebar (iPad, macOS) |
| Top web navbar with links | website look | navigation bar with title, toolbar |
| Bottom Material snackbar | Android | inline status, or a top banner only for system level events |
| Multiple prominent buttons | no clear primary | one prominent, others bordered or plain |
| Uppercase labels with letter spacing | dated | sentence or title case with tokens tracking |
| Icon in a colored circle in every row | dashboard template look | plain icon in label-2, Settings style only in settings |
| Emoji as icons | unprofessional | SF Symbol equivalent from icons.json |
| Glass on cards or page backgrounds | glass is for controls | standard material or solid bg |
| Glass inside glass | muddy | overGlass fills |
| Heavy white border glassmorphism (border: 1px solid rgba(255,255,255,0.3)) | Dribbble glass, not Liquid Glass | Glass primitive (rim highlight via inset shadow) |
| Neon glows, colored shadows | not Apple | elevation tokens |
| Center aligned body copy | hard to read | leading aligned |
| Placeholder as the only label | disappears | label row or form label |
| Spinners for under 300ms work | flicker | show nothing, or delay spinner 300ms |
| Skeleton shimmer everywhere | web pattern | system activity indicator or progressive content |
| Toasts for routine success | noise | inline state change plus success haptic |
| Fixed pixel font sizes ignoring Dynamic Type | inaccessible | type scale variable |
| Disabled buttons with no explanation | confusing | footer text explains |
| Infinite decorative animations | distracting | none |
| Custom scrollbars on macOS style | not native | system scrollbars (overlay) |
| Pointer cursor on every button (macOS style) | web feel | default arrow |
| Window chrome mimicked on Windows with fake traffic lights in a native titlebar app | confusing | in Tauri use custom titlebar with traffic lights only when style is macos and decorations are off |
| SF font files or Apple icons bundled | license violation | system font calls, mapped icon sets |
| Hand-drawn Apple Pay or Sign in with Apple buttons (`[official]`) | trademark & App Review violation | always use official Apple components/APIs (`PKPaymentButton`, `ASAuthorizationAppleIDButton`, or official JS SDKs); see `references/extras/brand-constrained.md` |
| #007AFF blue, 10pt grouped radius, glued tab bar | iOS 18 era | iOS 27 tokens |
