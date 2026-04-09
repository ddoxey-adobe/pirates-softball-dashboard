/**
 * ParentLayout — Simplified layout for parent/player users
 *
 * Shows only Schedule (read-only) and Player Stats (their kid only).
 * No coaching tools are visible. Clean, simple two-tab navigation.
 */

import { useState } from 'react';
import THEME from '@data/theme';
import useAuth from '@shared/hooks/useAuth';
import ParentSchedule from './ParentSchedule';
import PlayerStats from './PlayerStats';

const TABS = [
  { id: 'schedule', label: 'Schedule', icon: '\uD83D\uDCC5' },
  { id: 'stats',    label: 'Player Stats', icon: '\uD83D\uDCCA' },
];

const styles = {
  container: {
    minHeight: '100vh',
    background: THEME.black,
    color: THEME.white,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: THEME.blackLight,
    borderBottom: `1px solid ${THEME.charcoal}`,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: THEME.gold,
    lineHeight: 1.2,
  },
  headerSub: {
    fontSize: 12,
    color: THEME.gray,
  },
  tabBar: {
    display: 'flex',
    background: THEME.blackLight,
    borderBottom: `1px solid ${THEME.charcoal}`,
  },
  tab: (active) => ({
    flex: 1,
    padding: '10px 0',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    color: active ? THEME.gold : THEME.gray,
    background: 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${THEME.gold}` : '2px solid transparent',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  }),
  content: {
    padding: 16,
    maxWidth: 600,
    margin: '0 auto',
  },
};

export default function ParentLayout() {
  const { playerName, playerId, role } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');

  // Determine display label
  const displayName = playerName || 'Player';
  const isParent = role === 'parent';
  const headerLabel = isParent
    ? `Logged in as ${displayName}'s parent`
    : `Logged in as ${displayName}`;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>{'\uD83C\uDFF4\u200D\u2620\uFE0F'}</span>
        <div>
          <div style={styles.headerTitle}>Pirates Softball</div>
          <div style={styles.headerSub}>{headerLabel}</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'schedule' && <ParentSchedule />}
        {activeTab === 'stats' && <PlayerStats playerId={playerId} />}
      </div>
    </div>
  );
}
