import { lazy } from 'react';

/**
 * Module Registry
 *
 * Central registry of all dashboard modules. Each entry controls:
 *   - id:        unique key used in routing and storage
 *   - label:     human-readable tab name
 *   - icon:      emoji shown next to the label
 *   - enabled:   whether the tab shows by default
 *   - tier:      feature tier (core | advanced) for future gating
 *   - component: React.lazy dynamic import of the module's default export
 */
const MODULE_REGISTRY = [
  {
    id: 'roster',
    label: 'Roster',
    icon: '\uD83D\uDC65',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/roster')),
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: '\uD83D\uDCC5',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/schedule')),
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: '\uD83E\uDD4E',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/practice')),
  },
  {
    id: 'gameday',
    label: 'Game Day',
    icon: '\u26BE',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/gameday')),
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '\uD83D\uDCCA',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/reports')),
  },
  {
    id: 'comms',
    label: 'Comms',
    icon: '\uD83D\uDCE3',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/comms')),
  },
  {
    id: 'scouting',
    label: 'Scouting',
    icon: '\uD83D\uDD0D',
    enabled: false,
    tier: 'advanced',
    component: lazy(() => import('../modules/scouting')),
  },
  {
    id: 'tryouts',
    label: 'Tryouts',
    icon: '\uD83C\uDFC6',
    enabled: true,
    tier: 'core',
    component: lazy(() => import('../modules/tryouts')),
  },
];

export default MODULE_REGISTRY;

/**
 * Get only enabled modules (for rendering the tab bar).
 */
export function getEnabledModules() {
  return MODULE_REGISTRY.filter((m) => m.enabled);
}

/**
 * Get a single module by id.
 */
export function getModule(id) {
  return MODULE_REGISTRY.find((m) => m.id === id) || null;
}
