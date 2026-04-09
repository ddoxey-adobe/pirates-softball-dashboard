/**
 * DrillPicker — Drill library browser and template loader for practice planning.
 *
 * Extracted from the PracticeLog component in App.jsx.
 * Handles browsing the full drill catalog, filtering by category,
 * expanding drill descriptions, and loading practice templates.
 */
import { useState } from "react";
import THEME from "../../data/theme";
import { DRILL_LIBRARY, PRACTICE_TEMPLATES } from "../../data/drills";
import { Badge, Button, SL } from "../../shared/components";

const DrillPicker = ({ form, setForm, coaches, expandedDrill, setExpandedDrill }) => {
  const [df, setDf] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const cats = ["all", ...new Set(DRILL_LIBRARY.map(d => d.category))];
  const fd = df === "all" ? DRILL_LIBRARY : DRILL_LIBRARY.filter(d => d.category === df);

  const loadTemplate = (tmpl) => {
    const allDrills = tmpl.phases.flatMap(phase =>
      phase.drills.map(d => ({ ...d, phase: phase.name, phaseType: phase.type, station: d.station || null }))
    );
    setForm({ ...form, focus: tmpl.focus, duration: tmpl.duration, drills: allDrills, notes: tmpl.description });
    setShowTemplates(false);
  };

  return (
    <div>
      {/* Template Loader */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{
            background: "none", border: `1px solid ${THEME.gold}`, color: THEME.gold,
            padding: "8px 16px", borderRadius: 6, cursor: "pointer",
            fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700,
            textTransform: "uppercase", width: "100%"
          }}
        >
          {showTemplates ? "Hide Templates" : "Load a Practice Template"}
        </button>
        {showTemplates && (
          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {PRACTICE_TEMPLATES.map(tmpl => (
              <div key={tmpl.id} style={{ padding: "12px 14px", background: THEME.black, borderRadius: 6, border: `1px solid ${THEME.charcoal}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: THEME.gold, fontSize: 14 }}>{tmpl.name}</div>
                    <div style={{ color: THEME.gray, fontSize: 12, marginTop: 2 }}>{tmpl.description}</div>
                  </div>
                  <Button small onClick={() => loadTemplate(tmpl)}>Load</Button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {tmpl.phases.map((phase, pi) => (
                    <div key={pi} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ color: phase.type === "stations" ? THEME.gold : THEME.white, fontSize: 12, fontWeight: 700, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>{phase.name}</span>
                        <span style={{ color: THEME.gray, fontSize: 11 }}>({phase.time})</span>
                        {phase.type === "stations" && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">3 Stations</Badge>}
                      </div>
                      {phase.drills.map((d, di) => (
                        <div key={di} style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12, marginBottom: 2 }}>
                          {d.station && <span style={{ color: THEME.gold, fontWeight: 700, fontSize: 11, fontFamily: "'Oswald',sans-serif", background: "rgba(253,181,21,0.15)", padding: "1px 6px", borderRadius: 3 }}>Station {d.station}</span>}
                          <span style={{ color: THEME.gray, fontSize: 12 }}>{d.name}</span>
                          <span style={{ color: THEME.blue, fontSize: 10 }}>({d.assignedCoach})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drill Plan List (selected drills) */}
      {(form.drills?.length || 0) > 0 && (
        <div style={{ marginBottom: 12 }}>
          {(() => {
            let lastPhase = "";
            return (form.drills || []).map((d, i) => {
              const showPhaseHeader = d.phase && d.phase !== lastPhase;
              if (d.phase) lastPhase = d.phase;
              return (
                <div key={i}>
                  {showPhaseHeader && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0 4px 0", marginTop: i > 0 ? 8 : 0 }}>
                      <span style={{ color: d.phaseType === "stations" ? THEME.gold : THEME.white, fontSize: 12, fontWeight: 700, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>{d.phase}</span>
                      {d.phaseType === "stations" && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">3 Groups Rotate</Badge>}
                    </div>
                  )}
                  <div style={{ background: THEME.black, borderRadius: 6, marginBottom: 3, overflow: "hidden", borderLeft: d.station ? `3px solid ${THEME.gold}` : "3px solid transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, cursor: "pointer" }} onClick={() => setExpandedDrill(expandedDrill === `plan-${i}` ? null : `plan-${i}`)}>
                          {d.station && <span style={{ color: THEME.gold, fontWeight: 700, fontSize: 11, fontFamily: "'Oswald',sans-serif", background: "rgba(253,181,21,0.15)", padding: "2px 7px", borderRadius: 3 }}>{d.station}</span>}
                          <span style={{ color: THEME.white, fontSize: 13 }}>{d.name}</span>
                          <Badge>{d.duration}min</Badge>
                          <span style={{ color: THEME.gray, fontSize: 10 }}>{expandedDrill === `plan-${i}` ? "\u25B2" : "\u25BC"}</span>
                        </div>
                        <select
                          value={d.assignedCoach || d.coach || "Any"}
                          onChange={(e) => {
                            e.stopPropagation();
                            const arr = [...(form.drills || [])];
                            arr[i] = { ...arr[i], assignedCoach: e.target.value };
                            setForm({ ...form, drills: arr });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "4px 8px", background: THEME.black,
                            border: `1px solid ${THEME.blue}40`, borderRadius: 4,
                            color: THEME.blue, fontSize: 11, fontWeight: 700,
                            fontFamily: "'Oswald',sans-serif", textTransform: "uppercase",
                            cursor: "pointer", outline: "none"
                          }}
                        >
                          <option value="Any">Any</option>
                          <option value="All">All</option>
                          {coaches.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <button disabled={i === 0} onClick={() => { const arr = [...(form.drills || [])]; [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; setForm({ ...form, drills: arr }); }} style={{ background: "none", border: "none", color: i === 0 ? THEME.charcoal : THEME.gold, cursor: i === 0 ? "default" : "pointer", fontSize: 14, padding: "2px" }}>{"\u25B2"}</button>
                        <button disabled={i === (form.drills?.length || 0) - 1} onClick={() => { const arr = [...(form.drills || [])]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setForm({ ...form, drills: arr }); }} style={{ background: "none", border: "none", color: i === (form.drills?.length || 0) - 1 ? THEME.charcoal : THEME.gold, cursor: i === (form.drills?.length || 0) - 1 ? "default" : "pointer", fontSize: 14, padding: "2px" }}>{"\u25BC"}</button>
                        <button onClick={() => setForm({ ...form, drills: (form.drills || []).filter((_, idx) => idx !== i) })} style={{ background: "none", border: "none", color: THEME.red, cursor: "pointer", fontSize: 16, padding: "2px" }}>{"\u2715"}</button>
                      </div>
                    </div>
                    {expandedDrill === `plan-${i}` && (
                      <div style={{ padding: "0 10px 10px 38px", color: THEME.gray, fontSize: 12, lineHeight: 1.5 }}>
                        {d.description}
                        {d.notes && <div style={{ color: THEME.goldDim, marginTop: 4 }}>Note: {d.notes}</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Drill Library Browser */}
      <SL>Add Drills</SL>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setDf(c)} style={{
            padding: "3px 8px", fontSize: 11, borderRadius: 4, cursor: "pointer",
            background: df === c ? THEME.gold : THEME.black,
            color: df === c ? THEME.black : THEME.gray,
            border: `1px solid ${df === c ? THEME.gold : THEME.charcoal}`,
            fontWeight: 700, textTransform: "capitalize"
          }}>{c}</button>
        ))}
      </div>
      <div style={{ maxHeight: 250, overflowY: "auto", border: `1px solid ${THEME.charcoal}`, borderRadius: 6 }}>
        {fd.map(d => (
          <div key={d.id} style={{ borderBottom: `1px solid ${THEME.charcoal}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpandedDrill(expandedDrill === d.id ? null : d.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  <Badge>{d.duration}min</Badge>
                  <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{d.coach}</Badge>
                </div>
              </div>
              <button onClick={() => setForm({ ...form, drills: [...(form.drills || []), { ...d, assignedCoach: d.coach }] })} style={{ background: THEME.gold, border: "none", color: THEME.black, width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>+</button>
            </div>
            {expandedDrill === d.id && (
              <div style={{ padding: "0 10px 10px 10px", color: THEME.gray, fontSize: 12, lineHeight: 1.5 }}>{d.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrillPicker;
