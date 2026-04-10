import { useState, useEffect, Suspense, Component } from 'react';
import MODULE_REGISTRY, { getEnabledModules } from './moduleRegistry';
import Tabs from '@shared/components/Tabs';
import { THEME } from './theme';
import { STORAGE_KEYS } from './constants';
import { load, save } from './storage';
import { SEED_PLAYERS, SEED_COACHES } from '@data/players';
import { SEASON_SCHEDULE } from '@data/schedule';

// ─── ErrorBoundary ────────────────────────────────────────────────
// Catches render errors inside a module so a single broken panel
// doesn't take down the whole dashboard.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error(`[${this.props.moduleName || 'Module'}] render error:`, error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="bg-[#27251F] border border-[#E74C3C] rounded-xl p-8 max-w-lg mx-auto">
            <p className="text-3xl mb-3">{'\u26A0\uFE0F'}</p>
            <h3 className="text-lg font-bold text-[#E74C3C] mb-2">
              Module Error
            </h3>
            <p className="text-sm text-[#C4C4C4] mb-4">
              The <strong className="text-[#FDB515]">{this.props.moduleName || 'module'}</strong> encountered an error and could not render.
            </p>
            <p className="text-xs text-[#8E8E8E] font-mono bg-[#1B1B1B] p-3 rounded break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 text-sm font-bold uppercase tracking-wide border border-[#FDB515] text-[#FDB515] rounded hover:bg-[#FDB515] hover:text-[#1B1B1B] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Data Export / Import ─────────────────────────────────────────
const ALL_BACKUP_KEYS = [
  ...Object.values(STORAGE_KEYS),
  'pirates-practices-unified-2026v1',
  'pirates-lineup-templates-2026v2',
  'pirates-lineups-2026v1',
  'pirates-goals-2026v1',
  'pirates-alignment-library-2026v2',
  'pirates-stats-sidebar-open',
  'pirates-reports-collapsed',
];

function handleExportData() {
  try {
    const data = {};
    for (const key of ALL_BACKUP_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw !== null) data[key] = raw;
    }
    const payload = {
      _meta: {
        exportDate: new Date().toISOString(),
        appVersion: '2026-season-v2',
        teamName: 'Pirates Softball',
        keyCount: Object.keys(data).length,
      },
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pirates-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Export failed: ' + e.message);
  }
}

