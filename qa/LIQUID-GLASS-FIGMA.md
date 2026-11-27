# Liquid Glass & Blur Calibration Audit (Phase 8A-2: Task 4)

> **Date:** 2026-11-27 | **Sources:** ForgeKit `tokens/effects.json` (`usedIn` resolved via `components/*/layout.json`), `tokens/variables.json`, Figma Official Developer Docs, and headless Chromium blur step-edge calibration.
> **Rule:** Read-only analysis & proposal. **Zero edits** to `tokens/materials.json` in Step A.

## 1. All Figma `GLASS` Effect Instances (`usedIn` Bug Fixed)

| Kit | Usage Count | `lightIntensity` | `lightAngle` | `refraction` | `depth` | `dispersion` | `radius` (frost) | `overlayFills` | Resolved Components / Node IDs (`usedIn`) |
|---|---|---|---|---|---|---|---|---|---|
| `ios27` | 687 | 0.25 | 0 | 0.7 | 30 | 0.2 | 6 | none | `Examples-Activity-View` (`I13122:40324;13112:5181;5583`), `Examples-Activity-View` (`I13122:40324;13112:5167;1311`), `Examples-Activity-View` (`I13122:40324;13112:5167;5591`) |
| `ios27` | 149 | 0.4 | 0 | 0.7 | 30 | 0.2 | 6 | none | `Examples-Home-Screen-Widgets` (`I12740:23806;595:43314;5593:`), `Examples-Home-Screen-Widgets` (`I12740:23806;595:43314;5593:`), `Examples-Home-Screen-Widgets` (`I12740:23806;595:43314;5593:`) |
| `ios27` | 71 | 0.25 | 0 | 0.7 | 30 | 0.2 | 16 | #ffffff@1 [MULTIPLY] | `Examples-Alerts` (`I12956:23828;5446:7340;10411`), `Examples-Alerts` (`I12956:23801;5446:7340;10411`), `Examples-Alerts` (`I12956:23855;5446:7340;10411`) |
| `ios27` | 59 | 1 | 0 | 0.8 | 40 | 0.5 | 8 | #d4d4d4bd@0.74 [LUMINOSITY]; #1c1c1c@1 [LINEAR_DODGE]; #e6e8ed@1 [LINEAR_BURN] | `Examples-Keyboard` (`I12891:51373;12890:27000`), `Examples-Keyboard` (`I12891:51286;12890:30515`), `Examples-Keyboard` (`I12891:51199;12890:31523`) |
| `ios27` | 45 | 0.2 | 0 | 0.7 | 30 | 0.2 | 3 | none | `Examples-Home-Screen-Widgets` (`I12740:23806;595:43314;5592:`), `Examples-Home-Screen-Widgets` (`I12740:23803;595:43458;5592:`), `Examples-Home-Screen-Widgets` (`I12740:23800;595:43594;5592:`) |
| `ios27` | 12 | 0 | 0 | 0.8 | 7 | 0 | 0 | #ffffff17@0.09 [NORMAL] | `Sliders` (`I10456:2091;10456:2980`), `Sliders` (`I10456:2081;10456:2980`), `Sliders` (`I10456:2070;10456:2980`) |
| `ios27` | 10 | 0.4 | 0 | 0.5 | 1 | 0 | 0 | none | `Examples-Notifications` (`I12740:23789;6491:17549`), `Examples-Notifications` (`I12740:23784;6491:17549`), `Examples-Control-Center` (`I12740:35261;5593:44609;6491`) |
| `ios27` | 1 | 1 | 0 | 0.8 | 40 | 0 | 8 | #00000040@0.25 [NORMAL]; #cccccc@1 [LINEAR_BURN]; #0d0d0d@1 [LINEAR_DODGE] | `_Background-Keyboard` (`537:133479`) |
| `macos27` | 248 | 0.25 | 0 | 0.7 | 30 | 0.2 | 6 | #ffffff@1 [MULTIPLY] | `Liquid-Glass-Small` (`4311:12242`), `Liquid-Glass-Small` (`483:9287`), `Liquid-Glass-Small` (`483:9269`) |
| `macos27` | 159 | 0 | 0 | 0.9 | 4 | 0 | 0 | #ffffff17@0.09 [NORMAL] | `Slider-Center-biased` (`I533:10597;4352:10422;4350:1`), `Slider-Center-biased` (`I533:10583;4352:10422;4350:1`), `Slider-Center-biased` (`I533:10573;4352:10422;4350:1`) |
| `macos27` | 29 | 0.2 | 0 | 0.7 | 40 | 0.4 | 25 | #ffffff@1 [MULTIPLY] | `Menu-Background` (`4353:2564`), `Menu-Background` (`4353:2523`), `Examples-Menubar` (`I4370:42756;488:1829;4353:25`) |
| `macos27` | 27 | 0.15 | 0 | 0.7 | 40 | 0.2 | 26 | #ffffff@1 [MULTIPLY] | `Popover` (`4336:13388`), `Popover` (`4336:13382`), `Popover` (`4336:13376`) |
| `macos27` | 24 | 0.25 | 0 | 0.7 | 30 | 0.2 | 25 | #ffffff@1 [MULTIPLY] | `Notification` (`I4358:11431;4358:11548`), `Notification` (`I568:3272;4358:11538`), `Notification` (`I4358:11619;4358:11548`) |
| `macos27` | 16 | 0.25 | 0 | 0.7 | 30 | 0.2 | 16 | #ffffff@1 [MULTIPLY] | `Liquid-Glass-Medium` (`4311:12609`), `Liquid-Glass-Medium` (`4311:12658`), `Liquid-Glass-Large` (`4311:12663`) |
| `macos27` | 10 | 0.1 | 0 | 0.7 | 30 | 0.2 | 16 | #ffffff@1 [MULTIPLY] | `Dock` (`4355:11429`), `Dock` (`4355:11466`), `Desktop-Template` (`I4355:8851;4355:11429`) |

