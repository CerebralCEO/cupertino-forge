# Figma MCP পরিকল্পনা ও টুল বিশ্লেষণ (কোনো Figma টুল কল ছাড়াই)

> **নিয়ম পালন:** এই ধাপে **একটিও Figma MCP টুল কল করা হয়নি** (শূন্য কল)। সব তথ্য স্থানীয় MCP স্কিমা ফাইল (`C:\Users\Asus\.gemini\antigravity\mcp\figma_figma\*.json`), Antigravity-র `list_plugin_accounts`, এবং Figma-র অফিশিয়াল ডকুমেন্টেশন (`developers.figma.com` / `help.figma.com`) থেকে সংগ্রহ করা হয়েছে।

---

## ১. Figma MCP-র সব টুলের তালিকা (মোট ৫২টি টুল)

### ১.১ আমাদের কাজের জন্য প্রাসঙ্গিক Read / Inspect টুলসমূহ

| টুল নাম | কী করে | Frame মাপ (`w×h`)? | Corner Radius? | Padding / Auto-Layout? | Variables? | Screenshot? |
|---|---|---|---|---|---|---|
| `get_metadata` | ডকুমেন্টের পেজ তালিকা (`nodeId` বাদে) অথবা একটি পেজ/নোডের XML স্ট্রাকচার দেয় | **হ্যাঁ** (`x, y, width, height`) | না | না | না | না |
| `get_design_context` | একটি নোড/সেকশনের design-to-code রেফারেন্স কোড, মেটাডেটা ও স্ক্রিনশট দেয় (`excludeScreenshot: true` অপশন আছে) | **হ্যাঁ** (কোড/মেটাডেটায়) | **হ্যাঁ** (কোডে) | **হ্যাঁ** (auto-layout/padding কোডে) | আংশিক (রেফারেন্সকৃত ভ্যারিয়েবল) | **হ্যাঁ** (ডিফল্ট; বন্ধ করা যায়) |
| `get_variable_defs` | নির্দিষ্ট `nodeId`-এর সাথে যুক্ত Variable সংজ্ঞা (রঙ, সাইজ, স্পেসিং) দেয় | না (শুধু ভ্যারিয়েবল মান) | শুধু ভ্যারিয়েবল থাকলে | শুধু ভ্যারিয়েবল থাকলে | **হ্যাঁ** | না |
| `get_screenshot` | নির্দিষ্ট `nodeId`-এর PNG রেন্ডার URL + `width/height` ও `original_width/original_height` দেয় | **হ্যাঁ** (শুধু ওই নোডের natural canvas size) | না | না | না | **হ্যাঁ** |
| `use_figma` | Figma Plugin API (`figma` গ্লোবাল) দিয়ে JS কোড চালায় — প্রোগ্রাম্যাটিকভাবে নোড প্রোপার্টি পড়া বা লেখা যায় (*ফাইলে edit access প্রয়োজন*) | **হ্যাঁ** (`node.width`, `node.height`) | **হ্যাঁ** (`cornerRadius`, `cornerSmoothing`) | **হ্যাঁ** (`paddingTop/Right/Bottom/Left`, `itemSpacing`, `layoutMode`) | **হ্যাঁ** (`figma.variables`) | না |
| `get_motion_context` | কী-ফ্রেম অ্যানিমেশন, easing কার্ভ ও টাইমিং ডেটা দেয় | না | না | না | না | না |
| `search_design_system` | ডিজাইন সিস্টেমের component, variable, style এক ব্যাচে খোঁজে | না | না | না | **হ্যাঁ** (তালিকা/কী) | না |
| `get_libraries` | ফাইলের সাথে যুক্ত ডিজাইন লাইব্রেরি তালিকা দেয় | না | না | না | না | না |
| `get_context_for_code_connect` | কম্পোনেন্টের প্রোপার্টি, ভ্যারিয়েন্ট ও ডিসেন্ড্যান্ট ট্রি দেয় | না | না | না | না | না |
| `download_assets` | একক নোডের export render, raw source image ও SVG দেয় | না | না | না | না | **হ্যাঁ** (export) |
| `get_comments` | ফাইলের কমেন্ট পড়ে | না | না | না | না | না |
| `get_figjam` | FigJam নোড থেকে UI কোড জেনারেট করে | আংশিক | না | না | না | না |
| `whoami` | কানেক্টেড ইউজারের handle, email, plan ও seat জানায় (*read rate limit-এর বাইরে*) | না | না | না | না | না |

