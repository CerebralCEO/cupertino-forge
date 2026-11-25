# Web primitives: props and usage

All primitives are client components in `src/components/apple`. Verified with React 19, Tailwind v4, motion 12, Radix 1.x (typecheck and Chrome render tested in the plugin's harness).

## Root

```tsx
// app/layout.tsx
import { CupertinoRoot } from '@/components/apple/root';
import { CupertinoThemeScript } from '@/lib/cupertino/theme-script';
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <CupertinoThemeScript />
      </head>
      <body><CupertinoRoot style="adaptive" appearance="system" transparency="system" contrast="system" glassIntensity={0.5} sounds={false}>{children}</CupertinoRoot></body>
    </html>
  );
}
```
Use values from `.apple-design.json`. `useCupertino()` returns `{ platform, theme, reducedMotion, squircleNative, resolvedTransparency, resolvedContrast, setAppearance, setTransparency, setContrast }`. Provide an explicit in-app Reduce Transparency setting via `setTransparency('reduce')` because Safari lacks `prefers-reduced-transparency`.

## Glass

`<Glass variant="regular|clear|large|menu|tinted" shape="capsule|circle|rect" radiusToken="popover" pressable lens dim>`. Functional layer only. `GlassGroup` wraps several controls in one capsule. `ScrollEdge edges={['top','bottom']}` adds the soft fade under bars (NavBar, Toolbar already include it).

## Squircle

`<Squircle radius="card" className="bg-bg-2 p-lg">` for every content rounded rect (cards, images, sections). Radius is a token name or number.

## Buttons

```tsx
<Button variant="filled" size="large" fullWidth>Continue</Button>          // primary in content
<Button variant="prominentGlass">Done</Button>                              // primary on bars
<Button variant="tinted">Add to Library</Button>
<Button variant="gray">Edit</Button>
<Button variant="plain">Learn More</Button>
<Button variant="destructive">Delete</Button>
<Button loading loadingLabel="Saving...">Save</Button>
<IconButton label="Close" icon={<X size={20} strokeWidth={2.25} />} />    // 44 glass circle
<IconButton label="Done" variant="prominentGlass" icon={<Check size={20} strokeWidth={2.5} />} />
```

## Navigation (iOS)

```tsx
<NavBar title="Library" large back={{ label: 'Home', onBack }} trailing={
  <BarButtonGroup label="Actions"><BarButton label="Add" icon={<Plus size={20}/>} /><BarButton label="More" icon={<Ellipsis size={20}/>} /></BarButtonGroup>
} />
<TabBar items={[{ id:'home', label:'Home', icon:<House size={24}/> }]} selected={tab} onSelect={setTab} search={{ label:'Search', icon:<Search size={22}/>, onPress }} />
<Toolbar leading={<IconButton .../>} trailing={<ToolbarGroup label="Edit">...</ToolbarGroup>} />
```
Page content needs bottom padding for the tab bar: `pb-[calc(var(--cf-tabbar-height)+env(safe-area-inset-bottom)+24px)]`.

## Lists

```tsx
<List style="insetGrouped">
  <ListSection header="Connectivity" footer="Explain consequences here.">
    <ListRow leading={<SettingsIcon color="blue"><Wifi size={17} strokeWidth={2.5}/></SettingsIcon>} title="Wi-Fi"
      accessory={<Toggle label="Wi-Fi" checked={on} onCheckedChange={setOn} />} />
    <ListRow title="Bluetooth" value="On" accessory="chevron" onPress={open} />
  </ListSection>
  <ListSection><ListRow title="Sign Out" destructive onPress={signOut} /></ListSection>
</List>
```

## Controls

`Toggle {checked,onCheckedChange,label,color?}`, `Slider {value,onValueChange,min,max,step,label,minIcon,maxIcon}`, `SegmentedControl {options,value,onChange,label}`, `Stepper {value,onChange,min,max,step,label}`. All adapt to macOS sizes when `data-cf-platform="macos"`.

## Fields

`TextField {label, error, clearable, inList, ...input}`; `SearchField {value,onChange,placeholder,onCancel,glass}` (glass for the bottom search on iPhone).

## Presentation

```tsx
<Sheet open={o} onOpenChange={setO} title="New Note" detents={['medium','large']} modal={true}
  leading={<Button variant="plain" onClick={() => setO(false)}>Cancel</Button>}
  trailing={<IconButton label="Done" variant="prominentGlass" icon={<Check size={20}/>} onClick={save} />}>
  ...
</Sheet>
<Alert open title="Delete this note?" message="..." actions={[{label:'Cancel',role:'cancel'},{label:'Delete',role:'destructive',onPress:del}]} onOpenChange={...} />
<ConfirmationDialog open actions={[{label:'Discard Changes',role:'destructive'},{label:'Keep Editing',role:'cancel'}]} onOpenChange={...} />
<Menu trigger={<IconButton label="More" icon={<Ellipsis/>} />}>
  <MenuSection><MenuItem label="Rename" icon={<Pencil size={18}/>} shortcut="⌘R" /></MenuSection>
  <MenuItem label="Delete" destructive icon={<Trash2 size={18}/>} />
</Menu>
<ContextMenu items={[{ label:'Copy', icon:<Copy size={18}/> }]}><div>target</div></ContextMenu>
<Popover trigger={...}>content</Popover>
<Tooltip label="Share"><button>...</button></Tooltip>
```

## Feedback

`ActivityIndicator`, `useDelayedFlag(loading, 300)`, `ProgressBar {value,label}`, `Hud {show, icon}`, `EmptyState {icon,title,message,action}`.

## macOS shell

```tsx
<MacWindow active={focused} customChrome={!isMac}
  sidebar={<MacSidebarSection title="Library"><MacSidebarRow label="Inbox" icon={<Inbox size={16}/>} selected onSelect={...} badge={12}/></MacSidebarSection>}
  toolbar={<><MacToolbarTitle title="Inbox" subtitle="12 messages"/><MacToolbarSpacer/>
    <MacToolbarGroup label="Actions"><MacToolbarItem label="New" icon={<SquarePen size={16}/>}/></MacToolbarGroup>
    <div className="w-[220px]"><SearchField value={q} onChange={setQ}/></div></>}
  inspector={showInspector && <Inspector/>}>
  <MacTable columns={[...]} rows={rows} selected={sel} onSelect={setSel} />
</MacWindow>
```
Controls: `MacButton {variant: bordered|default|destructive|plain, size}`, `Checkbox`, `RadioGroup`, `MacTextField`.

## Haptics and sound

```ts
import { haptic } from '@/lib/cupertino/haptics';   haptic('success');
import { playSound } from '@/lib/cupertino/sounds'; playSound('send'); // no-op unless enabled
```
Toggle, SegmentedControl, Stepper, Slider, TabBar, Sheet, Alert and ContextMenu already fire the right haptics.