## 2. Key `BACKGROUND_BLUR` & `LAYER_BLUR` Instances (Top by Usage)

| Kit | Type | Usage | `radius` | `blurType` | `overlayFills` | Resolved Components / Node IDs |
|---|---|---|---|---|---|---|
| `ios27` | `BACKGROUND_BLUR` | 63 | `135.91` | `NORMAL` | #ffffff@1 [LINEAR_DODGE] | `Examples-Notifications` (`I12740:23789;598:3760;525:`), `Examples-Notifications` (`I12740:23789;598:3760;525:`) |
| `ios27` | `BACKGROUND_BLUR` | 59 | `16` | `NORMAL` | #000000@1 [SCREEN] | `Examples-Activity-View` (`I12946:17353;12884:8003;13`), `Examples-Activity-View` (`I13158:42407;12884:8003;13`) |
| `macos27` | `BACKGROUND_BLUR` | 54 | `81.55` | `NORMAL` | #ffffff00@0 [NORMAL]; #e3e3e359@0.35 [NORMAL] | `Popover` (`4336:13389`), `Popover` (`121:11385`) |
| `ios27` | `BACKGROUND_BLUR` | 46 | `40` | `NORMAL` | none | `Examples-Notifications` (`I12740:23789;598:3762`), `Examples-Notifications` (`I12740:23789;598:3762;145:`) |
| `macos27` | `BACKGROUND_BLUR` | 41 | `6` | `NORMAL` | #1f1f1f8c@0.55 [NORMAL] | `Scroll-Edge-Effect-Hard` (`4363:18598`), `Scroll-Edge-Effect-Hard` (`4363:18597`) |
| `ios27` | `BACKGROUND_BLUR` | 40 | `100` | `NORMAL` | #ffffff57@0.34 [LINEAR_DODGE]; #ffffffd6@0.84 [COLOR_DODGE] | `_Materials` (`510:79116`), `_Materials-Mode-Options` (`510:78335`) |
| `ios27` | `BACKGROUND_BLUR` | 34 | `100` | `NORMAL` | #000000@1 [SCREEN] | `Examples-Toolbars-Top` (`I12740:24032;5661:28853`), `Examples-Toolbars-Top` (`I12740:24024;5661:28853`) |
| `ios27` | `BACKGROUND_BLUR` | 33 | `10` | `PROGRESSIVE` | none | `Examples-Toolbars-Top` (`12740:24032`), `Examples-Toolbars-Top` (`12740:24024`) |
| `macos27` | `BACKGROUND_BLUR` | 27 | `80` | `NORMAL` | none | `BG` (`4361:22111`), `BG` (`4361:22112`) |
| `ios27` | `BACKGROUND_BLUR` | 25 | `40` | `NORMAL` | #ffffff@1 [LINEAR_DODGE] | `Examples-Notifications` (`I12740:23789;598:3763;525:`), `Examples-Notifications` (`I12740:23789;598:3763;525:`) |
| `ios27` | `BACKGROUND_BLUR` | 24 | `135.91` | `NORMAL` | #ffffff57@0.34 [NORMAL]; #ffffffc7@0.78 [NORMAL] | `Lock-Screen-Widget-Clock` (`525:43275`), `Lock-Screen-Widget-Clock` (`525:43274`) |
| `ios27` | `BACKGROUND_BLUR` | 21 | `100` | `NORMAL` | #ffffff12@0.07 [NORMAL]; #ffffff08@0.03 [COLOR_DODGE] | `Examples-Notifications` (`I12740:23789;598:3759;526:`), `Examples-Notifications` (`I12740:23784;598:3759;526:`) |
| `ios27` | `BACKGROUND_BLUR` | 19 | `130` | `NORMAL` | #ff0000@1 [NORMAL] | `Popovers-(iPad-Only)` (`5433:21466`), `Popovers-(iPad-Only)` (`5433:21457`) |
| `macos27` | `BACKGROUND_BLUR` | 19 | `6` | `NORMAL` | #ffffffd9@0.85 [NORMAL] | `Scroll-Edge-Effect-Hard` (`4363:18596`), `Scroll-Edge-Effect-Hard` (`4363:18595`) |
| `ios27` | `BACKGROUND_BLUR` | 17 | `130` | `NORMAL` | none | `Popovers-(iPad-Only)` (`61:65434`), `Popovers-(iPad-Only)` (`0:12354`) |
| `ios27` | `BACKGROUND_BLUR` | 14 | `70` | `NORMAL` | #ffffff99@0.6 [LINEAR_DODGE] | `Examples-Notifications` (`I12740:23789;598:3764;526:`), `Examples-Notifications` (`I12740:23789;598:3764;558:`) |
| `macos27` | `LAYER_BLUR` | 159 | `6` | `NORMAL` | none | `Slider-Center-biased` (`I533:10597;4352:10422;4350`), `Slider-Center-biased` (`I533:10583;4352:10422;4350`) |
| `ios27` | `LAYER_BLUR` | 12 | `6` | `NORMAL` | none | `Sliders` (`I10456:2091;10456:2979`), `Sliders` (`I10456:2081;10456:2979`) |
| `ios27` | `LAYER_BLUR` | 3 | `100` | `NORMAL` | none | `Examples-Notifications` (`I12740:23792;5551:16764`), `Examples-Notifications-2` (`I12740:24436;5551:16764`) |
| `ios27` | `LAYER_BLUR` | 2 | `120` | `NORMAL` | none | `Examples-Control-Center` (`I12740:35261;2607:22009`), `Control-Center-iPad` (`2607:22009`) |

