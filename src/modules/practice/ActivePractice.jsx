/**
 * ActivePractice — Live practice mode with attendance, drill tracking,
 * station rotation management, observations, and highlight capture.
 *
 * Extracted from the PracticeLog component in App.jsx.
 * Handles all real-time tracking during an active practice session.
 */
import { useState, useEffect, useRef } from "react";
import THEME from "../../data/theme";
import { DRILL_LIBRARY, TRACKABLE_DRILLS } from "../../data/drills";
import { Badge, Button, SL, ToggleChips, Modal } from "../../shared/components";

const GROUP_COLORS = {
  red: { bg: "rgba(231,76,60,0.2)", border: "#e74c3c", text: "#e74c3c" },
  blue: { bg: "rgba(52,152,219,0.2)", border: "#3498db", text: "#3498db" },
  gold: { bg: "rgba(253,181,21,0.2)", border: "#fdb515", text: "#fdb515" }
};

// ── Pitch Count Utility ─────────────────────────────────────────
const getWeeklyPitchCounts = (practices, playerId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPractices = practices.filter(p => {
    if (!p.date || p.status !== "completed") return false;
    const practiceDate = new Date(p.date + "T12:00:00");
    return practiceDate >= sevenDaysAgo;
  });

  let totalPitches = 0;
  let lastPracticePitched = null;
  let lastPitchCount = 0;

  recentPractices.forEach(practice => {
    if (practice.drillTracking?.p3?.[playerId]) {
      const count = parseInt(practice.drillTracking.p3[playerId]) || 0;
      totalPitches += count;
      if (!lastPracticePitched || new Date(practice.date) > new Date(lastPracticePitched)) {
        lastPracticePitched = practice.date;
        lastPitchCount = count;
      }
    }
  });

  return {
    weeklyTotal: totalPitches,
    lastPitched: lastPracticePitched,
    lastCount: lastPitchCount,
    approachingLimit: totalPitches >= 80,
    overLimit: totalPitches > 100
  };
};