### ১.২ অন্যান্য Write / Code Connect / Shader / Plugin / Weave টুলসমূহ (মোট ৩৯টি — আমাদের জ্যামিতি অডিটে প্রয়োজন নেই)

- **সেশন ও ফাইল ব্যবস্থাপনা (৪টি):** `create_session`, `create_new_file`, `create_branch`, `upload_assets`
- **ডিজাইন/কোড/মিডিয়া জেনারেশন (৭টি):** `generate_figma_design`, `generate_diagram`, `generate_image`, `generate_vector_illustration`, `html_to_figma`, `send_code_to_figma`, `export_video`
- **Code Connect (৪টি):** `get_code_connect_map`, `add_code_connect_map`, `get_code_connect_suggestions`, `send_code_connect_mappings`
- **Shader ও Generative Plugin (১০টি):** `list_shaders`, `list_file_shaders`, `get_shader`, `create_shader`, `update_shader`, `list_generative_plugins`, `get_generative_plugin`, `create_generative_plugin`, `update_generative_plugin` *(নোট: সব মিলিয়ে ৯টি)*
- **Weave ওয়ার্কফ্লো ও মডেল টুল (১৫টি):** `weave_list_tools`, `weave_get_tool_inputs`, `weave_run_tool`, `weave_get_tool_run_output`, `weave_cancel_tool_run`, `weave_find_model`, `weave_run_model`, `weave_get_model_run_output`, `weave_build_workflow`, `weave_get_workflow`, `weave_search_workspace`, `weave_get_node_catalog`, `weave_upload_asset`, `weave_request_report` *(নোট: ১৪টি)*

*(মোট: ১৩টি Read/Inspect + ৩৯টি Write/Code Connect/Shader/Weave = **৫২টি টুল**।)*

---

## ২. Figma MCP Rate Limit (অফিশিয়াল ডকুমেন্টেশন অনুযায়ী)

উৎস: Figma Developer Docs (`developers.figma.com` / `help.figma.com`)।

| প্ল্যান ও সিট (Plan & Seat) | MCP Read টুল কল সীমা | প্রতি-মিনিট সীমা |
|---|---|---|
| **Starter (ফ্রি)** — যেকোনো সিট / Starter ফাইল | **সর্বোচ্চ ২০ কল / মাস** | — |
| **Professional / Organization / Enterprise** — View বা Collab সিট | **সর্বোচ্চ ২০ কল / মাস** | — |
| **Professional / Education** — Full বা Dev সিট | **সর্বোচ্চ ২০০ কল / দিন** | ১০ কল / মিনিট |
| **Organization** — Full বা Dev সিট | **সর্বোচ্চ ২০০ কল / দিন** | ১৫ কল / মিনিট |
| **Enterprise** — Full বা Dev সিট | **সর্বোচ্চ ৬০০ কল / দিন** | ২০ কল / মিনিট |

### গুরুত্বপূর্ণ নিয়ম ও REST API-র সাথে পার্থক্য
1. **প্রতি কল কীভাবে গোনা হয়:** MCP রেট লিমিট মূলত **Read টুল কল** (যেমন `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`) গোনে। Write / ইউটিলিটি টুল (`whoami`, `create_new_file`, `add_code_connect_map`, ইত্যাদি) read সীমায় গোনা হয় না। AI ছবি/ভেক্টর জেনারেশন (`generate_image`, `generate_vector_illustration`) আলাদা AI ক্রেডিটে গোনা হয়।
2. **ফাইলের প্ল্যান গুরুত্বপূর্ণ:** ইউজারের নিজস্ব Paid Dev/Full সিট থাকলেও **টার্গেট ফাইলটি যদি Starter (ফ্রি) টিম বা ব্যক্তিগত Drafts-এ থাকে**, তাহলে Figma Starter-স্তরের সীমা (**২০ কল / মাস**) আরোপ করে।
3. **REST API-র সাথে পার্থক্য:** REST API এন্ডপয়েন্ট-টিয়ার (Tier 1: `GET /v1/files`, `GET /v1/images` বনাম Tier 2: comments/variables/projects) অনুযায়ী প্রতি-মিনিট বা Starter-এ ২০/মাস লিমিট দেয়; MCP সার্ভার আলাদাভাবে **প্রতিদিন (২০০/৬০০) + প্রতি-মিনিট (১০/১৫/২০)** অথবা **Starter/View/Collab-এ ২০/মাস** হিসাব করে। `use_figma`-এর নির্দিষ্ট কল-কাউন্ট কোটা অফিসিয়াল সারণিতে আলাদাভাবে উল্লেখ নেই — **অজানা** (তাই সীমিত ধরেই পরিকল্পনা করা হয়েছে)।

