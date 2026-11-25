import * as React from 'react';
import { House, Search, Compass, Bell } from 'lucide-react';
import { CupertinoRoot, useCupertino } from '@/components/apple/root';
import { Glass } from '@/components/apple/glass';
import { Squircle } from '@/components/apple/squircle';
import { Button } from '@/components/apple/button';
import { Toggle, Slider, SegmentedControl, Stepper } from '@/components/apple/controls';
import { TabBar } from '@/components/apple/tab-bar';
import { Sheet } from '@/components/apple/sheet';
import { Alert } from '@/components/apple/alert';
import { NavBar } from '@/components/apple/nav';
import { List, ListSection, ListRow, SettingsIcon } from '@/components/apple/list';
import { TextField, SearchField } from '@/components/apple/fields';
import { Menu, MenuSection, MenuItem } from '@/components/apple/menu';
import { Popover, Tooltip } from '@/components/apple/popover';
import { ActivityIndicator, ProgressBar, Hud, EmptyState } from '@/components/apple/feedback';
import { MacWindow, MacToolbarTitle, MacToolbarSpacer, MacToolbarGroup, MacToolbarItem, MacSidebarSection, MacSidebarRow, MacButton, Checkbox, RadioGroup, MacTable } from '@/components/apple/mac';

function Harness() {
  const { theme, resolvedTransparency, resolvedContrast, reducedMotion, squircleNative, setAppearance, setTransparency } = useCupertino();
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  const [toggleOn, setToggleOn] = React.useState(false);
  const [sliderVal, setSliderVal] = React.useState(0.5);
  const [seg, setSeg] = React.useState<'day' | 'week' | 'month'>('day');
  const [tab, setTab] = React.useState('home');
  const [stepVal, setStepVal] = React.useState(1);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [sheetNonModalOpen, setSheetNonModalOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertResult, setAlertResult] = React.useState('none');
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  return (
    <div id="harness-root" dir={dir} className="min-h-dvh bg-bg p-lg pb-32 text-label">
      <NavBar
        title="Verify Harness"
        large={false}
        trailing={
          <Button id="btn-open-sheet" variant="prominentGlass" size="small" onClick={() => setSheetOpen(true)}>
            Open Sheet
          </Button>
        }
      />

      <div className="mx-auto flex max-w-[672px] flex-col gap-lg pt-lg">
        <div id="env-telemetry" className="text-caption1 text-label-2">
          theme={theme} transparency={resolvedTransparency} contrast={resolvedContrast} rm={String(reducedMotion)} sq={String(squircleNative)} dir={dir}
        </div>

        <div className="flex flex-wrap gap-sm">
          <Button id="btn-toggle-theme" variant="gray" size="small" onClick={() => setAppearance(theme === 'dark' ? 'light' : 'dark')}>
            Theme: {theme}
          </Button>
          <Button
            id="btn-toggle-transparency"
            variant="gray"
            size="small"
            onClick={() => setTransparency(resolvedTransparency === 'reduce' ? 'normal' : 'reduce')}
          >
            Transparency: {resolvedTransparency}
          </Button>
          <Button id="btn-toggle-dir" variant="gray" size="small" onClick={() => setDir((d) => (d === 'ltr' ? 'rtl' : 'ltr'))}>
            Dir: {dir}
          </Button>
          <Button id="btn-open-nonmodal-sheet" variant="tinted" size="small" onClick={() => setSheetNonModalOpen(true)}>
            NonModal Sheet
          </Button>
          <Button id="btn-open-alert" variant="destructive" size="small" onClick={() => setAlertOpen(true)}>
            Open Alert
          </Button>
          <Button id="btn-glass" variant="glass" size="small">
            Glass Button
          </Button>
        </div>

        <Glass id="test-glass-rect" variant="regular" shape="rect" radiusToken="popover" pressable className="p-lg">
          <span className="text-body text-label-glass">Glass Rect Card</span>
        </Glass>

        <Squircle id="test-squircle-card" radius="card" className="bg-bg-2 p-lg shadow-popover">
          <span className="text-body text-label">Squircle Shadow Card</span>
        </Squircle>

        <div className="flex items-center gap-lg">
          <div id="toggle-wrap">
            <Toggle label="Enable Feature" checked={toggleOn} onCheckedChange={setToggleOn} />
          </div>
          <Stepper label="Count" value={stepVal} onChange={setStepVal} />
        </div>

        <Slider label="Volume" value={sliderVal} onValueChange={setSliderVal} />

        <div id="seg-wrap">
          <SegmentedControl
            label="Period"
            value={seg}
            onChange={setSeg}
            options={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </div>

        <SearchField value={query} onChange={setQuery} />

        <List style="insetGrouped">
          <ListSection header="Connectivity">
            <ListRow
              leading={<SettingsIcon color="blue"><Bell size={17} /></SettingsIcon>}
              title="Notifications"
              value={alertResult}
              accessory="chevron"
              onPress={() => {}}
            />
            <ListRow title="Alert Outcome" value={alertResult} />
          </ListSection>
        </List>

        <span id="alert-result" data-result={alertResult}>{alertResult}</span>

        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Test Sheet"
          detents={['medium', 'large']}
          initialDetent="large"
          leading={<Button variant="plain" onClick={() => setSheetOpen(false)}>Cancel</Button>}
          trailing={<Button id="btn-close-sheet" variant="prominentGlass" size="small" onClick={() => setSheetOpen(false)}>Done</Button>}
        >
          <div id="sheet-scroll-content" className="p-lg">
            <div style={{ height: 1200 }} className="bg-fill-4 p-lg text-body text-label">
              Scrollable sheet body content
            </div>
          </div>
        </Sheet>

        <Sheet
          open={sheetNonModalOpen}
          onOpenChange={setSheetNonModalOpen}
          title="NonModal"
          detents={['medium']}
          modal={false}
          trailing={<Button variant="plain" onClick={() => setSheetNonModalOpen(false)}>Close</Button>}
        >
          <div className="p-lg text-body">Non-modal medium sheet</div>
        </Sheet>

        <Alert
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="Delete item?"
          message="This cannot be undone."
          actions={[
            { label: 'Cancel', role: 'cancel', onPress: () => setAlertResult('cancelled') },
            { label: 'Delete', role: 'default', onPress: () => setAlertResult('deleted') },
          ]}
        />

        {/* Reference smoke-compile usage of remaining exports */}
        <div className="hidden" aria-hidden="true">
          <Menu trigger={<Button>M</Button>}>
            <MenuSection><MenuItem label="One" /></MenuSection>
            <MenuSection><MenuItem label="Two" /></MenuSection>
          </Menu>
          <Popover trigger={<Button>P</Button>}><div>Pop</div></Popover>
          <Tooltip label="Tip"><Button>T</Button></Tooltip>
          <ActivityIndicator />
          <ProgressBar value={0.5} label="Prog" />
          <Hud show={false}>Done</Hud>
          <EmptyState icon={<House />} title="Empty" />
          <TextField label="Name" />
          <MacWindow
            sidebar={<MacSidebarSection title="S"><MacSidebarRow label="R" selected /></MacSidebarSection>}
            toolbar={<><MacToolbarTitle title="T" /><MacToolbarSpacer /><MacToolbarGroup label="G"><MacToolbarItem label="I" icon={<House />} /></MacToolbarGroup></>}
          >
            <MacButton>Ok</MacButton>
            <Checkbox checked={true} onChange={() => {}} label="Check" />
            <RadioGroup value="a" onChange={() => {}} options={[{ value: 'a', label: 'A' }]} label="Radio" />
            <MacTable columns={[{ key: 'name', title: 'Name' }]} rows={[{ id: '1', name: 'Row 1' }]} />
          </MacWindow>
        </div>
      </div>

      <TabBar
        selected={tab}
        onSelect={setTab}
        items={[
          { id: 'home', label: 'Home', icon: <House size={22} /> },
          { id: 'browse', label: 'Browse', icon: <Compass size={22} /> },
          { id: 'alerts', label: 'Alerts', icon: <Bell size={22} /> },
        ]}
        search={{ label: 'Search', icon: <Search size={20} />, onPress: () => {} }}
      />
    </div>
  );
}

function MacHarness() {
  const [selectedRow, setSelectedRow] = React.useState('inbox');
  const [checked, setChecked] = React.useState(true);
  const [radio, setRadio] = React.useState<'a' | 'b'>('a');
  const [tableSel, setTableSel] = React.useState<string[]>(['1']);

  return (
    <MacWindow
      sidebar={
        <MacSidebarSection title="Favorites">
          <MacSidebarRow label="Inbox" icon={<House size={15} />} selected={selectedRow === 'inbox'} onSelect={() => setSelectedRow('inbox')} badge={4} />
          <MacSidebarRow label="Explore" icon={<Compass size={15} />} selected={selectedRow === 'explore'} onSelect={() => setSelectedRow('explore')} />
          <MacSidebarRow label="Alerts" icon={<Bell size={15} />} selected={selectedRow === 'alerts'} onSelect={() => setSelectedRow('alerts')} />
        </MacSidebarSection>
      }
      toolbar={
        <>
          <MacToolbarTitle title="Workspace" subtitle="macOS 27 Harness" />
          <MacToolbarSpacer />
          <MacToolbarGroup label="Actions">
            <MacToolbarItem label="Home" icon={<House size={15} />} active />
            <MacToolbarItem label="Search" icon={<Search size={15} />} />
          </MacToolbarGroup>
        </>
      }
      inspector={
        <div className="flex flex-col gap-md">
          <span className="text-headline text-label">Inspector</span>
          <Checkbox checked={checked} onChange={setChecked} label="Sync iCloud" />
          <RadioGroup
            label="Mode"
            value={radio}
            onChange={setRadio}
            options={[
              { value: 'a', label: 'Automatic' },
              { value: 'b', label: 'Manual' },
            ]}
          />
          <div className="flex gap-sm">
            <MacButton variant="default">Save</MacButton>
            <MacButton variant="bordered">Cancel</MacButton>
          </div>
        </div>
      }
    >
      <div className="p-lg">
        <MacTable
          columns={[
            { key: 'name', title: 'Name' },
            { key: 'kind', title: 'Kind', width: 120 },
          ]}
          rows={[
            { id: '1', name: 'Design Spec.fig', kind: 'Document' },
            { id: '2', name: 'Tokens.json', kind: 'JSON' },
          ]}
          selected={tableSel}
          onSelect={setTableSel}
        />
      </div>
    </MacWindow>
  );
}

export function App() {
  const isMacView = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'mac';
  if (isMacView) {
    return (
      <CupertinoRoot style="macos" appearance="system" glassIntensity={0.5}>
        <MacHarness />
      </CupertinoRoot>
    );
  }
  return (
    <CupertinoRoot style="ios" appearance="system" glassIntensity={0.5}>
      <Harness />
    </CupertinoRoot>
  );
}
