/**
 * AuthGate — Authentication gate for the Pirates Softball Dashboard
 *
 * If no user is authenticated, renders a role-selection / login screen.
 * Once authenticated, renders children (the main app).
 * Includes a Logout control intended for the header area.
 */

import { useState } from 'react';
import THEME from '@data/theme';
import { SEED_PLAYERS } from '@data/players';
import { load } from '@app/storage';
import useAuth from '@shared/hooks/useAuth';
import { getTeamPin, generateAllPlayerCodes, getPlayerCodes } from '@app/auth';

// ── Inline styles using Pirates theme ───────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: THEME.black,
    color: THEME.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: THEME.blackLight,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    margin: '0 16px',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: THEME.gold,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.gray,
    textAlign: 'center',
    marginBottom: 28,
  },
  roleBtn: {
    display: 'block',
    width: '100%',
    padding: '14px 16px',
    marginBottom: 12,
    background: THEME.charcoal,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 10,
    color: THEME.white,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
  },
  roleBtnHover: {
    borderColor: THEME.gold,
    background: '#2f2d28',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: THEME.black,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 10,
    color: THEME.white,
    fontSize: 15,
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  primaryBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    background: THEME.gold,
    border: 'none',
    borderRadius: 10,
    color: THEME.black,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 8,
  },
  ghostBtn: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    color: THEME.gray,
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'center',
  },
  error: {
    color: THEME.red,
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: THEME.grayLight,
    marginBottom: 6,
    display: 'block',
  },
  infoBox: {
    background: THEME.black,
    border: `1px solid ${THEME.charcoal}`,
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 14,
    fontSize: 12,
    color: THEME.gray,
    lineHeight: 1.5,
  },
};

// ── RoleButton with hover effect ────────────────────────────────────────────
function RoleButton({ icon, label, description, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...styles.roleBtn, ...(hovered ? styles.roleBtnHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ marginRight: 10, fontSize: 20 }}>{icon}</span>
      {label}
      {description && (
        <span style={{ display: 'block', fontSize: 12, color: THEME.gray, marginTop: 2, marginLeft: 30 }}>
          {description}
        </span>
      )}
    </button>
  );
}

