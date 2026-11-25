# Restored Foundation Rules ও `tokens/motion.json` সংযোজন তালিকা

`git diff main..HEAD` যাচাই করে Phase 1-এর সময় Foundation রেফারেন্স (`00-principles.md` থেকে `15-version-diff.md`) থেকে যে আচরণগত নিয়ম ও প্রোপার্টি বাদ পড়েছিল বা সংক্ষিপ্ত হয়েছিল, সেগুলো নতুন `[official]`/`[measured]`/`[inferred]`/`[estimate]` প্রমাণ ট্যাগ অক্ষুণ্ণ রেখে পুনঃস্থাপন করা হয়েছে। পাশাপাশি `tokens/motion.json`-এর ৩০টি নতুন পাথ নথিভুক্ত করা হলো।

---

## ১. `git diff main..HEAD` ফাউন্ডেশন যাচাই সারসংক্ষেপ (`00`–`15`)

| ফাইল | অবস্থা | বিবরণ |
|---|---|---|
| `00-principles.md`, `02-color.md`, `03-typography.md`, `04-materials.md`, `05-shape-corner.md`, `06-elevation.md`, `07-icons-glyphs.md`, `09-feedback-haptics-sound.md`, `10-accessibility.md`, `11-platforms.md`, `12-navigation.md`, `13-presentation.md`, `14-content-patterns.md` | ০টি বাদ পড়া নিয়ম | কোনো পূর্ববর্তী আচরণগত নিয়ম বাদ পড়েনি; কেবল প্রমাণ-ট্যাগ ও নতুন রেফারেন্স যোগ হয়েছে। |
| `08-motion.md` | ৭টি নিয়ম পুনঃস্থাপিত | Menu/popover, Tab switch, Tab bar minimize, আলাদা Toggle ও Segmented সারি, Drag and drop-এ shadow, Gestures-এর ২টি মূল নিয়ম, ও Reduced motion-এ "keep state feedback" ফেরানো হয়েছে। |
| `01-layout.md` | ১টি নিয়ম পুনঃস্থাপিত | Tab bar সারিতে `"sits above home indicator"` ফেরানো হয়েছে; Official Hit target (`44 recommended, 28 absolute minimum [official]`) অপরিবর্তিত রাখা হয়েছে। |
| `15-version-diff.md` | ৭টি বিবরণ পুনঃস্থাপিত | App icon `"layered foreground on glass, no text"`, edge-to-edge sidebar নির্দেশনা, Window active/inactive স্টেইট পার্থক্য, iOS 26→27 carried-over সারাংশ, Better readability, macOS uniform toolbars ও macOS Sequoia/older অ্যান্টি-প্যাটার্ন বিস্তারিত ফেরানো হয়েছে। |

---

## ২. পুনঃস্থাপিত নিয়মগুলোর বিস্তারিত তালিকা

### ২.১ `skills/apple-design-core/references/foundations/08-motion.md`

| # | অংশ | পুনঃস্থাপিত নিয়ম (নতুন ট্যাগ অক্ষুণ্ণ রেখে) |
|---|---|---|
| ১ | `Menu / popover` | `morphs out of glass button: scale 0.6 to 1 with opacity, anchored at source, spring popover; close scale 0.8 and fade 180ms [estimate]` |
| ২ | `Tab switch` | `content crossfade 150ms (no slide) [estimate]; selection capsule slides with snappy` |
| ৩ | `Tab bar minimize` | `shrinks on scroll down, restores on scroll up (.tabBarMinimizeBehavior(.onScrollDown) [official]), spring glassMorph [estimate]` |
| ৪ | `Toggle` ও `Segmented` | একত্রিত সারি ভেঙে আলাদা `Toggle` (`knob snaps with snappy, stretches 1.25 [estimate] while pressed`) ও `Segmented` (`indicator slides with snappy, stretches while dragging [estimate]`) সারি ফেরানো হয়েছে |
| ৫ | `Drag and drop` | `lift 1.03–1.05 with shadow, follow interactive, drop snappy + rigid haptic [estimate]` |
| ৬ | `Gestures` | `Never snap without velocity.` এবং `Every animation can be interrupted mid flight by a new gesture.` — দুটো নিয়মই ফেরানো হয়েছে |
| ৭ | `Reduced motion` | `keep state feedback` অংশটি পুনঃস্থাপন করা হয়েছে |

