/**
 * ParentSchedule — Read-only schedule view for parents and players
 *
 * Displays all upcoming games and practices in a clean card layout.
 * No edit capability. Includes an iCal export button that generates
 * a .ics file for adding to phone calendars.
 */

import { useMemo } from 'react';
import THEME from '@data/theme';
import { SEASON_SCHEDULE } from '@data/schedule';

// ── Event type badges ───────────────────────────────────────────────────────
const TYPE_CONFIG = {
  game:       { label: 'Game',       color: THEME.gold,  bg: 'rgba(253,181,21,0.15)' },
  practice:   { label: 'Practice',   color: THEME.green, bg: 'rgba(46,204,113,0.15)' },
  scrimmage:  { label: 'Scrimmage',  color: THEME.blue,  bg: 'rgba(52,152,219,0.15)' },
  tournament: { label: 'Tournament', color: THEME.red,   bg: 'rgba(231,76,60,0.15)' },
};

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: THEME.gold,
    marginBottom: 12,
  },
  exportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: THEME.charcoal,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 8,
    color: THEME.white,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 20,
  },
  card: {
    background: THEME.blackLight,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 10,
  },
  cardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: THEME.white,
  },
  cardMeta: {
    fontSize: 12,
    color: THEME.gray,
    marginTop: 4,
  },
  badge: (type) => {
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.practice;
    return {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
    };
  },
  empty: {
    textAlign: 'center',
    color: THEME.gray,
    padding: 40,
    fontSize: 14,
  },
};

// ── iCal generation helpers ─────────────────────────────────────────────────

function formatICalDate(dateStr, timeStr) {
  // dateStr: "2026-04-09", timeStr: "4:45 PM" or "TBD"
  if (!timeStr || timeStr === 'TBD') {
    // All-day event
    return dateStr.replace(/-/g, '');
  }
  const [datePart] = dateStr.split('T');
  const [y, m, d] = datePart.split('-');

  // Parse time
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return dateStr.replace(/-/g, '');

  let hour = parseInt(match[1], 10);
  const min = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return `${y}${m}${d}T${String(hour).padStart(2, '0')}${min}00`;
}

function generateICal(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pirates Softball//Dashboard//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  events.forEach((evt) => {
    const dtStart = formatICalDate(evt.date, evt.time);
    const dtEnd = evt.endTime
      ? formatICalDate(evt.date, evt.endTime)
      : formatICalDate(evt.date, evt.time); // same time if no end

    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:Pirates - ${evt.title}`);
    lines.push(`LOCATION:${evt.location || ''}`);
    lines.push(`DESCRIPTION:${evt.phase || ''}`);
    lines.push(`UID:pirates-${evt.id}@softball`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function downloadICal(events) {
  const icalStr = generateICal(events);
  const blob = new Blob([icalStr], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pirates-softball-2026.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Formatting helpers ──────────────────────────────────────────────────────

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// ── Component ───────────────────────────────────────────────────────────────

export default function ParentSchedule() {
  const today = new Date().toISOString().split('T')[0];

  const upcoming = useMemo(
    () => SEASON_SCHEDULE.filter((e) => e.date >= today),
    [today],
  );

  const past = useMemo(
    () => SEASON_SCHEDULE.filter((e) => e.date < today).reverse(),
    [today],
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={styles.sectionTitle}>Upcoming</div>
        <button
          style={styles.exportBtn}
          onClick={() => downloadICal(upcoming)}
          title="Export to calendar"
        >
          {'\uD83D\uDCC6'} Export iCal
        </button>
      </div>

      {upcoming.length === 0 && (
        <div style={styles.empty}>No upcoming events on the schedule.</div>
      )}

      {upcoming.map((evt) => (
        <div key={evt.id} style={styles.card}>
          <div style={styles.cardRow}>
            <div>
              <div style={styles.cardTitle}>{evt.title}</div>
              <div style={styles.cardMeta}>
                {formatDate(evt.date)} &middot; {evt.time || 'TBD'}
                {evt.endTime ? ` - ${evt.endTime}` : ''}
              </div>
              <div style={styles.cardMeta}>
                {'\uD83D\uDCCD'} {evt.location || 'TBD'}
                {evt.homeAway ? ` (${evt.homeAway})` : ''}
              </div>
            </div>
            <span style={styles.badge(evt.type)}>
              {(TYPE_CONFIG[evt.type] || TYPE_CONFIG.practice).label}
            </span>
          </div>
        </div>
      ))}

      {past.length > 0 && (
        <>
          <div style={{ ...styles.sectionTitle, marginTop: 28, color: THEME.gray }}>
            Past Events
          </div>
          {past.map((evt) => (
            <div key={evt.id} style={{ ...styles.card, opacity: 0.55 }}>
              <div style={styles.cardRow}>
                <div>
                  <div style={styles.cardTitle}>{evt.title}</div>
                  <div style={styles.cardMeta}>
                    {formatDate(evt.date)} &middot; {evt.time || 'TBD'}
                  </div>
                </div>
                <span style={styles.badge(evt.type)}>
                  {(TYPE_CONFIG[evt.type] || TYPE_CONFIG.practice).label}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