---

## ৩. কানেক্টেড Figma অ্যাকাউন্ট (কোনো Figma টুল কল ছাড়াই)

- Antigravity-র `list_plugin_accounts` (Plugins Manager Accounts) যাচাই ফলাফল: **`No installed plugins declare account sign-ins.`**
- অর্থাৎ Plugins Manager-এর Accounts পাতা থেকে কানেক্টেড Figma অ্যাকাউন্টের ইমেইল, হ্যান্ডেল, প্ল্যান বা সিট জানা **যায়নি (`অজানা`)**। এটি জানতে হলে অনুমোদনের পর `whoami` (যা read rate limit খরচ করে না) কল করতে হবে।

---

## ৪. ন্যূনতম-কল জ্যামিতি এক্সট্র্যাকশন পরিকল্পনা (৭৭টি `not-in-kit` Estimate-এর জন্য)

**টার্গেট ফাইলসমূহ:**
- **iOS 27 UI Kit:** `9XLHKxkIO24Er34C0DoMcR`
- **macOS 27 UI Kit:** `5YNrD6VW0v0Meye5F2JIz0`

**লক্ষ্য জ্যামিতি:** `button`, `toggle`, `slider`, `segmentedControl`, `stepper`, `pageControl`, `textField`, `tabBar`, `navBar`, `toolbar`, `searchField`, `listRow`, `listSection`, `alert`, `sheet`, `popover`, `sidebar`, `window`, `trafficLights`, `menu` — প্রতিটির frame `width/height`, `cornerRadius` (ও `cornerSmoothing`), এবং `padding`/`gap`।

### ধাপ ০: প্ল্যান/অ্যাক্সেস যাচাই (০টি Read কল)
- **`whoami`** (১ কল, read কোটায় গোনা হয় না): অ্যাকাউন্টের প্ল্যান ও সিট (`20/month` বনাম `200/day`) নিশ্চিত করা।

### পথ ক (সর্বোত্তম — যদি ফাইল দুটোতে Edit Access থাকে, যেমন ইউজারের নিজস্ব ডুপ্লিকেট/ড্রাফট): মোট **২টি কল**
`use_figma` (read-only JavaScript স্ক্রিপ্ট, কোনো মিউটেশন নয়) দিয়ে প্রতি ফাইলে **মাত্র ১টি কল** (`await figma.setCurrentPageAsync(page)` লুপ করে, কখনোই `loadAllPagesAsync` নয়):
1. **কল ১ (`use_figma`, `fileKey: "9XLHKxkIO24Er34C0DoMcR"`):** iOS 27-এর সব প্রাসঙ্গিক পেজ ঘুরে target component set / frame গুলোর `{ name, width, height, cornerRadius, cornerSmoothing, paddingTop/Right/Bottom/Left, itemSpacing, effects(blur) }` এক JSON-এ রিটার্ন।
2. **কল ২ (`use_figma`, `fileKey: "5YNrD6VW0v0Meye5F2JIz0"`):** macOS 27-এর সব প্রাসঙ্গিক পেজ ঘুরে `window`, `sidebar`, `toolbar`, `trafficLights`, `controlSizes`, `menu`, `popover`, `alert`, `sheet`-এর পূর্ণ জ্যামিতি এক JSON-এ রিটার্ন।

> *দ্রষ্টব্য:* ফাইল দুটো যদি কেবল View-only হয়, `use_figma` চলবে না — তখন সাথে সাথে নিচের **পথ খ**-তে চলে যাব।

### পথ খ (View-Only / Pure Read-Only ফলব্যাক — Starter ২০ কল/মাস সীমার ভেতরেই): মোট **১১–১৩টি Read কল**