## 3. Named Glass, Material, Scroll Edge, Dock & Bar Components (`layout.json` Direct)

| Kit | Component | Variant (`ID`) | `GLASS` Params | `BLUR` Params | `overlayFills` / Tint Fills |
|---|---|---|---|---|---|
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass, Is Enabled=False, Des` (`10456:9821`) | `I10456:9822;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass, Is Enabled=True, Dest` (`10456:9824`) | `I10456:9825;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass Prominent, Is Enabled=` (`10456:9827`) | `I10456:9828;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass Prominent, Is Enabled=` (`10456:9830`) | `I10456:9831;10411:18443` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Tint` #FF383C@1 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass Prominent, Is Enabled=` (`10456:8891`) | `I10456:8892;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Symbol` | `Style=Glass Prominent, Is Enabled=` (`5522:11867`) | `I5583:24145;10411:18443` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Tint` #0088FF@1 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Small, Style=Glass, Is Enable` (`10456:14495`) | `I10456:14496;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Medium, Style=Glass, Is Enabl` (`10456:14447`) | `I10456:14448;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Large, Style=Glass, Is Enable` (`10456:9809`) | `I10456:9810;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Small, Style=Glass, Is Enable` (`10456:14498`) | `I10456:14499;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Medium, Style=Glass, Is Enabl` (`10456:14450`) | `I10456:14451;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Button-Liquid-Glass-Text` | `Size=Large, Style=Glass, Is Enable` (`10456:9812`) | `I10456:9813;10411:17583` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #000000@0.25 [NORMAL]; `Fill + Shadow` #FFFFFF@0.25 [NORMAL] |
| `ios27` | `Liquid-Glass-Clear` | `Liquid Glass - Clear` (`5914:23547`) | `10465:43090` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #101010@1 [LINEAR_DODGE]; `Fill + Shadow` #FFFFFF@0.04 [LUMINOSITY] |
| `ios27` | `Liquid-Glass-Regular-Large` | `Mode=Dark` (`5584:31860`) | `10411:18700` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #1A1A1A@0.7 [LUMINOSITY]; `Fill + Shadow` #1A1A1A@0.9 [LUMINOSITY] |
| `ios27` | `Liquid-Glass-Regular-Large` | `Mode=Light` (`5584:31859`) | `10411:18691` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #FFFFFF@0.7 [LIGHTEN]; `Fill + Shadow` #BFBFBF@0.1 [DARKEN] |
| `ios27` | `Scroll-Edge-Effect-Hard` | `Mode=Dark,Edge=Bottom` (`10509:2668`) | — | `10509:2668` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Dark,Edge=Bottom` #000000@0.55 [NORMAL] |
| `ios27` | `Scroll-Edge-Effect-Hard` | `Mode=Dark,Edge=Top` (`10509:2669`) | — | `10509:2669` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Dark,Edge=Top` #000000@0.55 [NORMAL] |
| `ios27` | `Scroll-Edge-Effect-Hard` | `Mode=Light, Edge=Bottom` (`5661:26984`) | — | `5661:26984` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Light, Edge=Bottom` #FFFFFF@0.85 [NORMAL] |
| `ios27` | `Scroll-Edge-Effect-Hard` | `Mode=Light, Edge=Top` (`5661:26986`) | — | `5661:26986` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Light, Edge=Top` #FFFFFF@0.85 [NORMAL] |
| `ios27` | `Scroll-Edge-Effect-Soft` | `Edge=Bottom` (`5661:26968`) | — | `5661:26968` `BACKGROUND_BLUR` r=10 (PROGRESSIVE); `5661:28857` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Blur` #000000@1 [SCREEN] |
| `ios27` | `Scroll-Edge-Effect-Soft` | `Edge=Top` (`5661:26964`) | — | `5661:26964` `BACKGROUND_BLUR` r=10 (PROGRESSIVE); `5661:28853` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Blur` #000000@1 [SCREEN] |
| `ios27` | `_Materials` | `Style=Chrome` (`510:79106`) | — | `510:79115` `BACKGROUND_BLUR` r=50 (UNIFORM) | `Chrome` #FFFFFF@0.75 [HARD_LIGHT] |
| `ios27` | `_Materials` | `Style=Thick` (`510:79108`) | — | `510:79116` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Thick` #FFFFFF@0.34 [LINEAR_DODGE]; `Thick` #FFFFFF@0.84 [COLOR_DODGE] |
| `ios27` | `_Materials` | `Style=Regular` (`510:79110`) | — | `510:79117` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Regular` #FFFFFF@0.25 [LINEAR_DODGE]; `Regular` #FFFFFF@0.6 [COLOR_DODGE] |
| `ios27` | `_Materials` | `Style=Thin` (`510:79112`) | — | `510:79118` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Thin` #FFFFFF@0.05 [NORMAL]; `Thin` #FFFFFF@0.4 [COLOR_DODGE] |
| `ios27` | `_Materials` | `Style=Ultrathin` (`510:79104`) | — | `510:79114` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Ultrathin` #FFFFFF@0.07 [NORMAL]; `Ultrathin` #FFFFFF@0.03 [COLOR_DODGE] |
| `ios27` | `_Materials-Mode-Options` | `Mode=IC - Dark, Style=Chrome` (`3095:22065`) | — | `3095:22065` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Mode=IC - Dark, Style=Chrome` #1C1C1C@0.9 [NORMAL]; `Mode=IC - Dark, Style=Chrome` #7C7C7C@1 [OVERLAY] |
| `ios27` | `_Materials-Mode-Options` | `Mode=IC - Dark, Style=Thick` (`3095:22066`) | — | `3095:22066` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Mode=IC - Dark, Style=Thick` #000000@0.6 [NORMAL] |
| `ios27` | `_Materials-Mode-Options` | `Mode=IC - Dark, Style=Regular` (`3095:22067`) | — | `3095:22067` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Mode=IC - Dark, Style=Regular` #000000@0.41 [NORMAL] |
| `ios27` | `_Materials-Mode-Options` | `Mode=IC - Dark, Style=Thin` (`3095:22068`) | — | `3095:22068` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Mode=IC - Dark, Style=Thin` #000000@0.26 [NORMAL] |
| `macos27` | `Liquid-Glass-Large` | `Mode=Dark` (`483:9238`) | `4311:12668` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #1A1A1A@0.7 [LUMINOSITY]; `Fill + Shadow` #1A1A1A@0.9 [LUMINOSITY] |
| `macos27` | `Liquid-Glass-Large` | `Mode=Light` (`483:9244`) | `4311:12663` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #FFFFFF@0.7 [LIGHTEN]; `Fill + Shadow` #BFBFBF@0.1 [DARKEN] |
| `macos27` | `Liquid-Glass-Medium` | `Mode=Dark` (`483:9251`) | `4311:12658` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #1A1A1A@0.7 [LUMINOSITY]; `Fill + Shadow` #1A1A1A@0.9 [LUMINOSITY] |
| `macos27` | `Liquid-Glass-Medium` | `Mode=Light` (`483:9257`) | `4311:12609` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #FFFFFF@0.7 [LIGHTEN]; `Fill + Shadow` #BFBFBF@0.1 [DARKEN] |
| `macos27` | `Liquid-Glass-Notification-Dark` | `Liquid Glass - Notification - Dark` (`4358:11539`) | `4358:11538` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #333333@0.3 [LUMINOSITY]; `Fill + Shadow` #333333@0.1 [NORMAL] |
| `macos27` | `Liquid-Glass-Notification-Light` | `Liquid Glass - Notification - Ligh` (`4358:11549`) | `4358:11548` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #BFBFBF@0.25 [LIGHTEN]; `Fill + Shadow` #1A1A1A@1 [LINEAR_DODGE] |
| `macos27` | `Scroll-Edge-Effect-Hard` | `Mode=Light, Edge=Bottom` (`4363:18595`) | — | `4363:18595` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Light, Edge=Bottom` #FFFFFF@0.85 [NORMAL] |
| `macos27` | `Scroll-Edge-Effect-Hard` | `Mode=Light, Edge=Top` (`4363:18596`) | — | `4363:18596` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Light, Edge=Top` #FFFFFF@0.85 [NORMAL] |
| `macos27` | `Scroll-Edge-Effect-Hard` | `Edge=Bottom,Mode=Dark` (`4363:18597`) | — | `4363:18597` `BACKGROUND_BLUR` r=6 (NORMAL) | `Edge=Bottom,Mode=Dark` #1F1F1F@0.55 [NORMAL] |
| `macos27` | `Scroll-Edge-Effect-Hard` | `Mode=Dark,Edge=Top` (`4363:18598`) | — | `4363:18598` `BACKGROUND_BLUR` r=6 (NORMAL) | `Mode=Dark,Edge=Top` #1F1F1F@0.55 [NORMAL] |
| `macos27` | `Scroll-Edge-Effect-Soft` | `Edge=Bottom` (`4363:18555`) | — | `4363:18555` `BACKGROUND_BLUR` r=10 (PROGRESSIVE); `4363:18557` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Blur` #000000@1 [SCREEN] |
| `macos27` | `Scroll-Edge-Effect-Soft` | `Edge=Top` (`4363:18558`) | — | `4363:18558` `BACKGROUND_BLUR` r=10 (PROGRESSIVE); `4363:18560` `BACKGROUND_BLUR` r=100 (UNIFORM) | `Blur` #000000@1 [SCREEN] |
| `macos27` | `Materials` | `Mode=Light, Type=Ultra Thick` (`4331:12156`) | — | `4331:12156` `BACKGROUND_BLUR` r=60 (NORMAL) | `Mode=Light, Type=Ultra Thick` #333333@1 [LINEAR_DODGE]; `Mode=Light, Type=Ultra Thick` #ECECEC@0.88 [NORMAL] |
| `macos27` | `Materials` | `Mode=Light, Type=Thick` (`4331:12155`) | — | `4331:12155` `BACKGROUND_BLUR` r=60 (UNIFORM) | `Mode=Light, Type=Thick` #F6F6F6@0.72 [NORMAL] |
| `macos27` | `Materials` | `Mode=Light, Type=Medium` (`4331:12154`) | — | `4331:12154` `BACKGROUND_BLUR` r=60 (UNIFORM) | `Mode=Light, Type=Medium` #F6F6F6@0.6 [NORMAL] |
| `macos27` | `Materials` | `Mode=Light, Type=Thin` (`4331:12153`) | — | `4331:12153` `BACKGROUND_BLUR` r=60 (UNIFORM) | `Mode=Light, Type=Thin` #F6F6F6@0.48 [NORMAL] |
| `macos27` | `Materials` | `Mode=Light, Type=Ultra Thin` (`4331:12152`) | — | `4331:12152` `BACKGROUND_BLUR` r=60 (UNIFORM) | `Mode=Light, Type=Ultra Thin` #F6F6F6@0.36 [NORMAL] |
| `macos27` | `Materials` | `Mode=Dark, Type=Ultra Thick` (`4331:12151`) | — | `4331:12151` `BACKGROUND_BLUR` r=60 (UNIFORM) | `Mode=Dark, Type=Ultra Thick` #000000@0.5 [NORMAL] |
| `macos27` | `Dock` | `Mode=Dark` (`4355:8234`) | `4355:11466` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #454545@0.5 [LUMINOSITY]; `Fill + Shadow` #1A1A1A@0.1 [LINEAR_BURN] |
| `macos27` | `Dock` | `Mode=Light` (`4355:8232`) | `4355:11429` `Glass Effect`: r=None, refr=None, depth=None, disp=None, light=None@Nonedeg | — | `Fill + Shadow` #4D4D4D@0.3 [LUMINOSITY]; `Fill + Shadow` #1A1A1A@0.1 [LINEAR_BURN] |

## 4. Variables: iOS `Kit` Liquid Glass Floats, `Liquid Glass (Bright/Dim)` & macOS `Context`

- **iOS `Kit` collection (`VariableCollectionId:5565:22724`) — Official Figma Liquid Glass FLOAT parameters:**
  - `Liquid Glass/Frost - Regular` = **`6`**, `Frost - Medium` = **`16`**, `Frost - Large` = **`16`**
  - `Liquid Glass/Refraction` = **`70`** (`0.70`), `Depth - Regular` = **`30`**, `Depth - Medium and Large` = **`30`**
  - `Liquid Glass/Dispersion` = **`20`** (`0.20`), `Splay - Regular` = **`20`**, `Splay - Medium and Large` = **`20`**
  - `Liquid Glass/Light Angle` = **`0`**, `Liquid Glass/Opacity` = **`25`** (`lightIntensity = 0.25`)
- **iOS `Liquid Glass` collection (`VariableCollectionId:5473:22573`, modes `['Bright', 'Dim']`):** **`vars = 0`** (empty mode-switch placeholder collection in Apple's kit; changes zero color/blur variables directly).
- **macOS `Context` collection (`VariableCollectionId:478:857`, modes `['Content Area', 'Over-glass']`):** Contains **`1` `STRING` variable** (`Mode: 'Content Area' | 'Over-glass'`) used to switch component variant properties (e.g., Over-glass control fills vs Content Area fills), NOT direct color/blur math.

## 5. Official Definition of `GLASS.radius` & Blur-Scale Calibration (`Figma radius` vs CSS `blur()`)

1. **Figma `GlassEffect.radius` (Verified from Figma Plugin/REST API Developer Documentation):**
   - `type: 'GLASS'` defines `radius: number` as the **frost (blur/softening) radius** applied on the glass surface (alongside `lightIntensity` `0..1`, `lightAngle` degrees, `refraction` `0..1`, `depth` `>=1`, `dispersion` `0..1`).
2. **Figma `BACKGROUND_BLUR` / `LAYER_BLUR` `radius` vs CSS `backdrop-filter: blur()` (`radius / 2` Rule):**
   - Per W3C CSS Filter Effects & Figma Dev Mode specification, CSS `blur(Xpx)` takes Gaussian standard deviation **σ = X**, whereas Figma's `radius` equals **2σ** (Figma Dev Mode divides `radius / 2` when outputting CSS).
3. **Headless Chromium Measurement (`_local/forgekit/scripts/a8a2_blur_calibrate.py`):**
   Rendered a crisp `0→255` step edge under CSS `backdrop-filter: blur()` and measured the 10%→90% luminance transition width (`2.563 × σ`):
   ```text
   CSS blur(10px) [Figma r=20 / 2]        | x10=188, x90=212, transition_10_90= 24px | derived_sigma=9.36px
   CSS blur(20px) [Figma r=20 direct]     | x10=175, x90=225, transition_10_90= 50px | derived_sigma=19.51px
   CSS blur(30px) [Figma r=60 / 2]        | x10=164, x90=235, transition_10_90= 71px | derived_sigma=27.7px
   CSS blur(60px) [Figma r=60 direct]     | x10=143, x90=257, transition_10_90=114px | derived_sigma=44.48px
   ```
   - **Calibration status:** **`calibration: derived (Figma Dev Mode radius/2 + Chromium step-edge check; visual parity with Figma/Apple OS unverified)`**. Directly copying Figma `radius` into CSS produces **~2× wider blur spread** (`50px` vs `24px` at `r=20`).
   - **Comparison with `tokens/materials.json`:** Our current CSS estimates (`small: 8px, medium: 12px, large: 20px`) are actually **heavier** than `Frost / 2` (`Regular 6/2 = 3px`, `Medium/Large 16/2 = 8px`) because Apple's Liquid Glass relies on optical refraction (`0.7`) + high depth (`30`) rather than heavy frosted blur, whereas standard `BACKGROUND_BLUR` materials (`r=50..60` -> `25..30px` at `r/2`) align closely with our `standardMaterials.blurPx` (`20..30px`)!

## 6. Calibrated Translation Proposal (No Token Edits Applied)

| Figma Parameter | Kit Measured Value | Web (CSS / SVG) | Flutter | Tauri 2 (macOS Direct) | Status |
|---|---|---|---|---|---|
| `GLASS.radius` (Frost) | Regular `6`, Medium/Large `16` | `backdrop-filter: blur(radius/2)` (`3px`/`8px` calibrated, or `8–20px` tuned for legibility without refraction) | `ImageFilter.blur(sigmaX: radius/2, sigmaY: radius/2)` in `BackdropGroup` | Native `NSGlassEffectView` | **approximation** (`calibration: derived`) |
| `BACKGROUND_BLUR.radius` | Standard materials `20–60` | `backdrop-filter: blur(radius/2)` (`10–30px`) + `saturate(1.8)` | `ImageFilter.blur(sigma: radius/2)` | Native `apply_vibrancy` | **approximation** (`calibration: derived`) |
| `overlayFills` (Tint + Blend) | `#FFFFFF@0.7`, `#1A1A1A@0.5`, etc. | `background: color-mix(...)` (plain alpha tuned; avoids muddy `plus-lighter`/`linear-dodge` drop) | `Container` alpha tint | Native material tint | **approximation** |
| `lightIntensity` / `lightAngle` | `0.25` @ `0°` | Static directional specular rim `box-shadow` / hairline border | Static `Border` / `CustomPainter` rim | Native `NSGlassEffectView` | **approximation** (static, no live angle) |
| `refraction` & `depth` | `0.70`, depth `30` | Chromium-only SVG `<feDisplacementMap>` approximation; **impossible** in portable CSS/Safari/Firefox | **Impossible** in standard `BackdropFilter` (requires custom Impeller fragment shader) | Native `NSGlassEffectView` | **impossible** in portable CSS/Flutter |
| `dispersion` (chromatic) | `0.20` | **Impossible** in CSS `backdrop-filter` | **Impossible** in standard `BackdropFilter` | Native `NSGlassEffectView` | **impossible** in CSS/Flutter |