function handleImportData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed._meta || !parsed.data || typeof parsed.data !== 'object') {
          alert('Invalid backup file. Expected a Pirates Softball backup JSON file.');
          return;
        }
        if (
          !confirm(
            'This will replace all current data with the backup from ' +
              (parsed._meta.exportDate || 'unknown date') +
              ' (' +
              (parsed._meta.keyCount || Object.keys(parsed.data).length) +
              ' data keys).\n\nAre you sure?'
          )
        )
          return;
        for (const [key, value] of Object.entries(parsed.data)) {
          localStorage.setItem(key, value);
        }
        alert('Data imported successfully! The page will now reload.');
        window.location.reload();
      } catch (err) {
        alert('Failed to import: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ─── Next Up Banner ───────────────────────────────────────────────
function NextUpBanner({ schedule }) {
  const today = new Date().toISOString().split('T')[0];
  const next = schedule.filter((e) => e.date >= today)[0];
  if (!next) return null;

  const typeColors = {
    game: { bg: 'rgba(231,76,60,0.15)', text: '#E74C3C', icon: '\u26BE' },
    practice: { bg: 'rgba(253,181,21,0.15)', text: '#FDB515', icon: '\uD83E\uDD4E' },
    scrimmage: { bg: 'rgba(52,152,219,0.15)', text: '#3498DB', icon: '\uD83E\uDD4E' },
    tournament: { bg: 'rgba(241,196,15,0.15)', text: '#F1C40F', icon: '\uD83C\uDFC6' },
  };
  const colors = typeColors[next.type] || typeColors.practice;
  const isToday = next.date === today;

  return (
    <div
      className="px-4 py-2 flex items-center gap-3 text-sm border-b border-[#3A3A3A]"
      style={{ background: colors.bg }}
    >
      <span className="text-lg">{colors.icon}</span>
      <span className="font-bold uppercase text-xs tracking-wider" style={{ color: colors.text }}>
        {isToday ? 'Today' : 'Next Up'}
      </span>
      <span className="text-[#FAF9F6] font-medium">{next.title}</span>
      <span className="text-[#8E8E8E]">{'\u2014'}</span>
      <span className="text-[#C4C4C4]">
        {next.day} {next.date.slice(5)} {next.time ? 'at ' + next.time : ''}
      </span>
      {next.location && (
        <span className="text-[#8E8E8E] hidden sm:inline">@ {next.location}</span>
      )}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────
/**
 * App Shell -- Pirates Softball Dashboard v2
 *
 * Manages shared state (players, coaches, schedule), loads them from
 * localStorage with seed-data fallback, and renders the module system.
 */
export default function App() {
  // ── Shared State ──────────────────────────────────────────────
  const [players, setPlayers] = useState(() => load(STORAGE_KEYS.PLAYERS, SEED_PLAYERS));
  const [coaches, setCoaches] = useState(() => load(STORAGE_KEYS.COACHES, SEED_COACHES));
  const schedule = SEASON_SCHEDULE;

  // Persist players and coaches to localStorage on change
  useEffect(() => {
    save(STORAGE_KEYS.PLAYERS, players);
  }, [players]);

  useEffect(() => {
    save(STORAGE_KEYS.COACHES, coaches);
  }, [coaches]);

  // ── Tab Navigation ────────────────────────────────────────────
  const enabledModules = getEnabledModules();
  const [activeTab, setActiveTab] = useState(enabledModules[0]?.id || 'today');

  const activeModule = MODULE_REGISTRY.find((m) => m.id === activeTab);
  const ActiveComponent = activeModule?.component;

  // ── Props map: pass the right data to each module ─────────────
  // Modules that are 'ready' get real props; placeholders/building
  // modules receive no props (they render their own placeholder UI).
  function getModuleProps(moduleId) {
    switch (moduleId) {
      case 'today':
        return {
          players,
          onNavigate: (tabId) => {
            if (enabledModules.some((m) => m.id === tabId)) {
              setActiveTab(tabId);
            }
          },
        };
      case 'roster':
        return { players, setPlayers, coaches, setCoaches };
      case 'comms':
        return { players, coaches, schedule };
      case 'reports':
        return { players };
      case 'schedule':
      case 'practice':
        return { players, coaches };
      case 'gameday':
        return { players };
      case 'scouting':
      case 'tryouts':
      default:
        return {};
    }
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#FAF9F6] flex flex-col">
      {/* Header */}
      <header className="bg-[#27251F] border-b border-[#3A3A3A] px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">{'\uD83C\uDFF4\u200D\u2620\uFE0F'}</span>
        <div>
          <h1 className="text-lg font-bold text-[#FDB515] leading-tight">
            Pirates Softball
          </h1>
          <p className="text-xs text-[#8E8E8E]">
            2026 Season Dashboard
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-[#FDB515] text-[#FDB515] rounded hover:bg-[#FDB515] hover:text-[#1B1B1B] transition-colors"
            title="Export all data as JSON backup"
          >
            Export
          </button>
          <button
            onClick={handleImportData}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-[#FDB515] text-[#FDB515] rounded hover:bg-[#FDB515] hover:text-[#1B1B1B] transition-colors"
            title="Import data from JSON backup"
          >
            Import
          </button>
          <span
            className="inline-block w-3 h-3 rounded-full ml-2"
            style={{ backgroundColor: THEME.gold }}
          />
          <span className="text-xs text-[#8E8E8E]">v2.0</span>
        </div>
      </header>

      {/* Next Up Banner */}
      <NextUpBanner schedule={schedule} />

      {/* Tab Navigation */}
      <Tabs
        tabs={enabledModules.map((m) => ({
          id: m.id,
          label: m.label,
          icon: m.icon,
        }))}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {/* Module Content */}
      <main className="flex-1 overflow-y-auto">
        <ErrorBoundary key={activeTab} moduleName={activeModule?.label}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-8 h-8 border-2 border-[#FDB515] border-t-transparent rounded-full animate-spin"
                  />
                  <p className="text-sm text-[#8E8E8E]">Loading module...</p>
                </div>
              </div>
            }
          >
            {ActiveComponent ? (
              <ActiveComponent {...getModuleProps(activeTab)} />
            ) : (
              <div className="p-8 text-center text-[#8E8E8E]">
                Module not found.
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-[#27251F] border-t border-[#3A3A3A] px-4 py-2 text-center">
        <p className="text-xs text-[#8E8E8E]">
          Pirates Softball Dashboard -- Lehi Rec 12U-14U -- 2026 Season
        </p>
      </footer>
    </div>
  );
}