// ── ActivePractice Component ────────────────────────────────────
const ActivePractice = ({ form, setForm, players, allPractices }) => {
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [trackingGroup, setTrackingGroup] = useState(null);

  // Highlight modal state
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [highlightDrill, setHighlightDrill] = useState(null);
  const [highlightNote, setHighlightNote] = useState("");
  const [highlightPlayers, setHighlightPlayers] = useState([]);

  // Cleanup stopwatch on unmount
  useEffect(() => {
    return () => {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
    };
  }, []);

  const saveHighlight = () => {
    if (!highlightNote.trim()) { alert("Please enter a note"); return; }
    const highlight = {
      drillId: highlightDrill,
      note: highlightNote,
      timestamp: new Date().toISOString(),
      playersTagged: highlightPlayers
    };
    setForm({ ...form, highlights: [...(form.highlights || []), highlight] });
    setShowHighlightModal(false);
    setHighlightNote("");
    setHighlightPlayers([]);
    setHighlightDrill(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, padding: 12, background: THEME.blackLight, borderRadius: 6, border: `1px solid ${THEME.blue}` }}>
        <div style={{ color: THEME.blue, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"🏃"} Practice In Progress</div>
        <div style={{ color: THEME.gray, fontSize: 12 }}>Record attendance, drill tracking, and player observations as you go.</div>
      </div>

      {/* Date & Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15, marginBottom: 4 }}>
            {form.date ? new Date(form.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "No date set"}
          </div>
          {form.time && <div style={{ color: THEME.gray, fontSize: 13 }}>Time: {form.time}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: THEME.gray, fontSize: 13 }}>Duration: {form.duration}min</div>
          {form.focus && <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 600 }}>Focus: {form.focus}</div>}
        </div>
      </div>

      {/* Practice Agenda */}
      {form.drills && form.drills.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SL>{"📋"} Practice Agenda</SL>
          <div style={{ marginTop: 8, maxHeight: 300, overflowY: "auto", border: `1px solid ${THEME.charcoal}`, borderRadius: 6, padding: 8 }}>
            {form.drills.map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderBottom: i < form.drills.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: THEME.gray, fontSize: 11, fontWeight: 700, minWidth: 20 }}>#{i + 1}</span>
                    <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  </div>
                  {d.description && (
                    <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2, marginLeft: 26 }}>{d.description}</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <Badge>{d.duration}min</Badge>
                  <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{d.assignedCoach || d.coach}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, color: THEME.gray, fontSize: 11, textAlign: "right" }}>
            Total: {form.drills.reduce((sum, d) => sum + (d.duration || 0), 0)} minutes
          </div>
        </div>
      )}

      {/* Group Management for Station Rotations */}
      <div style={{ marginTop: 16 }}>
        <SL>{"🎨"} Station Groups (for rotations)</SL>
        <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 8 }}>
          Assign players to color groups for station rotations. Leave unassigned if doing whole-team drills.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {players.filter(p => (form.attendance || {})[p.id]).map(p => {
            const currentGroup = (form.groups || {})[p.id];
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600, minWidth: 100, flexShrink: 0 }}>
                  {p.name.split(" ")[0]}
                </span>
                <div style={{ display: "flex", gap: 4, flex: 1 }}>
                  {["red", "blue", "gold"].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        const newGroups = { ...(form.groups || {}) };
                        newGroups[p.id] = currentGroup === color ? null : color;
                        setForm({ ...form, groups: newGroups });
                      }}
                      style={{
                        flex: 1, padding: "6px 8px", borderRadius: 4,
                        border: `2px solid ${currentGroup === color ? GROUP_COLORS[color].border : THEME.charcoal}`,
                        background: currentGroup === color ? GROUP_COLORS[color].bg : THEME.black,
                        color: currentGroup === color ? GROUP_COLORS[color].text : THEME.gray,
                        cursor: "pointer", fontSize: 12,
                        fontWeight: currentGroup === color ? 700 : 400,
                        textTransform: "capitalize"
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Group Summary */}
        <div style={{ marginTop: 8, padding: 8, background: THEME.blackLight, borderRadius: 4, display: "flex", gap: 16, fontSize: 12 }}>
          {["red", "blue", "gold"].map(color => {
            const count = players.filter(p => (form.groups || {})[p.id] === color).length;
            const colorStyles = { red: "#e74c3c", blue: "#3498db", gold: "#fdb515" };
            return (
              <div key={color} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: colorStyles[color] }}></div>
                <span style={{ color: THEME.white, fontWeight: 600, textTransform: "capitalize" }}>{color}:</span>
                <span style={{ color: THEME.gray }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Station Rotation Manager */}
      {form.stationRotation && (
        <div style={{ marginTop: 16 }}>
          <SL>{"🔄"} Station Rotations</SL>
          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 8 }}>
            Assign groups to stations, then rotate them through. Round: {form.stationRotation.round}
          </div>
          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            {form.stationRotation.stations.map((station, idx) => {
              const currentGroup = station.currentGroup;
              return (
                <div key={station.id} style={{ padding: 12, background: THEME.black, borderRadius: 6, border: `1px solid ${THEME.charcoal}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700 }}>Station {station.id}</div>
                      <div style={{ color: THEME.gray, fontSize: 11 }}>{station.drillName}</div>
                    </div>
                    {currentGroup && (
                      <div style={{
                        padding: "4px 12px", borderRadius: 4,
                        background: GROUP_COLORS[currentGroup].bg,
                        border: `1px solid ${GROUP_COLORS[currentGroup].border}`,
                        color: GROUP_COLORS[currentGroup].text,
                        fontSize: 12, fontWeight: 700, textTransform: "capitalize"
                      }}>
                        {currentGroup} Group
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["red", "blue", "gold", null].map((color) => (
                      <button
                        key={color || "none"}
                        onClick={() => {
                          const newRotation = { ...form.stationRotation };
                          newRotation.stations[idx].currentGroup = color;
                          setForm({ ...form, stationRotation: newRotation });
                        }}
                        style={{
                          flex: 1, padding: "6px 8px", borderRadius: 4,
                          border: `2px solid ${currentGroup === color ? (color ? GROUP_COLORS[color].border : THEME.charcoal) : THEME.charcoal}`,
                          background: currentGroup === color ? (color ? GROUP_COLORS[color].bg : THEME.blackLight) : THEME.blackLight,
                          color: currentGroup === color ? (color ? GROUP_COLORS[color].text : THEME.white) : THEME.gray,
                          cursor: "pointer", fontSize: 11,
                          fontWeight: currentGroup === color ? 700 : 400,
                          textTransform: "capitalize"
                        }}
                      >
                        {color || "None"}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => {
              const newRotation = { ...form.stationRotation };
              const currentAssignments = newRotation.stations.map(s => s.currentGroup);
              newRotation.stations.forEach((station, idx) => {
                const prevIdx = idx === 0 ? newRotation.stations.length - 1 : idx - 1;
                station.currentGroup = currentAssignments[prevIdx];
              });
              newRotation.round += 1;
              setForm({ ...form, stationRotation: newRotation });
            }}
            style={{ width: "100%" }}
          >
            {"🔄"} Rotate Groups to Next Station
          </Button>
        </div>
      )}

      {/* Attendance */}
      <div style={{ marginTop: 16 }}>
        <SL>Attendance (mark who showed up)</SL>
        <ToggleChips
          players={players}
          selected={form.attendance || {}}
          onToggle={id => setForm({ ...form, attendance: { ...(form.attendance || {}), [id]: !(form.attendance || {})[id] } })}
        />
      </div>

      {/* Quick Observations */}
      <div style={{ marginTop: 16 }}>
        <SL>Quick Observations (one per player)</SL>
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {players.filter(p => (form.attendance || {})[p.id]).map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ color: THEME.white, fontSize: 12, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>
                {p.name.split(" ")[0]}
              </span>
              <input
                value={(form.observations || {})[p.id] || ""}
                onChange={e => setForm({ ...form, observations: { ...(form.observations || {}), [p.id]: e.target.value } })}
                placeholder="One thing you noticed..."
                style={{
                  flex: 1, padding: "6px 8px", background: THEME.black,
                  border: `1px solid ${THEME.charcoal}`, borderRadius: 4,
                  color: THEME.white, fontSize: 12, outline: "none"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Drill Tracking Section */}
      {(() => {
        const trackableDrills = (form.drills || []).filter(d => TRACKABLE_DRILLS[d.id]);
        if (trackableDrills.length === 0) return null;

        const hasStationDrills = trackableDrills.some(d => d.station);

        return (
          <div style={{ marginTop: 16 }}>
            <SL>{"📊"} Drill Tracking</SL>

            {/* Group Filter for Station Drills */}
            {hasStationDrills && Object.values(form.groups || {}).some(g => g) && (
              <div style={{ marginTop: 8, marginBottom: 12, padding: 10, background: THEME.blackLight, borderRadius: 6 }}>
                <div style={{ color: THEME.white, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>Which group are you tracking?</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["red", "blue", "gold", null].map(color => {
                    const isSelected = trackingGroup === color;
                    const colorStyle = color ? GROUP_COLORS[color] : null;
                    return (
                      <button
                        key={color || "all"}
                        onClick={() => setTrackingGroup(color)}
                        style={{
                          flex: 1, padding: "8px 12px", borderRadius: 4,
                          border: `2px solid ${isSelected ? (colorStyle ? colorStyle.border : THEME.gold) : THEME.charcoal}`,
                          background: isSelected ? (colorStyle ? colorStyle.bg : "rgba(253,181,21,0.1)") : THEME.black,
                          color: isSelected ? (colorStyle ? colorStyle.text : THEME.gold) : THEME.gray,
                          cursor: "pointer", fontSize: 12,
                          fontWeight: isSelected ? 700 : 400,
                          textTransform: "capitalize"
                        }}
                      >
                        {color || "All Players"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 8, display: "grid", gap: 12 }}>
              {trackableDrills.map(drill => {
                const tracking = (form.drillTracking || {})[drill.id] || {};

                const getFilteredPlayers = () => {
                  let filtered = players.filter(p => (form.attendance || {})[p.id]);
                  if (trackingGroup && drill.station) {
                    filtered = filtered.filter(p => (form.groups || {})[p.id] === trackingGroup);
                  }
                  return filtered;
                };

                const filteredPlayers = getFilteredPlayers();

                // ── b1: Home to First Sprint - Stopwatch ──
                if (drill.id === "b1") {
                  const times = tracking.times || [];
                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.blue}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700 }}>{"⏱️"} {drill.name}</div>
                        <Button small onClick={() => { setHighlightDrill(drill.id); setShowHighlightModal(true); }} style={{ background: "rgba(253,181,21,0.15)", color: THEME.gold, border: `1px solid ${THEME.gold}` }}>{"💡"} Highlight</Button>
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Time each player home-to-first</div>

                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 48, fontWeight: 700, color: stopwatchRunning ? THEME.gold : THEME.white, fontFamily: "monospace" }}>
                          {(stopwatchTime / 1000).toFixed(2)}
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                          {!stopwatchRunning ? (
                            <Button onClick={() => {
                              setStopwatchTime(0);
                              setStopwatchRunning(true);
                              stopwatchInterval.current = setInterval(() => { setStopwatchTime(t => t + 10); }, 10);
                            }}>
                              {"▶️"} Start
                            </Button>
                          ) : (
                            <Button onClick={() => {
                              setStopwatchRunning(false);
                              clearInterval(stopwatchInterval.current);
                            }} variant="danger">
                              {"⏸️"} Stop
                            </Button>
                          )}
                        </div>
                      </div>

                      {!stopwatchRunning && stopwatchTime > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6 }}>Save time for:</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                            {filteredPlayers.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  const newTimes = [...times, { playerId: p.id, playerName: p.name, time: stopwatchTime / 1000 }];
                                  setForm({
                                    ...form,
                                    drillTracking: { ...(form.drillTracking || {}), [drill.id]: { times: newTimes } }
                                  });
                                  setStopwatchTime(0);
                                }}
                                style={{ padding: "8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12 }}
                              >
                                {p.name.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {times.length > 0 && (
                        <div>
                          <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Results (fastest first):</div>
                          <div style={{ maxHeight: 200, overflowY: "auto" }}>
                            {times.sort((a, b) => a.time - b.time).map((t, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: idx === 0 ? "rgba(253,181,21,0.1)" : THEME.blackLight, borderRadius: 4, marginBottom: 4 }}>
                                <span style={{ color: THEME.white, fontSize: 12 }}>{idx === 0 && "\u2B50 "}{t.playerName.split(" ")[0]}</span>
                                <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontFamily: "monospace" }}>{t.time.toFixed(2)}s</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // ── f3: 21 Outs Drill - Team Counter ──
                if (drill.id === "f3") {
                  const count = tracking.count || 0;
                  const best = tracking.best || 0;
                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.green}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"🎯"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Consecutive outs without error</div>
                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 64, fontWeight: 700, color: THEME.green, fontFamily: "monospace" }}>{count}</div>
                        <div style={{ color: THEME.gray, fontSize: 13 }}>Best Today: <span style={{ color: THEME.gold, fontWeight: 600 }}>{best}</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button onClick={() => {
                          const newCount = count + 1;
                          const newBest = Math.max(newCount, best);
                          setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { count: newCount, best: newBest } } });
                        }} style={{ flex: 1 }}>
                          {"\u2713"} OUT (+1)
                        </Button>
                        <Button onClick={() => {
                          setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { count: 0, best } } });
                        }} variant="danger" style={{ flex: 1 }}>
                          {"\u2715"} ERROR (Reset)
                        </Button>
                      </div>
                    </div>
                  );
                }

                // ── p2: Pitch Location - Strike/Ball Counter ──
                if (drill.id === "p2") {
                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `1px solid ${THEME.charcoal}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"⚾"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Track strikes vs balls for each pitcher</div>
                      {filteredPlayers.map(p => {
                        const pData = tracking[p.id] || { strikes: 0, balls: 0 };
                        const total = pData.strikes + pData.balls;
                        const strikePercent = total > 0 ? ((pData.strikes / total) * 100).toFixed(0) : 0;
                        return (
                          <div key={p.id} style={{ marginBottom: 12, padding: 10, background: THEME.blackLight, borderRadius: 4 }}>
                            <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{p.name.split(" ")[0]}</div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                              <button
                                onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, [p.id]: { ...pData, strikes: pData.strikes + 1 } } } })}
                                style={{ flex: 1, padding: "10px", background: THEME.green, border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                              >
                                {"\u2713"} Strike
                              </button>
                              <button
                                onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, [p.id]: { ...pData, balls: pData.balls + 1 } } } })}
                                style={{ flex: 1, padding: "10px", background: THEME.red, border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                              >
                                {"\u2715"} Ball
                              </button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: THEME.gray }}>
                              <span>Strikes: {pData.strikes} | Balls: {pData.balls} | Total: {total}</span>
                              <span style={{ color: strikePercent >= 60 ? THEME.green : THEME.gray }}>{strikePercent}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // ── p3: Pitch Count - Counter per pitcher with weekly totals ──
                if (drill.id === "p3") {
                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `1px solid ${THEME.charcoal}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"⚾"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Track total pitch count per pitcher (weekly limit: 100 pitches)</div>
                      {filteredPlayers.filter(p => p.isPitcher).map(p => {
                        const count = tracking[p.id] || 0;
                        const weeklyData = getWeeklyPitchCounts(allPractices, p.id);
                        const projectedTotal = weeklyData.weeklyTotal + count;
                        const showWarning = projectedTotal >= 80;
                        const overLimit = projectedTotal > 100;
                        return (
                          <div key={p.id} style={{ marginBottom: 8 }}>
                            <div style={{ marginBottom: 4, padding: 10, background: THEME.blackLight, borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center", border: showWarning ? `2px solid ${overLimit ? THEME.red : THEME.gold}` : "none" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{p.name.split(" ")[0]}</div>
                                {weeklyData.lastPitched && (
                                  <div style={{ color: THEME.gray, fontSize: 10, marginTop: 2 }}>
                                    Last: {new Date(weeklyData.lastPitched).toLocaleDateString()} ({weeklyData.lastCount} pitches)
                                  </div>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, [p.id]: Math.max(0, count - 1) } } })} style={{ padding: "4px 10px", background: THEME.charcoal, border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 16 }}>{"\u2212"}</button>
                                <span style={{ color: THEME.gold, fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{count}</span>
                                <button onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, [p.id]: count + 1 } } })} style={{ padding: "4px 10px", background: THEME.gold, border: "none", borderRadius: 4, color: THEME.black, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
                              </div>
                            </div>
                            {showWarning && (
                              <div style={{ padding: "6px 10px", background: overLimit ? "rgba(231, 76, 60, 0.15)" : "rgba(253, 181, 21, 0.15)", borderRadius: 4, fontSize: 11 }}>
                                <span style={{ color: overLimit ? THEME.red : THEME.gold, fontWeight: 700 }}>
                                  {overLimit ? "\u26A0\uFE0F OVER LIMIT" : "\u26A0\uFE0F WARNING"}
                                </span>
                                <span style={{ color: THEME.gray, marginLeft: 8 }}>
                                  Weekly total: {weeklyData.weeklyTotal} + {count} today = {projectedTotal} pitches
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {filteredPlayers.filter(p => p.isPitcher).length === 0 && (
                        <div style={{ textAlign: "center", padding: 20, color: THEME.gray, fontSize: 12 }}>
                          No pitchers marked in roster. Mark players as pitchers in Roster tab.
                        </div>
                      )}
                    </div>
                  );
                }

                // ── h9: Points-Based Hitting ──
                if (drill.id === "h9") {
                  const swingsPerPlayer = tracking.swingsPerPlayer || 5;
                  const playerData = tracking.players || {};
                  const leaderboard = filteredPlayers
                    .filter(p => playerData[p.id])
                    .map(p => ({
                      name: p.name,
                      data: playerData[p.id],
                      total: (playerData[p.id].gb || 0) + (playerData[p.id].fb || 0) * 2 + (playerData[p.id].ld || 0) * 3,
                      swings: (playerData[p.id].gb || 0) + (playerData[p.id].fb || 0) + (playerData[p.id].ld || 0)
                    }))
                    .sort((a, b) => b.total - a.total);

                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.gold}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"🏆"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>GB=1pt | FB=2pts | LD=3pts</div>
                      {!tracking.started && (
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ color: THEME.white, fontSize: 12, display: "block", marginBottom: 4 }}>Swings per player:</label>
                          <input type="number" min="1" value={swingsPerPlayer} onChange={e => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, swingsPerPlayer: parseInt(e.target.value) || 5 } } })} style={{ padding: "6px 8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, fontSize: 13, width: 80 }} />
                          <Button onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, started: true } } })} style={{ marginLeft: 8 }}>Start Tracking</Button>
                        </div>
                      )}
                      {tracking.started && (
                        <>
                          {filteredPlayers.map(p => {
                            const pData = playerData[p.id] || { gb: 0, fb: 0, ld: 0 };
                            const swings = pData.gb + pData.fb + pData.ld;
                            return (
                              <div key={p.id} style={{ marginBottom: 8, padding: 10, background: THEME.blackLight, borderRadius: 4 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
                                  <span style={{ color: THEME.gray, fontSize: 11 }}>{swings} / {swingsPerPlayer} swings</span>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>
                                  {[["gb", "GB (+1)", "rgba(142,142,142,0.3)"], ["fb", "FB (+2)", "rgba(52,152,219,0.3)"], ["ld", "LD (+3)", "rgba(46,204,113,0.3)"]].map(([key, label, bg]) => (
                                    <button key={key} onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, players: { ...playerData, [p.id]: { ...pData, [key]: pData[key] + 1 } } } } })} style={{ flex: 1, padding: "8px", background: bg, border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{label}</button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                          {leaderboard.length > 0 && (
                            <div style={{ marginTop: 12, padding: 10, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                              <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{"🏆"} Leaderboard</div>
                              {leaderboard.map((entry, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: idx < leaderboard.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                                  <span style={{ color: THEME.white, fontSize: 12 }}>{idx === 0 ? "\uD83E\uDD47 " : idx === 1 ? "\uD83E\uDD48 " : idx === 2 ? "\uD83E\uDD49 " : `${idx + 1}. `}{entry.name.split(" ")[0]}</span>
                                  <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontWeight: 600 }}>{entry.total} pts</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                // ── h10: Bunt Stations ──
                if (drill.id === "h10") {
                  const attemptsPerPlayer = tracking.attemptsPerPlayer || 5;
                  const playerData = tracking.players || {};
                  const ZONES = [
                    { id: "1st", label: "1st Base Line", points: 2 },
                    { id: "middle", label: "Up the Middle", points: 1 },
                    { id: "3rd", label: "3rd Base Line", points: 2 },
                    { id: "foul", label: "Foul", points: 0 }
                  ];
                  const leaderboard = filteredPlayers
                    .filter(p => playerData[p.id])
                    .map(p => {
                      const bunts = playerData[p.id].bunts || [];
                      return { name: p.name, total: bunts.reduce((sum, b) => sum + b.points, 0), attempts: bunts.length };
                    })
                    .sort((a, b) => b.total - a.total);

                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.gold}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"🎯"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Tap where the bunt lands</div>
                      {!tracking.started && (
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ color: THEME.white, fontSize: 12, display: "block", marginBottom: 4 }}>Attempts per player:</label>
                          <input type="number" min="1" value={attemptsPerPlayer} onChange={e => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, attemptsPerPlayer: parseInt(e.target.value) || 5 } } })} style={{ padding: "6px 8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, fontSize: 13, width: 80 }} />
                          <Button onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, started: true, currentPlayer: null } } })} style={{ marginLeft: 8 }}>Start Tracking</Button>
                        </div>
                      )}
                      {tracking.started && (
                        <>
                          {!tracking.currentPlayer && (
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6 }}>Select player to track:</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                                {filteredPlayers.map(p => {
                                  const attempts = (playerData[p.id]?.bunts || []).length;
                                  return (
                                    <button key={p.id} onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, currentPlayer: p.id, currentPlayerName: p.name } } })} style={{ padding: "8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12 }}>
                                      {p.name.split(" ")[0]} ({attempts}/{attemptsPerPlayer})
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {tracking.currentPlayer && (
                            <div style={{ marginBottom: 12, padding: 12, background: THEME.blackLight, borderRadius: 4 }}>
                              <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                                {tracking.currentPlayerName?.split(" ")[0]} - Bunt #{(playerData[tracking.currentPlayer]?.bunts || []).length + 1}
                              </div>
                              <div style={{ display: "grid", gap: 6 }}>
                                {ZONES.map(zone => (
                                  <button
                                    key={zone.id}
                                    onClick={() => {
                                      const playerId = tracking.currentPlayer;
                                      const bunts = [...(playerData[playerId]?.bunts || []), { zone: zone.id, points: zone.points }];
                                      setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, players: { ...playerData, [playerId]: { bunts } }, currentPlayer: null, currentPlayerName: null } } });
                                    }}
                                    style={{
                                      padding: "12px",
                                      background: zone.points === 2 ? "rgba(46,204,113,0.2)" : zone.points === 1 ? "rgba(52,152,219,0.2)" : "rgba(142,142,142,0.2)",
                                      border: `2px solid ${zone.points === 2 ? THEME.green : zone.points === 1 ? THEME.blue : THEME.gray}`,
                                      borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 13, fontWeight: 600
                                    }}
                                  >
                                    {zone.label} ({zone.points} pts)
                                  </button>
                                ))}
                              </div>
                              <Button variant="ghost" onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, currentPlayer: null, currentPlayerName: null } } })} style={{ marginTop: 8, width: "100%" }}>Cancel</Button>
                            </div>
                          )}
                          {leaderboard.length > 0 && (
                            <div style={{ marginTop: 12, padding: 10, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                              <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{"🏆"} Leaderboard</div>
                              {leaderboard.map((entry, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: idx < leaderboard.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                                  <span style={{ color: THEME.white, fontSize: 12 }}>{idx === 0 ? "\uD83E\uDD47 " : idx === 1 ? "\uD83E\uDD48 " : idx === 2 ? "\uD83E\uDD49 " : `${idx + 1}. `}{entry.name.split(" ")[0]}</span>
                                  <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontWeight: 600 }}>{entry.total} pts</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                // ── h11: Batting Queen ──
                if (drill.id === "h11") {
                  const LEVELS = [
                    { id: 1, name: "Make Contact", desc: "Just hit the ball" },
                    { id: 2, name: "Fair Ball", desc: "Stay in fair territory" },
                    { id: 3, name: "Past Pitcher", desc: "Get it past the pitcher" },
                    { id: 4, name: "Past Pitcher (Air)", desc: "Past pitcher in the air" },
                    { id: 5, name: "Only Grass", desc: "Touch only grass, no dirt" },
                    { id: 6, name: "Furthest Hit", desc: "Furthest ball wins" }
                  ];
                  const playerStatus = tracking.playerStatus || {};
                  const started = tracking.started || false;
                  const currentLevel = tracking.currentLevel || 1;
                  const activePlayers = filteredPlayers.filter(p => (!playerStatus[p.id] || playerStatus[p.id].eliminated === false || playerStatus[p.id].eliminatedAt >= currentLevel));
                  const eliminatedPlayers = filteredPlayers.filter(p => playerStatus[p.id]?.eliminated && playerStatus[p.id].eliminatedAt < currentLevel);

                  return (
                    <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.gold}` }}>
                      <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"👑"} {drill.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Single elimination - 6 levels of difficulty</div>
                      {!started && (
                        <Button onClick={() => {
                          const initialStatus = {};
                          filteredPlayers.forEach(p => { initialStatus[p.id] = { eliminated: false, eliminatedAt: null, level: 1 }; });
                          setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { started: true, currentLevel: 1, playerStatus: initialStatus } } });
                        }}>Start Competition</Button>
                      )}
                      {started && (
                        <>
                          <div style={{ marginBottom: 12, padding: 12, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                            <div style={{ color: THEME.gold, fontSize: 16, fontWeight: 700 }}>Level {currentLevel}: {LEVELS[currentLevel - 1].name}</div>
                            <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>{LEVELS[currentLevel - 1].desc}</div>
                            <div style={{ color: THEME.white, fontSize: 12, marginTop: 6 }}>{activePlayers.length} player{activePlayers.length !== 1 ? "s" : ""} remaining</div>
                          </div>
                          {activePlayers.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Mark eliminated players:</div>
                              <div style={{ display: "grid", gap: 4 }}>
                                {activePlayers.map(p => {
                                  const isEliminated = playerStatus[p.id]?.eliminated && playerStatus[p.id]?.eliminatedAt === currentLevel;
                                  return (
                                    <button
                                      key={p.id}
                                      onClick={() => {
                                        if (isEliminated) {
                                          setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, playerStatus: { ...playerStatus, [p.id]: { eliminated: false, eliminatedAt: null, level: currentLevel } } } } });
                                        } else {
                                          setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, playerStatus: { ...playerStatus, [p.id]: { eliminated: true, eliminatedAt: currentLevel, level: currentLevel } } } } });
                                        }
                                      }}
                                      style={{
                                        padding: "10px", background: isEliminated ? "rgba(231,76,60,0.2)" : THEME.blackLight,
                                        border: `2px solid ${isEliminated ? THEME.red : THEME.charcoal}`, borderRadius: 4,
                                        color: THEME.white, cursor: "pointer", fontSize: 13, textAlign: "left",
                                        display: "flex", justifyContent: "space-between", alignItems: "center"
                                      }}
                                    >
                                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        {isEliminated && <span style={{ color: THEME.red, fontSize: 16 }}>{"\u274C"}</span>}
                                        <span style={{ textDecoration: isEliminated ? "line-through" : "none" }}>{p.name.split(" ")[0]}</span>
                                      </span>
                                      <span style={{ color: isEliminated ? THEME.green : THEME.red, fontSize: 11 }}>
                                        {isEliminated ? "Tap to undo" : "Tap to eliminate \u2192"}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            {currentLevel < 6 && activePlayers.length > 0 && (
                              <Button onClick={() => setForm({ ...form, drillTracking: { ...(form.drillTracking || {}), [drill.id]: { ...tracking, currentLevel: currentLevel + 1 } } })} style={{ flex: 1 }}>
                                Next Level {"\u2192"}
                              </Button>
                            )}
                            {currentLevel === 6 && activePlayers.length === 1 && (
                              <div style={{ flex: 1, padding: 12, background: "rgba(253,181,21,0.2)", borderRadius: 4, textAlign: "center" }}>
                                <div style={{ color: THEME.gold, fontSize: 18, fontWeight: 700 }}>{"👑"} {activePlayers[0].name.split(" ")[0]} WINS!</div>
                              </div>
                            )}
                          </div>
                          {eliminatedPlayers.length > 0 && (
                            <div style={{ padding: 10, background: THEME.blackLight, borderRadius: 4 }}>
                              <div style={{ color: THEME.gray, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Eliminated:</div>
                              {LEVELS.map(level => {
                                const atThisLevel = eliminatedPlayers.filter(p => playerStatus[p.id].eliminatedAt === level.id);
                                if (atThisLevel.length === 0) return null;
                                return (
                                  <div key={level.id} style={{ marginBottom: 4 }}>
                                    <span style={{ color: THEME.gray, fontSize: 11 }}>Level {level.id}: </span>
                                    <span style={{ color: THEME.white, fontSize: 11 }}>{atThisLevel.map(p => p.name.split(" ")[0]).join(", ")}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                // ── Fallback for other trackable drills ──
                const config = TRACKABLE_DRILLS[drill.id];
                return (
                  <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `1px solid ${THEME.charcoal}` }}>
                    <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{drill.name}</div>
                    <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 8 }}>{config.description}</div>
                    <div style={{ color: THEME.gray, fontSize: 11, fontStyle: "italic" }}>Basic tracking interface</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Highlight Modal */}
      <Modal
        open={showHighlightModal}
        onClose={() => { setShowHighlightModal(false); setHighlightNote(""); setHighlightPlayers([]); setHighlightDrill(null); }}
        title={"💡 Add Practice Highlight"}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", color: THEME.white, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Note *</label>
            <textarea
              value={highlightNote}
              onChange={(e) => setHighlightNote(e.target.value)}
              placeholder="e.g., Jessica had her fastest sprint yet!"
              rows={3}
              style={{ width: "100%", padding: "10px 12px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
          <div>
            <label style={{ display: "block", color: THEME.white, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Tag Players (Optional)</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
              {players.filter(p => form.attendance?.[p.id]).map(player => {
                const isSelected = highlightPlayers.includes(player.id);
                return (
                  <button
                    key={player.id}
                    onClick={() => {
                      if (isSelected) setHighlightPlayers(highlightPlayers.filter(id => id !== player.id));
                      else setHighlightPlayers([...highlightPlayers, player.id]);
                    }}
                    style={{
                      padding: "8px 12px",
                      background: isSelected ? THEME.gold : THEME.blackLight,
                      color: isSelected ? THEME.black : THEME.white,
                      border: `1px solid ${isSelected ? THEME.gold : THEME.charcoal}`,
                      borderRadius: 6, cursor: "pointer", fontSize: 12,
                      fontWeight: isSelected ? 700 : 400, transition: "all 0.2s"
                    }}
                  >
                    {player.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button variant="ghost" onClick={() => { setShowHighlightModal(false); setHighlightNote(""); setHighlightPlayers([]); setHighlightDrill(null); }}>Cancel</Button>
            <Button onClick={saveHighlight} style={{ background: THEME.gold }}>Save Highlight</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivePractice;
