/**
 * PracticePanel — Main container for the Practice module.
 *
 * Extracted from the PracticeLog component in App.jsx (lines 1303-3218).
 * Orchestrates three modes:
 *   - Plan: Create/edit practice plans with DrillPicker
 *   - Active: Record live data during practice with ActivePractice
 *   - Complete: Review and finalize with PracticeLog
 *
 * Handles its own localStorage persistence via window.storage for practice data.
 */
import { useState, useEffect } from "react";
import THEME from "../../data/theme";
import { DRILL_LIBRARY, TRACKABLE_DRILLS } from "../../data/drills";
import { Badge, Button, Card, Input, TextArea, SL, Modal } from "../../shared/components";
import DrillPicker from "./DrillPicker";
import ActivePractice from "./ActivePractice";
import PracticeLog from "./PracticeLog";

// ── Storage Helpers ─────────────────────────────────────────────
const STORAGE_KEY = "pirates-practices-unified-2026v1";
const OLD_KEYS = {
  PRACTICES: "pirates-practices-2026v3",
  PRACTICELOGS: "pirates-practicelogs-2026v1",
};

const loadStore = async (key, fb) => {
  try {
    if (window.storage) {
      const r = await window.storage.get(key);
      return r?.value ? JSON.parse(r.value) : fb;
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fb;
  } catch { return fb; }
};
const saveStore = async (key, d) => {
  try {
    if (window.storage) {
      await window.storage.set(key, JSON.stringify(d));
    } else {
      localStorage.setItem(key, JSON.stringify(d));
    }
  } catch {}
};

// ── PracticePanel Component ─────────────────────────────────────
const PracticePanel = ({ players = [], coaches = [] }) => {
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("plan"); // "plan", "active", or "complete"
  const [form, setForm] = useState({});
  const [ed, setEd] = useState(null);
  const [exp, setExp] = useState(null);
  const [expandedDrill, setExpandedDrill] = useState(null);

  // ── Empty form factories ──
  const emptyPlan = () => ({
    id: "", date: "", time: "", duration: 120, focus: "", drills: [], notes: "", status: "planned",
    attendance: players.reduce((a, p) => ({ ...a, [p.id]: true }), {}),
    groups: {}
  });

  const emptyActive = (practice) => {
    const trackableDrillsInPractice = (practice.drills || []).filter(d => TRACKABLE_DRILLS[d.id]);
    const drillTracking = {};
    trackableDrillsInPractice.forEach(drill => {
      const config = TRACKABLE_DRILLS[drill.id];
      if (config.perPlayer) {
        drillTracking[drill.id] = players.filter(p => practice.attendance?.[p.id]).reduce((acc, p) => ({
          ...acc,
          [p.id]: config.type === "strikes-balls" ? { strikes: 0, balls: 0 } : ""
        }), {});
      } else {
        drillTracking[drill.id] = "";
      }
    });

    const stationDrills = (practice.drills || []).filter(d => d.station);
    const stationRotation = stationDrills.length > 0 ? {
      stations: stationDrills.map(d => ({
        id: d.station, drillId: d.id, drillName: d.name, currentGroup: null
      })),
      round: 1,
      active: false
    } : null;

    return {
      ...practice,
      status: "active",
      drillTracking: drillTracking,
      observations: players.reduce((a, p) => ({ ...a, [p.id]: "" }), {}),
      groups: practice.groups || {},
      stationRotation: practice.stationRotation || stationRotation,
      highlights: []
    };
  };

  const emptyComplete = (practice) => ({
    ...practice,
    status: "completed",
    drillsRun: practice.drills?.map(d => d.name).join(", ") || "",
    coachNotes: practice.coachNotes || ""
  });

  // ── Data Loading & Persistence ──
  useEffect(() => {
    const migrate = async () => {
      const oldPlans = await loadStore(OLD_KEYS.PRACTICES, []);
      const oldLogs = await loadStore(OLD_KEYS.PRACTICELOGS, []);
      const unified = await loadStore(STORAGE_KEY, []);

      if (unified.length === 0 && (oldPlans.length > 0 || oldLogs.length > 0)) {
        const migrated = [
          ...oldPlans.map(p => ({ ...p, status: "planned" })),
          ...oldLogs.map(l => ({ ...l, status: "completed", drills: [] }))
        ];
        setList(migrated);
        saveStore(STORAGE_KEY, migrated);
      } else {
        setList(unified);
      }
      setLoaded(true);
    };
    migrate();
  }, []);

  useEffect(() => { if (loaded) saveStore(STORAGE_KEY, list); }, [list, loaded]);

  // ── Computed Lists ──
  const planned = list.filter(p => p.status === "planned").sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const active = list.filter(p => p.status === "active").sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const completed = list.filter(p => p.status === "completed").sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const tt = form.drills?.reduce((s, d) => s + d.duration, 0) || 0;

  // ── Actions ──
  const save = () => {
    if (ed) setList(p => p.map(x => x.id === ed ? { ...form } : x));
    else setList(p => [...p, { ...form, id: Date.now().toString() }]);
    setShow(false);
    setEd(null);
    setMode("plan");
  };

  const startPractice = (practice) => {
    try {
      const activeForm = emptyActive(practice);
      setForm(activeForm);
      setEd(practice.id);
      setMode("active");
      setShow(true);
    } catch (error) {
      console.error("Error starting practice:", error);
      alert("Error starting practice: " + error.message);
    }
  };

  const finishPractice = (practice) => {
    setForm(emptyComplete(practice));
    setEd(practice.id);
    setMode("complete");
    setShow(true);
  };

  // ── Render ──
  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ color: THEME.gray, margin: 0, fontSize: 13 }}>
          {list.length} practice{list.length !== 1 ? "s" : ""} ({planned.length} planned, {active.length} active, {completed.length} completed)
        </p>
        <Button onClick={() => { setForm(emptyPlan()); setEd(null); setMode("plan"); setShow(true); }}>+ Plan Practice</Button>
      </div>

      {/* Empty State */}
      {list.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{"📋"}</div>
          <p style={{ color: THEME.gray, margin: 0 }}>No practices yet. Plan your first practice!</p>
        </Card>
      ) : (
        <div>
          {/* ── Planned Practices ── */}
          {planned.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: THEME.gold, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>{"📅"} Upcoming & Planned</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {planned.map(p => (
                  <Card key={p.id} style={{ padding: 14, cursor: "pointer", border: `1px solid ${THEME.gold}40` }} onClick={() => setExp(exp === p.id ? null : p.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>
                          {p.date ? new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "TBD"}
                          {p.time && ` at ${p.time}`}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">PLANNED</Badge>
                          {p.duration && <Badge>{p.duration}min</Badge>}
                          {p.drills && p.drills.length > 0 && <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{p.drills.length} drills</Badge>}
                          {p.attendance && <Badge color={THEME.white} bg="rgba(255,255,255,0.1)">{Object.values(p.attendance).filter(Boolean).length} expected</Badge>}
                          {p.focus && <Badge color={THEME.green} bg="rgba(46,204,113,0.15)">{p.focus}</Badge>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <Button small onClick={e => { e.stopPropagation(); startPractice(p); }}>Start Practice</Button>
                        <Button small variant="ghost" onClick={e => { e.stopPropagation(); setForm({ ...p }); setEd(p.id); setMode("plan"); setShow(true); }}>Edit</Button>
                        <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice?")) setList(x => x.filter(q => q.id !== p.id)); }}>{"\u2715"}</Button>
                      </div>
                    </div>
                    {exp === p.id && (
                      <div style={{ marginTop: 12, borderTop: `1px solid ${THEME.charcoal}`, paddingTop: 12 }}>
                        {p.drills && p.drills.length > 0 && p.drills.map((d, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${THEME.charcoal}` }}>
                            <span style={{ color: THEME.white, fontSize: 13 }}>{d.name}</span>
                            <div style={{ display: "flex", gap: 4 }}>
                              <Badge>{d.duration}min</Badge>
                              <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{d.assignedCoach || d.coach}</Badge>
                            </div>
                          </div>
                        ))}
                        {p.attendance && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${THEME.charcoal}` }}>
                            <span style={{ color: THEME.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Expected: </span>
                            <span style={{ color: THEME.white, fontSize: 12 }}>
                              {players.filter(pl => p.attendance[pl.id]).map(pl => pl.name.split(" ")[0]).join(", ")}
                            </span>
                          </div>
                        )}
                        {p.notes && <p style={{ color: THEME.gray, fontSize: 12, marginTop: 8, fontStyle: "italic" }}>{p.notes}</p>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Active Practices ── */}
          {active.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: THEME.blue, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>{"🏃"} Active Practice</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {active.map(p => (
                  <Card key={p.id} style={{ padding: 14, cursor: "pointer", border: `2px solid ${THEME.blue}` }} onClick={() => setExp(exp === p.id ? null : p.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>
                          {p.date ? new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "TBD"}
                          {p.time && ` at ${p.time}`}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <Badge color={THEME.blue} bg="rgba(52,152,219,0.25)">IN PROGRESS</Badge>
                          {p.duration && <Badge>{p.duration}min</Badge>}
                          {p.drills && p.drills.length > 0 && <Badge color={THEME.white} bg="rgba(255,255,255,0.1)">{p.drills.length} drills</Badge>}
                          {p.focus && <Badge color={THEME.green} bg="rgba(46,204,113,0.15)">{p.focus}</Badge>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <Button small onClick={e => { e.stopPropagation(); setForm({ ...p }); setEd(p.id); setMode("active"); setShow(true); }}>Continue</Button>
                        <Button small variant="primary" onClick={e => { e.stopPropagation(); finishPractice(p); }}>Finish Practice</Button>
                        <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice?")) setList(x => x.filter(q => q.id !== p.id)); }}>{"\u2715"}</Button>
                      </div>
                    </div>
                    {exp === p.id && (
                      <div style={{ marginTop: 12, borderTop: `1px solid ${THEME.charcoal}`, paddingTop: 12 }}>
                        {p.drills && p.drills.length > 0 && p.drills.map((d, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${THEME.charcoal}` }}>
                            <span style={{ color: THEME.white, fontSize: 13 }}>{d.name}</span>
                            <div style={{ display: "flex", gap: 4 }}>
                              <Badge>{d.duration}min</Badge>
                              <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{d.assignedCoach || d.coach}</Badge>
                            </div>
                          </div>
                        ))}
                        {p.attendance && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${THEME.charcoal}` }}>
                            <span style={{ color: THEME.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Attending: </span>
                            <span style={{ color: THEME.white, fontSize: 12 }}>
                              {players.filter(pl => p.attendance[pl.id]).map(pl => pl.name.split(" ")[0]).join(", ")}
                            </span>
                          </div>
                        )}
                        {p.notes && <p style={{ color: THEME.gray, fontSize: 12, marginTop: 8, fontStyle: "italic" }}>{p.notes}</p>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Completed Practices ── */}
          {completed.length > 0 && (
            <div>
              <h3 style={{ color: THEME.green, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>{"\u2705"} Completed</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {completed.map(l => (
                  <Card key={l.id} style={{ padding: 14, cursor: "pointer" }} onClick={() => setExp(exp === l.id ? null : l.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>
                          {l.date ? new Date(l.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "No date"}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <Badge color={THEME.green} bg="rgba(46,204,113,0.15)">COMPLETED</Badge>
                          {l.focus && <Badge color={THEME.gray} bg="rgba(142,142,142,0.1)">{l.focus}</Badge>}
                          {l.attendance && <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{Object.values(l.attendance).filter(Boolean).length} attended</Badge>}
                          {l.drillTracking && Object.keys(l.drillTracking).some(drillId => {
                            const data = l.drillTracking[drillId];
                            return typeof data === "object" ? Object.keys(data).length > 0 : data !== "";
                          }) && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">{"📊"} Tracked</Badge>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <Button small variant="ghost" onClick={e => { e.stopPropagation(); setForm({ ...l }); setEd(l.id); setMode("complete"); setShow(true); }}>Edit</Button>
                        <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice log?")) setList(x => x.filter(q => q.id !== l.id)); }}>{"\u2715"}</Button>
                      </div>
                    </div>
                    {exp === l.id && (
                      <div style={{ marginTop: 12, borderTop: `1px solid ${THEME.charcoal}`, paddingTop: 12 }}>
                        {l.drillsRun && <p style={{ color: THEME.white, fontSize: 12, marginBottom: 8 }}>Drills: {l.drillsRun}</p>}
                        {l.attendance && players.filter(p => l.attendance[p.id]).map(p => {
                          const obs = l.observations?.[p.id];
                          if (!obs) return null;
                          return (
                            <div key={p.id} style={{ padding: "4px 0", borderBottom: `1px solid ${THEME.charcoal}`, fontSize: 12 }}>
                              <span style={{ color: THEME.white, fontWeight: 600 }}>{p.name}:</span>{" "}
                              <span style={{ color: THEME.gray, fontStyle: "italic" }}>{obs}</span>
                            </div>
                          );
                        })}

                        {/* Drill Tracking Data */}
                        {l.drillTracking && Object.keys(l.drillTracking).length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${THEME.charcoal}` }}>
                            <span style={{ color: THEME.gold, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{"📊"} Drill Metrics: </span>
                            {Object.entries(l.drillTracking).map(([drillId, data]) => {
                              const drill = DRILL_LIBRARY.find(d => d.id === drillId);
                              const config = TRACKABLE_DRILLS[drillId];
                              if (!drill || !config) return null;
                              return (
                                <div key={drillId} style={{ marginTop: 8, padding: "8px", background: THEME.blackLight, borderRadius: 4 }}>
                                  <div style={{ color: THEME.white, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{drill.name}</div>
                                  {config.perPlayer ? (
                                    <div style={{ fontSize: 11, color: THEME.gray }}>
                                      {players.filter(p => l.attendance?.[p.id] && data[p.id]).map(p => {
                                        const value = data[p.id];
                                        let displayValue = "";
                                        if (config.type === "strikes-balls") {
                                          displayValue = `${value.strikes || 0}/${value.balls || 0} (S/B)`;
                                        } else if (config.type === "time") {
                                          displayValue = `${value}s`;
                                        } else if (config.type === "level") {
                                          displayValue = `Level ${value}`;
                                        } else {
                                          displayValue = `${value} pts`;
                                        }
                                        return (
                                          <span key={p.id} style={{ marginRight: 12 }}>
                                            {p.name.split(" ")[0]}: <span style={{ color: THEME.white }}>{displayValue}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: 11, color: THEME.white }}>Team: {data} consecutive outs</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {l.coachNotes && <p style={{ color: THEME.gray, fontSize: 12, marginTop: 8, fontStyle: "italic" }}>Coach: {l.coachNotes}</p>}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal: Plan / Active / Complete ── */}
      <Modal
        open={show}
        onClose={() => { setShow(false); setEd(null); setMode("plan"); }}
        title={mode === "plan" ? (ed ? "Edit Practice Plan" : "Plan Practice") : mode === "active" ? "Active Practice - Record Data" : "Complete Practice"}
        wide
      >
        {mode === "plan" ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Input label="Date" type="date" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} />
              <Input label="Time" type="time" value={form.time || ""} onChange={e => setForm({ ...form, time: e.target.value })} />
              <Input label="Duration" type="number" value={form.duration || 120} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 120 })} />
            </div>
            <div style={{ marginTop: 12 }}>
              <Input label="Focus" value={form.focus || ""} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="Fundamentals, Hitting, Game Situations..." />
            </div>

            {/* Attendance */}
            <div style={{ marginTop: 16 }}>
              <SL>Expected Attendance</SL>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {players.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setForm({ ...form, attendance: { ...(form.attendance || {}), [p.id]: !(form.attendance || {})[p.id] } })}
                    style={{
                      padding: "6px 12px", borderRadius: 6,
                      border: `1px solid ${(form.attendance || {})[p.id] ? THEME.gold : THEME.charcoal}`,
                      background: (form.attendance || {})[p.id] ? "rgba(253,181,21,0.15)" : THEME.black,
                      color: (form.attendance || {})[p.id] ? THEME.gold : THEME.gray,
                      cursor: "pointer", fontSize: 13, fontWeight: 600
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Drill Plan with progress bar */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <SL>Practice Plan {"\u2014"} {tt}/{form.duration || 120}min</SL>
                <div style={{ width: 120, height: 6, background: THEME.charcoal, borderRadius: 3 }}>
                  <div style={{ width: `${Math.min(100, (tt / (form.duration || 120)) * 100)}%`, height: "100%", background: tt > (form.duration || 120) ? THEME.red : THEME.gold, borderRadius: 3 }} />
                </div>
              </div>

              <DrillPicker
                form={form}
                setForm={setForm}
                coaches={coaches}
                expandedDrill={expandedDrill}
                setExpandedDrill={setExpandedDrill}
              />
            </div>

            <TextArea label="Notes" value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ marginTop: 12 }} placeholder="General notes about this practice..." />
          </div>
        ) : mode === "active" ? (
          <ActivePractice
            form={form}
            setForm={setForm}
            players={players}
            allPractices={list}
          />
        ) : (
          <PracticeLog
            form={form}
            setForm={setForm}
            players={players}
          />
        )}

        {/* Modal Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button variant="ghost" onClick={() => { setShow(false); setEd(null); setMode("plan"); }}>
            {mode === "active" ? "Save & Close" : "Cancel"}
          </Button>
          <Button onClick={save}>
            {mode === "plan" ? (ed ? "Save Plan" : "Create Plan") : mode === "active" ? "Save Progress" : "Mark Complete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PracticePanel;
