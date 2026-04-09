import { useState, Suspense } from 'react';
import MODULE_REGISTRY, { getEnabledModules } from './moduleRegistry';
import Tabs from '@shared/components/Tabs';
import { THEME } from './theme';

/**
 * App Shell — Pirates Softball Dashboard v2
 *
 * Reads the module registry, renders a tab bar with only enabled modules,
 * and lazy-loads each module's component on selection.
 */
export default function App() {
  const enabledModules = getEnabledModules();
  const [activeTab, setActiveTab] = useState(enabledModules[0]?.id || 'roster');

  const activeModule = MODULE_REGISTRY.find((m) => m.id === activeTab);
  const ActiveComponent = activeModule?.component;

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
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: THEME.gold }}
          />
          <span className="text-xs text-[#8E8E8E]">v2.0</span>
        </div>
      </header>

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
            <ActiveComponent />
          ) : (
            <div className="p-8 text-center text-[#8E8E8E]">
              Module not found.
            </div>
          )}
        </Suspense>
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
