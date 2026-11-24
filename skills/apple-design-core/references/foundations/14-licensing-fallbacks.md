# 14 Licensing and fallbacks

Copying Apple's look is about matching values and behavior. Copying Apple's assets is not allowed. Follow these rules exactly.

## Fonts

- SF Pro, SF Compact, SF Mono, New York: licensed only for designing and developing apps for Apple platforms; not for web fonts, Android, Windows, Linux, and not for mockups of non Apple software.
- Allowed: calling the system font on Apple devices (web `-apple-system, system-ui`; Flutter default Cupertino font on iOS and macOS; Tauri on macOS WebKit). The OS renders SF; nothing is redistributed.
- Never commit .otf or .ttf files of SF fonts, never load them from a CDN.
- Fallback everywhere else: Inter variable (SIL OFL) with tracking from tokens plus Inter compensation. Rounded fallback: Nunito or ui-rounded. Serif fallback: Iowan Old Style or Georgia. Mono: JetBrains Mono (OFL).

## Icons

- SF Symbols: Apple platforms only. Use tokens/icons.json mapping to Lucide (ISC), Phosphor (MIT) or CupertinoIcons (MIT) on other platforms and on the web.

## Sounds

- Apple system sounds are Apple assets. Use the plugin's synthesized sounds only.

## Imagery and trademarks

- Do not use Apple logos, device frames, Memoji, wallpapers, app icons of Apple apps, or screenshots of Apple apps in shipped products.
- Do not name your product or components with Apple trademarks in user facing text (Liquid Glass is fine as an internal term in code comments).

## Kit usage

- The Apple UI kits are references for values (sizes, colors, spacing). Do not export and ship their artwork.

## Platform fidelity table

| Target | Font | Icons | Glass | Fidelity |
|---|---|---|---|---|
| Web on Safari macOS and iOS | real SF via system-ui | Lucide or Phosphor | blur and rim, no lens | very high |
| Web on Chromium desktop | Inter on Windows and Linux, SF on Mac | same | blur, rim, SVG lens | high |
| Flutter iOS and macOS | real SF | CupertinoIcons | shader or native glass | very high |
| Flutter Android | Inter | CupertinoIcons | BackdropFilter plus rim | high |
| Tauri macOS | real SF | Lucide or Phosphor | native window glass plus web glass | very high |
| Tauri Windows | Inter | same | Mica or Acrylic window plus web glass | medium high |