// ── Main AuthGate component ─────────────────────────────────────────────────
export default function AuthGate({ children }) {
  const { isAuthenticated, login, logout, role, playerName } = useAuth();
  const [screen, setScreen] = useState('select');    // select | coach | parent | player
  const [subRole, setSubRole] = useState(null);      // head_coach | assistant
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Load players from storage (or fall back to seed data)
  const players = load('pirates-players-2026v3', SEED_PLAYERS);

  const handleCoachLogin = () => {
    setError('');
    const result = login(subRole || 'head_coach', pin, players);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleCodeLogin = (loginRole) => {
    setError('');
    const result = login(loginRole, code, players);
    if (!result.success) {
      setError(result.error);
    }
  };

  const reset = () => {
    setScreen('select');
    setSubRole(null);
    setPin('');
    setCode('');
    setError('');
  };

  // ── Authenticated: render children with a logout header strip ─────────
  if (isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: THEME.black, color: THEME.white }}>
        {/* Auth status bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '6px 16px',
            background: THEME.blackLight,
            borderBottom: `1px solid ${THEME.charcoal}`,
            fontSize: 12,
            gap: 12,
          }}
        >
          <span style={{ color: THEME.gray }}>
            {role === 'parent' && playerName
              ? `${playerName}'s parent`
              : role === 'player' && playerName
                ? playerName
                : role.replace('_', ' ')}
          </span>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: `1px solid ${THEME.charcoal}`,
              borderRadius: 6,
              color: THEME.grayLight,
              padding: '3px 10px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    );
  }

  // ── Not authenticated: login screens ──────────────────────────────────

  // Coach PIN entry
  if (screen === 'coach') {
    const hasPin = getTeamPin() !== null;
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.title}>Coach Login</div>
          <div style={styles.subtitle}>
            {hasPin ? 'Enter your team PIN' : 'Set a team PIN (first time setup)'}
          </div>

          {/* Sub-role selector */}
          {hasPin && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['head_coach', 'assistant'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setSubRole(r); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 8,
                    border: `1px solid ${subRole === r ? THEME.gold : THEME.charcoal}`,
                    background: subRole === r ? THEME.gold : 'transparent',
                    color: subRole === r ? THEME.black : THEME.grayLight,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {r === 'head_coach' ? 'Head Coach' : 'Assistant'}
                </button>
              ))}
            </div>
          )}

          {!hasPin && (
            <div style={styles.infoBox}>
              No team PIN has been set yet. Enter a 4+ digit PIN to claim head
              coach access. Share this PIN with assistants.
            </div>
          )}

          <label style={styles.label}>Team PIN</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCoachLogin()}
            style={styles.input}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button
            style={{
              ...styles.primaryBtn,
              opacity: pin.length < 4 ? 0.5 : 1,
              cursor: pin.length < 4 ? 'not-allowed' : 'pointer',
            }}
            disabled={pin.length < 4}
            onClick={handleCoachLogin}
          >
            {hasPin ? 'Login' : 'Set PIN & Login'}
          </button>
          <button style={styles.ghostBtn} onClick={reset}>Back</button>
        </div>
      </div>
    );
  }

  // Parent code entry
  if (screen === 'parent') {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.title}>Parent Login</div>
          <div style={styles.subtitle}>Enter your player access code</div>
          <div style={styles.infoBox}>
            Your coach provides a unique access code for your player.
            This gives you read-only access to the schedule and your player's stats.
          </div>
          <label style={styles.label}>Access Code</label>
          <input
            type="text"
            placeholder="e.g. TEA1234"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleCodeLogin('parent')}
            style={styles.input}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button
            style={{
              ...styles.primaryBtn,
              opacity: code.length < 4 ? 0.5 : 1,
              cursor: code.length < 4 ? 'not-allowed' : 'pointer',
            }}
            disabled={code.length < 4}
            onClick={() => handleCodeLogin('parent')}
          >
            Login
          </button>
          <button style={styles.ghostBtn} onClick={reset}>Back</button>
        </div>
      </div>
    );
  }

  // Player code entry
  if (screen === 'player') {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.title}>Player Login</div>
          <div style={styles.subtitle}>Enter your player access code</div>
          <div style={styles.infoBox}>
            Ask your coach for your unique access code.
            You'll be able to see the schedule and your personal stats.
          </div>
          <label style={styles.label}>Access Code</label>
          <input
            type="text"
            placeholder="e.g. TEA1234"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleCodeLogin('player')}
            style={styles.input}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          <button
            style={{
              ...styles.primaryBtn,
              opacity: code.length < 4 ? 0.5 : 1,
              cursor: code.length < 4 ? 'not-allowed' : 'pointer',
            }}
            disabled={code.length < 4}
            onClick={() => handleCodeLogin('player')}
          >
            Login
          </button>
          <button style={styles.ghostBtn} onClick={reset}>Back</button>
        </div>
      </div>
    );
  }

  // ── Role selection (default screen) ───────────────────────────────────
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 8 }}>
          {'\uD83C\uDFF4\u200D\u2620\uFE0F'}
        </div>
        <div style={styles.title}>Pirates Softball</div>
        <div style={styles.subtitle}>2026 Season Dashboard</div>

        <RoleButton
          icon={'\u{1F9E2}'}
          label="I'm a Coach"
          description="Full access with team PIN"
          onClick={() => {
            setScreen('coach');
            setSubRole('head_coach');
          }}
        />
        <RoleButton
          icon={'\u{1F468}\u200D\u{1F469}\u200D\u{1F467}'}
          label="I'm a Parent"
          description="Schedule & player stats"
          onClick={() => setScreen('parent')}
        />
        <RoleButton
          icon={'\u26BE'}
          label="I'm a Player"
          description="Your schedule & stats"
          onClick={() => setScreen('player')}
        />
      </div>
    </div>
  );
}