### ২.২ `skills/apple-design-core/references/foundations/01-layout.md`

| # | অংশ | পুনঃস্থাপিত নিয়ম |
|---|---|---|
| ১ | `Tab bar` | `floating glass capsule, sits above home indicator, about 62 tall [estimate], 20 from sides [estimate], max 5 tabs on iPhone [official]; .tabBarMinimizeBehavior(.onScrollDown) + Tab(role: .search) [official]` |

### ২.৩ `skills/apple-design-core/references/foundations/15-version-diff.md`

| # | অংশ | পুনঃস্থাপিত বিবরণ |
|---|---|---|
| ১ | Tier A #2 (`App icons`) | `layered foreground on glass, no text` ফেরানো হয়েছে |
| ২ | Tier A #4 (`Sidebar`) | `Edge-to-edge sidebars extend to the window edge with a vibrant material — do not inset or float the sidebar.` ফেরানো হয়েছে |
| ৩ | Tier A #5 (`Window active state`) | `windowActive` বনাম `windowInactive` ও `sidebar` বনাম `sidebar-inactive` `[measured]` টোকেন-সহ উইন্ডো অ্যাক্টিভ স্টেইট নিয়ম ফেরানো হয়েছে |
| ৪ | Tier A #9 (`iOS 26 to 27 carried over`) | iOS 26→27 বহমান বৈশিষ্ট্যগুলোর পূর্ণ তালিকা ফেরানো হয়েছে |
| ৫ | Tier B #2 (`Better readability`) | তুলনামূলক বেশি প্রতিসরণ ও টিউনড রেসিপি বিবরণ `[inferred]`/`[estimate]` ট্যাগে ফেরানো হয়েছে |
| ৬ | Tier B #3 (`macOS uniform toolbars`) | টুলবার আইটেমগুলোর পেছনে সুসংগত বার-সংক্রান্ত নিয়ম `[inferred]` ট্যাগে ফেরানো হয়েছে |
| ৭ | `Things that are old` | `macOS Sequoia and older style: opaque gray toolbars without glass, monochrome sidebar only, flat menus.` আলাদা পয়েন্ট হিসেবে ফেরানো হয়েছে |

---

## ৩. `tokens/motion.json`-এর ৩০টি নতুন পাথের সম্পূর্ণ তালিকা

(`_upgrade/scratch/token_equiv_result.json` অনুযায়ী কোনো পুরনো পাথ বদলায়নি বা মোছেনি; মোট ৩০টি পাথ যোগ হয়েছে)

| # | JSON Path | মান (`value`) | শ্রেণি / উদ্দেশ্য |
|---|---|---|---|
| ১ | `$meta.reconciledDate` | `"2026-11-25"` | মেটাডাটা তারিখ |
| ২ | `transitions.alertDismiss.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ৩ | `transitions.alertDismiss.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ৪ | `transitions.alertPresent.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ৫ | `transitions.alertPresent.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ৬ | `transitions.contextMenu.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ৭ | `transitions.contextMenu.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ৮ | `transitions.fade.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ৯ | `transitions.fade.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১০ | `transitions.listRowHighlight.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ১১ | `transitions.listRowHighlight.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১২ | `transitions.menuClose.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ১৩ | `transitions.menuClose.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১৪ | `transitions.menuOpen.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ১৫ | `transitions.menuOpen.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১৬ | `transitions.navigationPush.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১৭ | `transitions.segmentedSelection.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ১৮ | `transitions.segmentedSelection.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ১৯ | `transitions.sheetDismiss.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ২০ | `transitions.sheetDismiss.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ২১ | `transitions.sheetPresent.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ২২ | `transitions.sheetPresent.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ২৩ | `transitions.tabBarMinimize.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ২৪ | `transitions.tabBarMinimize.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ২৫ | `transitions.tabSwitch.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ২৬ | `transitions.tabSwitch.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ২৭ | `transitions.toast.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ২৮ | `transitions.toast.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
| ২৯ | `transitions.toggle.interruptible` | `true` | ট্রানজিশন ইন্টারাপ্টিবিলিটি |
| ৩০ | `transitions.toggle.reducedMotion` | `{ strategy: "crossfade", durationMs: 200, bounce: 0, $class: "inferred" }` | Reduce Motion বিকল্প |