প্রতিটি কল একটা গোটা পাতা বা সেকশনের সব কম্পোনেন্ট একসঙ্গে আনার মতো সাজানো:

| ধাপ | কল # | টুল | ফাইল কী | টার্গেট (`nodeId`) | কী পাওয়া যাবে |
|---|---|---|---|---|---|
| **পেজ তালিকা** | ১ | `get_metadata` | `9XLHKxkIO24Er34C0DoMcR` (iOS 27) | *(বাদ)* | iOS 27 কিটের সব টপ-লেভেল পেজের `guid + name` |
| **পেজ তালিকা** | ২ | `get_metadata` | `5YNrD6VW0v0Meye5F2JIz0` (macOS 27) | *(বাদ)* | macOS 27 কিটের সব টপ-লেভেল পেজের `guid + name` |
| **পেজ XML ওভারভিউ** | ৩–৪ | `get_metadata` | `9XLHKxkIO24Er34C0DoMcR` | iOS Controls + Bars/Presentations পেজ ID | ওই পাতাগুলোর সব কম্পোনেন্টের `x, y, width, height` + সেকশন `nodeId` |
| **পেজ XML ওভারভিউ** | ৫–৬ | `get_metadata` | `5YNrD6VW0v0Meye5F2JIz0` | macOS Windows/Bars + Controls/Menus পেজ ID | macOS-এর সব কম্পোনেন্টের `x, y, width, height` + সেকশন `nodeId` |
| **ব্যাচড সেকশন জ্যামিতি (iOS)** | ৭ | `get_design_context` (`excludeScreenshot: true`) | `9XLHKxkIO24Er34C0DoMcR` | Controls সেকশন ফ্রেম | `button` (mini..xl), `toggle`, `slider`, `segmented`, `stepper`, `textField`, `pageControl`-এর radius ও padding |
| **ব্যাচড সেকশন জ্যামিতি (iOS)** | ৮ | `get_design_context` (`excludeScreenshot: true`) | `9XLHKxkIO24Er34C0DoMcR` | Navigation & Bars সেকশন ফ্রেম | `tabBar`, `navBar`, `toolbar`, `searchField`-এর height, radius, padding |
| **ব্যাচড সেকশন জ্যামিতি (iOS)** | ৯ | `get_design_context` (`excludeScreenshot: true`) | `9XLHKxkIO24Er34C0DoMcR` | Lists & Presentations সেকশন ফ্রেম | `listRow`, `listSection`, `card`, `sheet`, `alert`, `popover`-এর radius, inset, padding |
| **ব্যাচড সেকশন জ্যামিতি (macOS)** | ১০ | `get_design_context` (`excludeScreenshot: true`) | `5YNrD6VW0v0Meye5F2JIz0` | Windows & Chrome সেকশন ফ্রেম | `window` radius, `titlebar`, `toolbar`, `trafficLights`, `sidebar` width/rowHeight |
| **ব্যাচড সেকশন জ্যামিতি (macOS)** | ১১ | `get_design_context` (`excludeScreenshot: true`) | `5YNrD6VW0v0Meye5F2JIz0` | Controls সেকশন ফ্রেম | `controlSizes` (mini/small/regular/large), `button`, `checkbox`, `radio`, `textField` radius/padding |
| **ব্যাচড সেকশন জ্যামিতি (macOS)** | ১২ | `get_design_context` (`excludeScreenshot: true`) | `5YNrD6VW0v0Meye5F2JIz0` | Menus & Overlays সেকশন ফ্রেম | `menu` itemHeight/padding/radius, `popover`, `alert`, `sheet` |

- **সর্বমোট কল (পথ খ):** **`১২টি Read কল`** (Starter `20/month` সীমার মধ্যে আরও **৮ কল বাফার** থাকবে যদি কোনো বড় পেজ ভাগ করতে হয়)।
- **নোট:** যেসব `not-in-kit` এস্টিমেট Figma ফাইলেও নেই (যেমন `motion.json` স্প্রিং ফিজিক্স, `feedback.json` হ্যাপ্টিকস/সাউন্ড, Web `perfBudget`), সেগুলোর জন্য কোনো Figma কল নষ্ট করা হবে না — সেগুলো সরাসরি `not-in-figma` হিসেবে চিহ্নিত থাকবে।
