/**
 * PracticeLog — Completed practice review and editing.
 *
 * Extracted from the PracticeLog component in App.jsx.
 * Handles the "complete" mode UI: attendance review, observation display,
 * drill metrics summary, practice highlights, and coach notes.
 */
import THEME from "../../data/theme";
import { DRILL_LIBRARY, TRACKABLE_DRILLS } from "../../data/drills";
import { SL, TextArea } from "../../shared/components";

const PracticeLog = ({ form, setForm, players }) => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, padding: 12, background: THEME.blackLight, borderRadius: 6, border: `1px solid ${THEME.green}` }}>
        <div style={{ color: THEME.green, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{"\u2705"} Review & Complete</div>
        <div style={{ color: THEME.gray, fontSize: 12 }}>Review your data and add final coach notes before marking complete.</div>
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

      {/* Attendance Summary */}
      <div style={{ marginTop: 16 }}>
        <SL>Attendance</SL>
        <div style={{ color: THEME.white, fontSize: 13 }}>
          {players.filter(p => (form.attendance || {})[p.id]).map(p => p.name.split(" ")[0]).join(", ") || "No attendance recorded"}
        </div>
      </div>

      {/* Player Observations */}
      <div style={{ marginTop: 16 }}>
        <SL>Player Observations</SL>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {players.filter(p => (form.attendance || {})[p.id] && (form.observations || {})[p.id]).map(p => (
            <div key={p.id} style={{ padding: "4px 0", borderBottom: `1px solid ${THEME.charcoal}`, fontSize: 12 }}>
              <span style={{ color: THEME.white, fontWeight: 600 }}>{p.name.split(" ")[0]}:</span>{" "}
              <span style={{ color: THEME.gray }}>{(form.observations || {})[p.id]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drill Tracking Summary */}
      {(() => {
        const trackableDrills = (form.drills || []).filter(d => TRACKABLE_DRILLS[d.id]);
        if (trackableDrills.length === 0 || !form.drillTracking) return null;

        return (
          <div style={{ marginTop: 16 }}>
            <SL>{"📊"} Drill Metrics Summary</SL>
            <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
              {trackableDrills.map(drill => {
                const config = TRACKABLE_DRILLS[drill.id];
                const tracking = (form.drillTracking || {})[drill.id];
                if (!tracking) return null;

                return (
                  <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 10, border: `1px solid ${THEME.charcoal}` }}>
                    <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{drill.name}</div>
                    {config.perPlayer ? (
                      <div style={{ fontSize: 11, color: THEME.gray, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {players.filter(p => (form.attendance || {})[p.id] && tracking[p.id]).map(p => {
                          const value = tracking[p.id];
                          let displayValue = "";
                          if (config.type === "strikes-balls") {
                            displayValue = `${value.strikes || 0}/${value.balls || 0}`;
                          } else if (config.type === "time") {
                            displayValue = `${value}s`;
                          } else if (config.type === "level") {
                            displayValue = `Lvl ${value}`;
                          } else {
                            displayValue = `${value} pts`;
                          }
                          return (
                            <span key={p.id}>
                              {p.name.split(" ")[0]}: <span style={{ color: THEME.white }}>{displayValue}</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: THEME.white }}>Team: {tracking} consecutive outs</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Practice Highlights */}
      {form.highlights && form.highlights.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SL>{"💡"} Practice Highlights</SL>
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            {form.highlights.map((highlight, idx) => {
              const drill = DRILL_LIBRARY.find(d => d.id === highlight.drillId);
              const taggedPlayers = (highlight.playersTagged || []).map(id => players.find(p => p.id === id)).filter(Boolean);
              return (
                <div key={idx} style={{ background: "rgba(253,181,21,0.05)", borderRadius: 6, padding: 12, border: "1px solid rgba(253,181,21,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ color: THEME.gold, fontSize: 12, fontWeight: 700 }}>{drill ? drill.name : "General Note"}</div>
                    <div style={{ color: THEME.gray, fontSize: 10 }}>{new Date(highlight.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div style={{ color: THEME.white, fontSize: 13, marginBottom: taggedPlayers.length > 0 ? 6 : 0 }}>{highlight.note}</div>
                  {taggedPlayers.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {taggedPlayers.map(p => (
                        <span key={p.id} style={{ background: THEME.gold, color: THEME.black, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{p.name.split(" ")[0]}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coach Notes */}
      <TextArea
        label="Coach Notes"
        value={form.coachNotes || ""}
        onChange={e => setForm({ ...form, coachNotes: e.target.value })}
        style={{ marginTop: 16 }}
        placeholder="What went well, what to work on..."
      />
    </div>
  );
};

export default PracticeLog;
