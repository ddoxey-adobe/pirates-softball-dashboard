/**
 * Pirates Softball Dashboard — Authentication & Role-Based Permissions
 *
 * PIN-based auth system:
 *   - Head coach sets a team PIN (stored in localStorage)
 *   - Assistants use the same team PIN
 *   - Parents/players authenticate via a player access code
 *
 * Roles: league_director, head_coach, assistant, parent, player
 * Each role has granular module-level permissions (read / full).
 */

import { load, save, remove } from './storage';

// ── Storage keys ────────────────────────────────────────────────────────────
const AUTH_KEY        = 'pirates-auth-state';
const TEAM_PIN_KEY    = 'pirates-team-pin';
const PLAYER_CODES_KEY = 'pirates-player-codes';

// ── Role constants ──────────────────────────────────────────────────────────
export const ROLES = {
  LEAGUE_DIRECTOR: 'league_director',
  HEAD_COACH:      'head_coach',
  ASSISTANT:       'assistant',
  PARENT:          'parent',
  PLAYER:          'player',
};

// ── Permissions per role ────────────────────────────────────────────────────
// "full"  = read + create + edit + delete
// "read"  = view only
// null / missing = no access
export const PERMISSIONS = {
  [ROLES.LEAGUE_DIRECTOR]: {
    roster:    'full',
    schedule:  'full',
    practice:  'full',
    gameday:   'full',
    reports:   'full',
    comms:     'full',
    scouting:  'full',
    tryouts:   'full',
    settings:  'full',
  },
  [ROLES.HEAD_COACH]: {
    roster:    'full',
    schedule:  'full',
    practice:  'full',
    gameday:   'full',
    reports:   'full',
    comms:     'full',
    scouting:  'full',
    tryouts:   'full',
    settings:  'full',
  },
  [ROLES.ASSISTANT]: {
    roster:    'read',
    schedule:  'full',
    practice:  'full',
    gameday:   'full',
    reports:   'read',
    comms:     'full',
    scouting:  'read',
    tryouts:   'read',
    settings:  null,
  },
  [ROLES.PARENT]: {
    roster:    null,
    schedule:  'read',
    practice:  null,
    gameday:   null,
    reports:   'read',    // limited to their player
    comms:     null,
    scouting:  null,
    tryouts:   null,
    settings:  null,
  },
  [ROLES.PLAYER]: {
    roster:    null,
    schedule:  'read',
    practice:  null,
    gameday:   null,
    reports:   'read',    // limited to themselves
    comms:     null,
    scouting:  null,
    tryouts:   null,
    settings:  null,
  },
};

// ── Auth state helpers ──────────────────────────────────────────────────────

/**
 * Returns the persisted auth state object, or null if not logged in.
 * Shape: { role, playerId?, playerName?, authenticatedAt }
 */
export function getAuthState() {
  return load(AUTH_KEY, null);
}

/** Get the current role string, or null. */
export function getCurrentRole() {
  const state = getAuthState();
  return state ? state.role : null;
}

/** Check whether any user is currently authenticated. */
export function isAuthenticated() {
  return getAuthState() !== null;
}

/** Persist a new auth state (used by login helpers). */
export function setRole(role, extra = {}) {
  const state = { role, authenticatedAt: new Date().toISOString(), ...extra };
  save(AUTH_KEY, state);
  return state;
}

/** Clear auth state (logout). */
export function clearAuth() {
  remove(AUTH_KEY);
}

// ── Permission checks ───────────────────────────────────────────────────────

/**
 * Check whether the current (or supplied) role has permission on a module.
 * @param {string} module   Module id (e.g. 'schedule', 'gameday')
 * @param {string} action   'read' | 'full'  (default: 'read')
 * @param {string} [role]   Override role; defaults to current session role
 * @returns {boolean}
 */
export function hasPermission(module, action = 'read', role) {
  const r = role || getCurrentRole();
  if (!r) return false;
  const perms = PERMISSIONS[r];
  if (!perms) return false;
  const level = perms[module];
  if (!level) return false;
  if (action === 'read') return level === 'read' || level === 'full';
  if (action === 'full') return level === 'full';
  return false;
}

// ── PIN management ──────────────────────────────────────────────────────────

/** Get the stored team PIN (set by head coach). Returns null if not set. */
export function getTeamPin() {
  return load(TEAM_PIN_KEY, null);
}

/** Head coach sets (or resets) the team PIN. */
export function setTeamPin(pin) {
  save(TEAM_PIN_KEY, pin);
}

/** Validate a PIN against the stored team PIN. */
export function validateTeamPin(pin) {
  const stored = getTeamPin();
  if (!stored) return false;
  return String(pin) === String(stored);
}

// ── Player access codes ─────────────────────────────────────────────────────
// Map of playerId -> accessCode. The head coach generates these.

export function getPlayerCodes() {
  return load(PLAYER_CODES_KEY, {});
}

export function setPlayerCode(playerId, code) {
  const codes = getPlayerCodes();
  codes[playerId] = code;
  save(PLAYER_CODES_KEY, codes);
}

/**
 * Generate codes for all players. Returns the updated map.
 * Code format: first 3 letters of name (uppercase) + 4-digit random number.
 */
export function generateAllPlayerCodes(players) {
  const codes = {};
  players.forEach((p) => {
    const prefix = p.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const num = String(Math.floor(1000 + Math.random() * 9000));
    codes[p.id] = prefix + num;
  });
  save(PLAYER_CODES_KEY, codes);
  return codes;
}

/**
 * Validate a player access code.
 * Returns { valid: true, playerId, playerName } or { valid: false }.
 */
export function validatePlayerCode(code, players) {
  const codes = getPlayerCodes();
  const entry = Object.entries(codes).find(([, c]) => c === code);
  if (!entry) return { valid: false };
  const [playerId] = entry;
  const player = players.find((p) => p.id === playerId);
  if (!player) return { valid: false };
  return { valid: true, playerId, playerName: player.name };
}

// ── Login helpers ───────────────────────────────────────────────────────────

/**
 * Attempt coach login with a PIN.
 * If no team PIN exists yet, the first PIN entered becomes the team PIN
 * (bootstrapping for the head coach).
 * @param {string} pin
 * @param {'head_coach'|'assistant'} role
 * @returns {{ success: boolean, error?: string }}
 */
export function loginCoach(pin, role = ROLES.HEAD_COACH) {
  if (!pin || pin.length < 4) {
    return { success: false, error: 'PIN must be at least 4 digits' };
  }

  const existingPin = getTeamPin();

  // Bootstrap: first coach login sets the PIN
  if (!existingPin && role === ROLES.HEAD_COACH) {
    setTeamPin(pin);
    setRole(role);
    return { success: true };
  }

  if (!validateTeamPin(pin)) {
    return { success: false, error: 'Incorrect PIN' };
  }

  setRole(role);
  return { success: true };
}

/**
 * Attempt parent/player login with a player access code.
 * @param {string} code
 * @param {Array} players    Full player roster (to look up names)
 * @param {'parent'|'player'} role
 * @returns {{ success: boolean, error?: string }}
 */
export function loginWithPlayerCode(code, players, role = ROLES.PARENT) {
  const result = validatePlayerCode(code, players);
  if (!result.valid) {
    return { success: false, error: 'Invalid access code' };
  }
  setRole(role, { playerId: result.playerId, playerName: result.playerName });
  return { success: true };
}

/** Logout — clears auth state. */
export function logout() {
  clearAuth();
}
