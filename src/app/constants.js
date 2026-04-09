/**
 * Pirates Softball Dashboard — App Constants
 * Extracted from the original monolithic App.jsx
 */

export const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];

export const GRADES = ['7th', '8th', '9th'];

export const SKILL_AREAS = ['Hitting', 'Fielding', 'Throwing', 'Baserunning', 'Pitching', 'Attitude'];

export const AB_RESULTS = [
  { code: '1B', label: '1B', type: 'hit', color: '#2ECC71' },
  { code: '2B', label: '2B', type: 'hit', color: '#2ECC71' },
  { code: '3B', label: '3B', type: 'hit', color: '#2ECC71' },
  { code: 'HR', label: 'HR', type: 'hit', color: '#F1C40F' },
  { code: 'BB', label: 'BB', type: 'on', color: '#3498DB' },
  { code: 'HBP', label: 'HBP', type: 'on', color: '#3498DB' },
  { code: 'K', label: 'K', type: 'out', color: '#E74C3C' },
  { code: '\uA4D8', label: '\uA4D8', type: 'out', color: '#E74C3C' },
  { code: 'GO', label: 'GO', type: 'out', color: '#8E8E8E' },
  { code: 'FO', label: 'FO', type: 'out', color: '#8E8E8E' },
  { code: 'FC', label: 'FC', type: 'on', color: '#8E8E8E' },
  { code: 'SAC', label: 'SAC', type: 'out', color: '#8E8E8E' },
  { code: 'E', label: 'E', type: 'on', color: '#E67E22' },
];

export const isHit = (code) => ['1B', '2B', '3B', 'HR'].includes(code);
export const isOnBase = (code) => ['1B', '2B', '3B', 'HR', 'BB', 'HBP', 'FC', 'E'].includes(code);
export const isOut = (code) => ['K', '\uA4D8', 'GO', 'FO', 'SAC'].includes(code);
export const abColor = (code) => (AB_RESULTS.find((a) => a.code === code) || {}).color || '#8E8E8E';

export const STORAGE_KEYS = {
  PLAYERS: 'pirates-players-2026v3',
  COACHES: 'pirates-coaches-2026v1',
  PRACTICES: 'pirates-practices-2026v3',
  MESSAGES: 'pirates-messages-2026v3',
  GAMELOGS: 'pirates-gamelogs-2026v1',
  PRACTICELOGS: 'pirates-practicelogs-2026v1',
  SCOUTINGREPORTS: 'pirates-scouting-reports-2026v1',
  OPPONENTTEAMS: 'pirates-opponent-teams-2026v1',
};
