// ═══════════════════════════════════════════════════════════════════════════
// TryoutsPanel.jsx — Pirates Softball Tryouts Evaluation Tool
// Drop-in component for the Pirates Softball Dashboard
// ═══════════════════════════════════════════════════════════════════════════

const TryoutsPanel = () => {
  const { useState, useEffect, useRef, useCallback } = React;

  // ─── FIREBASE CONFIG ────────────────────────────────────────────
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyB0yepEGh_xeuM49joy8U9rFRLN6GrrEmg",
    authDomain: "softball-tryouts-2026.firebaseapp.com",
    databaseURL: "https://softball-tryouts-2026-default-rtdb.firebaseio.com",
    projectId: "softball-tryouts-2026",
    storageBucket: "softball-tryouts-2026.firebasestorage.app",
    messagingSenderId: "37363330767",
    appId: "1:37363330767:web:ed23d7296042562b5251ba"
  };

  const LS_KEY = "pirates-tryouts-2026-v1";

  // ─── SCORING ENGINE DATA ────────────────────────────────────────
  const CATEGORIES = [
    { key: "hitting",      label: "Hitting",              sub: "Mechanics, contact, power",    max: 5 },
    { key: "gloveWork",    label: "Glove Work",           sub: "Footwork, soft hands",         max: 5 },
    { key: "throwing",     label: "Throwing",             sub: "Arm strength, accuracy",       max: 5 },
    { key: "hustle",       label: "Hustle",               sub: "Sprint through bag?",          max: 3 },
    { key: "attitude",     label: "Attitude",             sub: "Energy, body language",        max: 5 },
    { key: "coachability", label: "Coachability",         sub: "Applies feedback?",            max: 5 },
    { key: "pitching",     label: "Pitching (optional)",  sub: "Only if opted in",             max: 5 },
  ];

  const ANCHORS = {
    hitting:      { label: "Hitting (1-5)", anchors: [[5,"Hard contact, drives ball"],[4,"Solid contact"],[3,"Contact, lacks power"],[2,"Inconsistent"],[1,"Struggles"]] },
    gloveWork:    { label: "Glove Work (1-5)", anchors: [[5,"Clean, great footwork"],[4,"Mostly clean"],[3,"Adequate"],[2,"Inconsistent"],[1,"Needs fundamentals"]] },
    throwing:     { label: "Throwing (1-5)", anchors: [[5,"Strong, accurate"],[4,"Solid"],[3,"Gets there"],[2,"Weak/inaccurate"],[1,"Can't make throw"]] },
    hustle:       { label: "Hustle (1-3)", anchors: [[3,"Sprinted through"],[2,"Jogged"],[1,"Walked"]] },
    attitude:     { label: "Attitude (1-5)", anchors: [[5,"High energy, resilient"],[4,"Good energy"],[3,"Neutral"],[2,"Disengaged"],[1,"Poor sportsmanship"]] },
    coachability: { label: "Coachability (1-5)", anchors: [[5,"Applies feedback"],[4,"Tries to adjust"],[3,"Listens, doesn't apply"],[2,"Distracted"],[1,"Ignores"]] },
    pitching:     { label: "Pitching (1-5)", anchors: [[5,"Dominant control + speed"],[4,"Good control"],[3,"Gets it there"],[2,"Wild / slow"],[1,"Cannot pitch"]] },
  };

  const STATIONS = [
    { st: "Stn 1", name: "Hitting",    desc: "5-10 swings",    scoring: "Hitting (1-5)",                icon: "⚾" },
    { st: "Stn 2", name: "Run to 1st", desc: "Sprint",         scoring: "Time + Hustle (1-3)",          icon: "🏃" },
    { st: "Stn 3", name: "Fielding",   desc: "Grounder to 1st", scoring: "Glove (1-5) + Throw (1-5)",  icon: "🧤" },
    { st: "Stn 4", name: "Pitching",   desc: "3 pitches",      scoring: "Pitch (1-5) opt-in",           icon: "🔥" },
    { st: "All",   name: "Observe",    desc: "Whole tryout",   scoring: "Attitude (1-5) + Coach (1-5)", icon: "👀" },
  ];

  const TIER_SCALE = [
    { range: "80-100%", label: "High",     color: THEME.green },
    { range: "65-79%",  label: "Solid",    color: THEME.blue },
    { range: "50-64%",  label: "Dev",      color: "#F1C40F" },
    { range: "35-49%",  label: "Support",  color: "#E67E22" },
    { range: "0-34%",   label: "Emerging", color: THEME.red },
  ];

  const POS_WEIGHTS = {
    Pitcher:       { pitching:4, coachability:3, attitude:2, throwing:1, gloveWork:1 },
    Catcher:       { throwing:3, gloveWork:2, attitude:3, coachability:2, hitting:1, hustle:1 },
    Shortstop:     { gloveWork:3, throwing:3, hustle:2, attitude:1, coachability:1 },
    "Third Base":  { throwing:3, gloveWork:2, attitude:2, hitting:2, hustle:1 },
    "First Base":  { gloveWork:3, hitting:3, coachability:2, attitude:1 },
    "Second Base": { gloveWork:3, coachability:2, attitude:2, throwing:1, hustle:1 },
    Outfield:      { hustle:3, throwing:2, hitting:2, attitude:1, coachability:1 },
    Utility:       { coachability:3, attitude:3, gloveWork:2, hitting:1, hustle:1 },
  };

  const POSITION_URGENCY = {
    Pitcher:   ["High",     "#E67E22"],
    Catcher:   ["Critical", THEME.red],
    Shortstop: ["High",     "#E67E22"],
    Outfield:  ["High",     "#E67E22"],
  };

  const DEFAULT_EVALUATORS = ["Doxey", "Ken", "Shari"];

  const DEFAULT_PLAYERS = [
    {n:1,nm:"April Allen",pr:"",g:7,s:"Willowcreek"},{n:2,nm:"Zoey Assmus",pr:"PP-Wiscombe",g:7,s:"Willowcreek"},
    {n:3,nm:"Reagan Brewer",pr:"",g:7,s:"Viewpoint"},{n:4,nm:"Alexandra Butler",pr:"",g:7,s:"Lehi Jr High"},
    {n:5,nm:"Emery Chamberlain",pr:"PP-Revill",g:7,s:"Willowcreek"},{n:6,nm:"Autumn Clucas",pr:"",g:9,s:"Other"},
    {n:7,nm:"Vera Davidson",pr:"",g:8,s:"Viewpoint"},{n:8,nm:"Daija Downs",pr:"",g:7,s:"Lehi Jr High"},
    {n:9,nm:"Samantha Ellis",pr:"",g:7,s:"Willowcreek"},{n:10,nm:"Paisley Flatt",pr:"PP-Young",g:7,s:"Lehi Jr High"},
    {n:11,nm:"Isabella Hertel",pr:"PP-Leiter",g:9,s:"Saratoga"},{n:12,nm:"Paige Hertz",pr:"",g:8,s:"Saratoga"},
    {n:13,nm:"Taylor Islas",pr:"",g:7,s:"Willowcreek"},{n:14,nm:"Peach Jenkins",pr:"",g:9,s:"Viewpoint"},
    {n:15,nm:"Tess Jensen",pr:"",g:7,s:"Lehi Jr High"},{n:16,nm:"Raegan Jones",pr:"",g:7,s:"Viewpoint"},
    {n:17,nm:"Sadi MacKay",pr:"",g:7,s:"Willowcreek"},{n:18,nm:"Grace McKay",pr:"PP-Kelley",g:7,s:"Willowcreek"},
    {n:19,nm:"Penny Mickiewicz",pr:"",g:9,s:"Willowcreek"},{n:20,nm:"Kynzlee Miller",pr:"",g:7,s:"Viewpoint"},
    {n:21,nm:"Lucy Norton",pr:"",g:8,s:"Eagle Mtn"},{n:22,nm:"Lucy Pack",pr:"",g:7,s:"Viewpoint"},
    {n:23,nm:"Alice Poore",pr:"",g:6,s:"Other"},{n:24,nm:"Savannah Sandoval",pr:"",g:7,s:"Lehi Jr High"},
    {n:25,nm:"Roxanna Schneider",pr:"",g:7,s:"Lehi Jr High"},{n:26,nm:"Mayzie Scott",pr:"",g:7,s:"Lehi Jr High"},
    {n:27,nm:"Lucy Seals",pr:"",g:7,s:"Lehi Jr High"},{n:28,nm:"Adalynn Shurtz",pr:"",g:7,s:"Willowcreek"},
    {n:29,nm:"Kiana Sikander",pr:"PP-Openshaw",g:8,s:"Willowcreek"},{n:30,nm:"Rilo Stembridge",pr:"",g:7,s:"Willowcreek"},
    {n:31,nm:"Juliet Theodore",pr:"",g:7,s:"Willowcreek"},{n:32,nm:"Londyn Valenzuela",pr:"",g:8,s:"Viewpoint"},
    {n:33,nm:"Blakely Walker",pr:"",g:7,s:"Lehi Jr High"},{n:34,nm:"Aisley Wilson",pr:"",g:7,s:"Willowcreek"},
    {n:35,nm:"Evie Woffinden",pr:"",g:7,s:"Willowcreek"},{n:36,nm:"Ellie Woodbury",pr:"",g:7,s:"Willowcreek"},
    {n:37,nm:"Kambrya Yarbrough",pr:"",g:7,s:"Viewpoint"},{n:38,nm:"Britlyn Allred",pr:"",g:7,s:""},
    {n:39,nm:"Jayden Fawson",pr:"",g:7,s:""},{n:40,nm:"Tayzlie Thorpe",pr:"",g:8,s:"Willowcreek"},
  ];

  const DEFAULT_NEEDS = [
    { p:"Pitchers",   c:"3",   n:"2 primary, 1 flex" },
    { p:"Catchers",   c:"2",   n:"1 main, 1 backup" },
    { p:"Infielders", c:"4-5", n:"1B,2B,SS,3B+util" },
    { p:"Outfielders",c:"3-4", n:"Cover 3 spots" },
    { p:"Utility",    c:"1-2", n:"Multiple positions" },
  ];

  // ─── STATE ──────────────────────────────────────────────────────
  const [subTab, setSubTab] = useState("rubric");
  const [evaluator, setEvaluator] = useState("");
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [needs, setNeeds] = useState(DEFAULT_NEEDS);
  const [fbConnected, setFbConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Score tab state
  const [scorePlayerNum, setScorePlayerNum] = useState("");
  const [currentScore, setCurrentScore] = useState({});
  const [scoreStatus, setScoreStatus] = useState("");

  // Player management modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [addNum, setAddNum] = useState("");
  const [addName, setAddName] = useState("");
  const [addProtected, setAddProtected] = useState("");
  const [csvText, setCsvText] = useState("");

  // Rankings state
  const [rankSort, setRankSort] = useState({ col: "total", dir: "desc" });
  const [rankFilter, setRankFilter] = useState("scored");
  const [expandedPlayer, setExpandedPlayer] = useState(null);

  // Rubric anchor expansion
  const [openAnchor, setOpenAnchor] = useState(null);

  const dbRef = useRef(null);
  const fbAppRef = useRef(null);
  const toastTimer = useRef(null);
  const skipNextSync = useRef(false);

  // ─── TOAST ──────────────────────────────────────────────────────
  const showToast = useCallback((msg, type) => {
    setToastMsg({ msg, type: type || "ok" });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  // ─── SCORING ENGINE ─────────────────────────────────────────────
  const getAvg = useCallback((num) => {
    const evs = [];
    for (const k in scores) {
      if (scores[k][num]) evs.push(scores[k][num]);
    }
    if (!evs.length) return null;
    const cats = ["hitting","gloveWork","throwing","hustle","attitude","coachability","pitching"];
    const avg = {};
    cats.forEach(c => {
      const vs = [];
      evs.forEach(e => {
        if (e[c] != null && e[c] !== "" && !isNaN(e[c])) vs.push(parseFloat(e[c]));
      });
      avg[c] = vs.length ? Math.round(vs.reduce((s,v) => s+v, 0) / vs.length * 100) / 100 : null;
    });
    return avg;
  }, [scores]);

  const calcTotal = useCallback((avg) => {
    if (!avg) return null;
    const fields = [
      { v: avg.hitting, m: 5 }, { v: avg.gloveWork, m: 5 }, { v: avg.throwing, m: 5 },
      { v: avg.hustle, m: 3 }, { v: avg.attitude, m: 5 }, { v: avg.coachability, m: 5 },
      { v: avg.pitching, m: 5 },
    ];
    const scored = fields.filter(x => x.v != null);
    if (scored.length < 3) return null;
    return Math.round(scored.reduce((s,x) => s + x.v, 0) / scored.reduce((s,x) => s + x.m, 0) * 1000) / 10;
  }, []);

  const calcFit = useCallback((avg) => {
    if (!avg) return [];
    const results = [];
    for (const pos in POS_WEIGHTS) {
      if (pos === "Pitcher" && avg.pitching == null) continue;
      let ws = 0, tw = 0, has = false;
      const wts = POS_WEIGHTS[pos];
      for (const cat in wts) {
        if (avg[cat] != null) {
          ws += avg[cat] * wts[cat];
          tw += 5 * wts[cat];
          has = true;
        }
      }
      if (has && tw > 0) results.push({ pos, score: Math.round(ws / tw * 100) });
    }
    results.sort((a,b) => b.score - a.score);
    return results;
  }, []);

  const tierColor = (s) => {
    if (s == null) return THEME.gray;
    if (s >= 80) return THEME.green;
    if (s >= 65) return THEME.blue;
    if (s >= 50) return "#F1C40F";
    if (s >= 35) return "#E67E22";
    return THEME.red;
  };

  const tierLabel = (s) => {
    if (s == null) return "-";
    if (s >= 80) return "High";
    if (s >= 65) return "Solid";
    if (s >= 50) return "Dev";
    if (s >= 35) return "Sup";
    return "Emg";
  };

  // ─── FIREBASE SYNC ─────────────────────────────────────────────
  const saveToFirebase = useCallback((data) => {
    try {
      if (dbRef.current) {
        skipNextSync.current = true;
        dbRef.current.ref("tryouts_dashboard").set(JSON.stringify(data));
      }
    } catch (e) { console.error("FB save error:", e); }
    // Always save to localStorage as backup
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) { console.error("LS save error:", e); }
  }, []);

  // Save whenever state changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    saveToFirebase({ players, scores, needs, evaluator });
  }, [players, scores, needs, evaluator, loaded, saveToFirebase]);

  // Firebase initialization
  useEffect(() => {
    let unsubState = null;
    let unsubConn = null;

    const loadFromLocalStorage = () => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.players && data.players.length > 0) setPlayers(data.players);
          else setPlayers(DEFAULT_PLAYERS);
          setScores(data.scores || {});
          if (data.needs) setNeeds(data.needs);
          if (data.evaluator) setEvaluator(data.evaluator);
        } else {
          setPlayers(DEFAULT_PLAYERS);
        }
      } catch (e) {
        setPlayers(DEFAULT_PLAYERS);
      }
      setLoaded(true);
    };

    const initFirebase = () => {
      try {
        if (typeof firebase === "undefined") {
          console.warn("Firebase SDK not loaded; using localStorage only");
          loadFromLocalStorage();
          return;
        }
        // Use a separate app instance to avoid conflicts with the tryouts standalone app
        let app;
        try {
          app = firebase.app("tryoutsPanel");
        } catch (e) {
          app = firebase.initializeApp(FIREBASE_CONFIG, "tryoutsPanel");
        }
        fbAppRef.current = app;
        const database = app.database();
        dbRef.current = database;

        // Initial load
        database.ref("tryouts_dashboard").once("value").then(snap => {
          const val = snap.val();
          if (val) {
            try {
              const data = JSON.parse(val);
              if (data.players && data.players.length > 0) setPlayers(data.players);
              else setPlayers(DEFAULT_PLAYERS);
              setScores(data.scores || {});
              if (data.needs) setNeeds(data.needs);
              if (data.evaluator) setEvaluator(data.evaluator);
            } catch (e) {
              console.error("Parse error:", e);
              setPlayers(DEFAULT_PLAYERS);
            }
          } else {
            // No Firebase data yet, try localStorage
            loadFromLocalStorage();
            return; // loadFromLocalStorage already sets loaded
          }
          setLoaded(true);
        }).catch(e => {
          console.error("FB load error:", e);
          loadFromLocalStorage();
        });

        // Real-time listener for cross-device sync
        unsubState = database.ref("tryouts_dashboard").on("value", snap => {
          // Skip if we just saved (to avoid feedback loop)
          if (skipNextSync.current) { skipNextSync.current = false; return; }
          const val = snap.val();
          if (val) {
            try {
              const data = JSON.parse(val);
              if (data.players && data.players.length > 0) setPlayers(data.players);
              setScores(prev => data.scores || prev);
              if (data.needs) setNeeds(data.needs);
            } catch (e) { console.error("FB parse error:", e); }
          }
        });

        // Connection status
        unsubConn = database.ref(".info/connected").on("value", snap => {
          setFbConnected(snap.val() === true);
        });
      } catch (e) {
        console.error("Firebase init error:", e);
        loadFromLocalStorage();
      }
    };

    initFirebase();

    return () => {
      if (dbRef.current && unsubState) {
        dbRef.current.ref("tryouts_dashboard").off("value", unsubState);
      }
      if (dbRef.current && unsubConn) {
        dbRef.current.ref(".info/connected").off("value", unsubConn);
      }
    };
  }, []);

  // ─── PLAYER MANAGEMENT ─────────────────────────────────────────
  const addPlayer = () => {
    if (!addName.trim()) { showToast("Name required", "err"); return; }
    const maxNum = players.length > 0 ? Math.max(...players.map(p => p.n)) : 0;
    const num = parseInt(addNum) || (maxNum + 1);
    if (players.find(p => p.n === num)) {
      showToast("Number " + num + " already in use", "err");
      return;
    }
    setPlayers(prev => [...prev, { n: num, nm: addName.trim(), pr: addProtected.trim() }]);
    setAddNum(""); setAddName(""); setAddProtected("");
    setShowAddModal(false);
    showToast("Added #" + num);
  };

  const importCSV = () => {
    if (!csvText.trim()) { showToast("Paste names first", "err"); return; }
    const lines = csvText.split("\n").filter(l => l.trim());
    const maxNum = players.length > 0 ? Math.max(...players.map(p => p.n)) : 0;
    let nextNum = maxNum + 1;
    let count = 0;
    const newPlayers = [...players];
    lines.forEach(line => {
      const pts = line.split(",").map(s => s.trim());
      let num, nm;
      if (pts.length >= 2 && !isNaN(parseInt(pts[0]))) {
        num = parseInt(pts[0]);
        nm = pts.slice(1).join(" ");
      } else {
        num = nextNum++;
        nm = pts.join(" ");
      }
      if (!nm) return;
      if (newPlayers.find(p => p.n === num)) num = nextNum++;
      newPlayers.push({ n: num, nm, pr: "" });
      count++;
    });
    setPlayers(newPlayers);
    setCsvText("");
    setShowCsvModal(false);
    showToast("Added " + count + " players");
  };

  const removePlayer = (num) => {
    setPlayers(prev => prev.filter(p => p.n !== num));
    setScores(prev => {
      const next = {};
      for (const k in prev) {
        const copy = { ...prev[k] };
        delete copy[num];
        next[k] = copy;
      }
      return next;
    });
    showToast("Removed");
  };

  // ─── SCORE MANAGEMENT ──────────────────────────────────────────
  const loadPlayerScore = (num) => {
    setScorePlayerNum(num);
    if (!num) { setCurrentScore({}); return; }
    const existing = (evaluator && scores[evaluator]) ? scores[evaluator][parseInt(num)] || {} : {};
    setCurrentScore({ ...existing });
    setScoreStatus("");
  };

  const setScoreValue = (key, val) => {
    setCurrentScore(prev => {
      if (prev[key] === val) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: val };
    });
  };

  const saveScore = () => {
    if (!evaluator) { showToast("Select evaluator first!", "err"); return; }
    const num = parseInt(scorePlayerNum);
    if (!num) { showToast("Select a player", "err"); return; }
    setScores(prev => {
      const next = { ...prev };
      if (!next[evaluator]) next[evaluator] = {};
      const d = {};
      for (const k in currentScore) {
        if (currentScore[k] != null && currentScore[k] !== "") d[k] = currentScore[k];
      }
      next[evaluator] = { ...next[evaluator], [num]: d };
      return next;
    });
    const p = players.find(p => p.n === num);
    setScoreStatus("Saved " + (p ? p.nm : "#" + num) + " by " + evaluator);
    showToast("Saved!");
  };

  const clearScore = () => {
    setCurrentScore({});
    setScoreStatus("Cleared");
  };

  // ─── SUB-TABS CONFIG ───────────────────────────────────────────
  const SUB_TABS = [
    { id: "rubric",   label: "Rubric",   icon: "📏" },
    { id: "players",  label: "Players",  icon: "👥" },
    { id: "score",    label: "Score",    icon: "✏️" },
    { id: "rankings", label: "Rankings", icon: "📊" },
    { id: "draft",    label: "Draft",    icon: "🏆" },
  ];

  // ─── STYLES (matching dashboard patterns) ──────────────────────
  const cardStyle = {
    background: THEME.blackLight,
    borderRadius: 10,
    padding: 20,
    border: "1px solid " + THEME.charcoal,
    marginBottom: 16,
  };

  const sectionTitleStyle = {
    fontFamily: "'Oswald',sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: THEME.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: THEME.gray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "'Oswald',sans-serif",
  };

  const inputStyle = {
    padding: "8px 12px",
    background: THEME.black,
    border: "1px solid " + THEME.charcoal,
    borderRadius: 6,
    color: THEME.white,
    fontSize: 14,
    fontFamily: "'Source Sans 3',sans-serif",
    outline: "none",
    width: "100%",
  };

  const btnPrimary = {
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "'Oswald',sans-serif",
    textTransform: "uppercase",
    background: THEME.gold,
    color: THEME.black,
    letterSpacing: 0.3,
  };

  const btnSecondary = Object.assign({}, btnPrimary, {
    background: THEME.charcoal,
    color: THEME.white,
  });

  const btnDanger = Object.assign({}, btnPrimary, {
    background: THEME.red,
    color: THEME.white,
    fontSize: 10,
    padding: "4px 8px",
  });

  const btnGreen = Object.assign({}, btnPrimary, {
    background: THEME.green,
    color: THEME.white,
  });

  const pillStyle = (color) => ({
    display: "inline-block",
    padding: "2px 7px",
    borderRadius: 99,
    fontSize: 9,
    fontWeight: 700,
    whiteSpace: "nowrap",
    color: color,
    background: color + "18",
  });

  const thStyle = {
    textAlign: "left", padding: "5px 7px", fontSize: 9, fontWeight: 700, color: THEME.gray,
    textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid " + THEME.charcoal,
    whiteSpace: "nowrap", cursor: "pointer", userSelect: "none",
  };

  const tdBaseStyle = {
    padding: "5px 7px", borderBottom: "1px solid rgba(255,255,255,0.015)", verticalAlign: "middle",
  };

  // ─── MODAL COMPONENT ───────────────────────────────────────────
  const TModal = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ background: THEME.blackLight, borderRadius:12, padding:24, border:"1px solid " + THEME.gold, maxWidth:520, width:"100%", maxHeight:"85vh", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, color:THEME.gold, fontFamily:"'Oswald',sans-serif", fontSize:20, textTransform:"uppercase" }}>{title}</h3>
            <button onClick={onClose} style={{ background:"none", border:"none", color:THEME.gray, fontSize:22, cursor:"pointer" }}>✕</button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // ─── BAR HELPER ─────────────────────────────────────────────────
  const ScoreBar = ({ value, max }) => {
    if (value == null) return <span style={{ color: THEME.gray, fontSize: 9 }}>-</span>;
    const pct = (value / max) * 100;
    const c = pct >= 80 ? THEME.green : pct >= 60 ? THEME.blue : pct >= 40 ? "#F1C40F" : THEME.red;
    return (
      <div style={{ display:"flex", alignItems:"center", gap:3 }}>
        <div style={{ width:24, height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2, width: pct + "%", background: c }} />
        </div>
        <span style={{ fontSize:10, fontWeight:600, minWidth:12, textAlign:"right", color: c }}>{value}</span>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RUBRIC SUB-TAB
  // ═══════════════════════════════════════════════════════════════
  const renderRubric = () => (
    <div>
      {/* Tryout Stations */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Tryout Stations</div>
        {STATIONS.map((s, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"30px 1fr", gap:8, padding:10, borderRadius:6, background: i%2===0 ? "rgba(253,181,21,0.03)" : "transparent", marginBottom:2 }}>
            <span style={{ fontSize:18 }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight:700, color:THEME.white, fontSize:12 }}>
                {s.st}: {s.name}{" "}
                <span style={pillStyle(THEME.gold)}>{s.desc}</span>
              </div>
              <div style={{ fontSize:10, color:THEME.blue }}>{s.scoring}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Anchors */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Scoring Anchors</div>
        {Object.keys(ANCHORS).map(key => {
          const a = ANCHORS[key];
          const isOpen = openAnchor === key;
          return (
            <div key={key}>
              <div
                onClick={() => setOpenAnchor(isOpen ? null : key)}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"8px 10px", borderRadius:6, cursor:"pointer", marginBottom:2,
                  background: isOpen ? "rgba(253,181,21,0.08)" : THEME.black,
                  border: "1px solid " + (isOpen ? THEME.gold + "40" : THEME.charcoal),
                }}
              >
                <span style={{ fontWeight:700, color:THEME.white, fontSize:12 }}>{a.label}</span>
                <span style={{ color:THEME.gray, fontSize:10 }}>{isOpen ? "▼" : "▶"}</span>
              </div>
              {isOpen && (
                <div style={{
                  padding:"6px 10px 8px", borderRadius:"0 0 6px 6px", marginBottom:3,
                  background: "rgba(253,181,21,0.05)", border: "1px solid " + THEME.gold + "30", borderTop: "none",
                }}>
                  {a.anchors.map(function(pair) {
                    var score = pair[0];
                    var desc = pair[1];
                    var c = score >= 4 ? THEME.green : score >= 3 ? THEME.blue : score >= 2 ? "#F1C40F" : THEME.red;
                    return (
                      <div key={score} style={{ display:"flex", gap:6, padding:"3px 0" }}>
                        <span style={{ fontWeight:800, fontSize:14, color:c, minWidth:16, textAlign:"center" }}>{score}</span>
                        <span style={{ fontSize:11, color:THEME.white }}>{desc}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rating Scale */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Rating Scale</div>
        {TIER_SCALE.map(t => (
          <div key={t.label} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 8px", borderRadius:5, background: t.color + "11", marginBottom:2 }}>
            <span style={{ fontWeight:800, color:t.color, fontSize:11, minWidth:55 }}>{t.range}</span>
            <span style={{ fontWeight:700, color:t.color, fontSize:11 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Roster Targets */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Roster Targets</div>
        {needs.map((r, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:5, background: i%2===0 ? "rgba(253,181,21,0.03)" : "transparent", marginBottom:2 }}>
            <strong style={{ color:THEME.white, fontSize:12, minWidth:80 }}>{r.p}</strong>
            <span style={{ color:THEME.gold, fontWeight:700, fontSize:12, minWidth:30 }}>{r.c}</span>
            <span style={{ fontSize:10, color:THEME.gray }}>{r.n}</span>
          </div>
        ))}
      </div>

      {/* Position Key Scores */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Positions - Key Scores</div>
        {[
          { p:"Catcher",   k:"Throw, Att, Coach" },
          { p:"Pitcher",   k:"Pitch, Coach, Att" },
          { p:"Shortstop",  k:"Glove, Throw, Hustle" },
          { p:"3rd Base",  k:"Throw, Glove, Att" },
          { p:"1st Base",  k:"Glove, Hit, Coach" },
          { p:"2nd Base",  k:"Glove, Coach, Att" },
          { p:"Outfield",  k:"Hustle, Throw, Hit" },
          { p:"Utility",   k:"Coach, Att, Glove" },
        ].map((p, i) => (
          <div key={i} style={{ padding:"6px 8px", borderRadius:5, background: i%2===0 ? "rgba(253,181,21,0.03)" : "transparent", marginBottom:2 }}>
            <span style={{ fontWeight:700, color:THEME.white, fontSize:12 }}>{p.p}</span>{" "}
            <span style={{ fontSize:10, color:THEME.blue }}>{p.k}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // PLAYERS SUB-TAB
  // ═══════════════════════════════════════════════════════════════
  const renderPlayers = () => {
    const sorted = players.slice().sort((a,b) => a.n - b.n);
    return (
      <div>
        <div style={cardStyle}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <div style={Object.assign({}, sectionTitleStyle, { marginBottom:0 })}>2026 Draft List ({players.length})</div>
            <div style={{ display:"flex", gap:6 }}>
              <button style={btnPrimary} onClick={() => setShowAddModal(true)}>+ Add</button>
              <button style={btnSecondary} onClick={() => setShowCsvModal(true)}>Paste CSV</button>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div style={{ color:THEME.gray, padding:16, textAlign:"center", fontSize:12 }}>No players. Add or paste a list.</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:0, fontSize:12 }}>
                <thead>
                  <tr>
                    {["#","Name","Gr","PP","Evals",""].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => {
                    var evalCount = 0;
                    for (var k in scores) { if (scores[k][p.n]) evalCount++; }
                    return (
                      <tr key={p.n} style={{ background: i%2===0 ? "rgba(255,255,255,0.008)" : "transparent" }}>
                        <td style={Object.assign({}, tdBaseStyle, { fontWeight:600, color:THEME.gray })}>{p.n}</td>
                        <td style={Object.assign({}, tdBaseStyle, { fontWeight:600, color:THEME.white })}>{p.nm}</td>
                        <td style={Object.assign({}, tdBaseStyle, { fontWeight:600, color:THEME.gold, textAlign:"center" })}>{p.g || ""}</td>
                        <td style={tdBaseStyle}>
                          {p.pr ? <span style={pillStyle("#E67E22")}>{p.pr}</span> : null}
                        </td>
                        <td style={tdBaseStyle}>
                          <span style={pillStyle(evalCount > 0 ? THEME.green : THEME.gray)}>{evalCount > 0 ? evalCount : "-"}</span>
                        </td>
                        <td style={tdBaseStyle}>
                          <button style={btnDanger} onClick={() => removePlayer(p.n)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Player Modal */}
        <TModal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Player">
          <div style={{ marginBottom:8 }}>
            <label style={labelStyle}>Number</label>
            <input style={inputStyle} type="number" placeholder="#" value={addNum} onChange={e => setAddNum(e.target.value)} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} placeholder="Full Name" value={addName} onChange={e => setAddName(e.target.value)} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={labelStyle}>Protected (optional)</label>
            <input style={inputStyle} placeholder="e.g. PP - TeamName" value={addProtected} onChange={e => setAddProtected(e.target.value)} />
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button style={Object.assign({}, btnGreen, { flex:1 })} onClick={addPlayer}>Add</button>
            <button style={btnSecondary} onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </TModal>

        {/* CSV Import Modal */}
        <TModal open={showCsvModal} onClose={() => setShowCsvModal(false)} title="Paste Player List">
          <p style={{ fontSize:11, color:THEME.gray, marginBottom:8 }}>One per line: Number, Name</p>
          <textarea
            style={Object.assign({}, inputStyle, { minHeight:160, resize:"vertical" })}
            placeholder={"1, Jane Smith\n2, Sarah Jones"}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
          />
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            <button style={Object.assign({}, btnGreen, { flex:1 })} onClick={importCSV}>Import</button>
            <button style={btnSecondary} onClick={() => setShowCsvModal(false)}>Cancel</button>
          </div>
        </TModal>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // SCORE SUB-TAB
  // ═══════════════════════════════════════════════════════════════
  const renderScore = () => {
    const sorted = players.slice().sort((a,b) => a.n - b.n);
    const noEval = !evaluator;
    return (
      <div>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Score a Player</div>

          {noEval && (
            <div style={{
              padding:10, borderRadius:6, marginBottom:10,
              background:"rgba(241,196,15,0.1)", border:"1px solid rgba(241,196,15,0.3)",
              fontSize:12, color:"#F1C40F",
            }}>
              Select an evaluator above before scoring.
            </div>
          )}

          <select
            value={scorePlayerNum}
            onChange={e => loadPlayerScore(e.target.value)}
            style={Object.assign({}, inputStyle, { fontSize:14, padding:10, marginBottom:12, cursor:"pointer" })}
          >
            <option value="">-- Select Player --</option>
            {sorted.map(p => (
              <option key={p.n} value={p.n}>#{p.n} {p.nm}</option>
            ))}
          </select>

          {scorePlayerNum && (
            <div>
              {/* Scoring Categories */}
              {CATEGORIES.map(cat => (
                <div key={cat.key} style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:THEME.white, fontSize:13, marginBottom:2 }}>{cat.label}</div>
                  <div style={{ fontSize:10, color:THEME.gray, marginBottom:4 }}>{cat.sub}</div>
                  <div style={{ display:"flex", gap:3 }}>
                    {Array.from({ length: cat.max }, function(_, i) { return i + 1; }).map(val => (
                      <button
                        key={val}
                        onClick={() => setScoreValue(cat.key, val)}
                        style={{
                          flex:1, minHeight:44, borderRadius:7, fontSize:16, fontWeight:700, cursor:"pointer",
                          fontFamily:"'Source Sans 3',sans-serif",
                          border: "1px solid " + (currentScore[cat.key] === val ? THEME.gold + "60" : THEME.charcoal),
                          background: currentScore[cat.key] === val ? "rgba(253,181,21,0.12)" : THEME.black,
                          color: currentScore[cat.key] === val ? THEME.gold : THEME.gray,
                          boxShadow: currentScore[cat.key] === val ? "0 0 8px " + THEME.gold + "20" : "none",
                          transition: "all 0.15s",
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes field */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontWeight:700, color:THEME.white, fontSize:13, marginBottom:2 }}>Notes</div>
                <div style={{ fontSize:10, color:THEME.gray, marginBottom:4 }}>Any observations about this player</div>
                <textarea
                  value={currentScore.notes || ""}
                  onChange={e => setCurrentScore(function(prev) { return Object.assign({}, prev, { notes: e.target.value }); })}
                  placeholder="Add notes here..."
                  style={Object.assign({}, inputStyle, { minHeight:80, resize:"vertical" })}
                />
              </div>

              {/* Save / Clear */}
              <div style={{ display:"flex", gap:6, marginTop:10 }}>
                <button
                  style={Object.assign({}, btnGreen, { flex:1, minHeight:48, fontSize:14 })}
                  onClick={saveScore}
                >
                  Save Score
                </button>
                <button style={btnSecondary} onClick={clearScore}>Clear</button>
              </div>

              {scoreStatus && (
                <div style={{ marginTop:6, fontSize:11, textAlign:"center", color: scoreStatus.indexOf("Saved") === 0 ? THEME.green : THEME.gray }}>
                  {scoreStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // RANKINGS SUB-TAB
  // ═══════════════════════════════════════════════════════════════
  const renderRankings = () => {
    var allData = players.map(p => {
      var avg = getAvg(p.n);
      return { n: p.n, nm: p.nm, pr: p.pr, avg: avg, total: calcTotal(avg), fit: calcFit(avg) };
    });

    var scored = allData.filter(x => x.total != null);
    var avgScore = scored.length ? (scored.reduce((s,x) => s + x.total, 0) / scored.length).toFixed(1) : "-";
    var top = scored.reduce((b,x) => x.total > (b ? b.total : -1) ? x : b, null);
    var evalNames = Object.keys(scores).join(", ");

    var data = allData.slice();

    // Filter
    if (rankFilter === "scored") data = data.filter(x => x.total != null);
    else if (rankFilter === "top15") { data = data.filter(x => x.total != null); data.sort((a,b) => b.total - a.total); data = data.slice(0,15); }
    else if (rankFilter === "pitch") data = data.filter(x => x.avg && x.avg.pitching != null);

    // Sort (unless top15 which is pre-sorted)
    if (rankFilter !== "top15") {
      data.sort((a,b) => {
        var c = rankSort.col;
        if (c === "nm") return rankSort.dir === "asc" ? (a.nm||"").localeCompare(b.nm||"") : (b.nm||"").localeCompare(a.nm||"");
        var av, bv;
        if (c === "total") { av = a.total != null ? a.total : -999; bv = b.total != null ? b.total : -999; }
        else { av = a.avg ? a.avg[c] || -999 : -999; bv = b.avg ? b.avg[c] || -999 : -999; }
        return rankSort.dir === "asc" ? av - bv : bv - av;
      });
    }

    var sortCol = (col) => {
      if (rankSort.col === col) setRankSort(function(prev) { return { col: prev.col, dir: prev.dir === "asc" ? "desc" : "asc" }; });
      else setRankSort({ col: col, dir: "desc" });
    };

    var filterOptions = [
      { k:"scored", l:"Scored", c:scored.length },
      { k:"top15",  l:"Top 15", c:Math.min(15,scored.length) },
      { k:"pitch",  l:"Pitchers", c:allData.filter(x => x.avg && x.avg.pitching != null).length },
      { k:"all",    l:"All",    c:allData.length },
    ];

    return (
      <div>
        {/* Stats Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))", gap:6, marginBottom:12 }}>
          <div style={Object.assign({}, cardStyle, { padding:"8px 10px", marginBottom:0 })}>
            <div style={{ fontSize:8, color:THEME.gray, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>Avg</div>
            <div style={{ fontSize:16, fontWeight:800, color:THEME.gold }}>{avgScore}%</div>
          </div>
          <div style={Object.assign({}, cardStyle, { padding:"8px 10px", marginBottom:0 })}>
            <div style={{ fontSize:8, color:THEME.gray, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>High (80%+)</div>
            <div style={{ fontSize:16, fontWeight:800, color:THEME.green }}>{scored.filter(x => x.total >= 80).length}</div>
          </div>
          <div style={Object.assign({}, cardStyle, { padding:"8px 10px", marginBottom:0 })}>
            <div style={{ fontSize:8, color:THEME.gray, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>Top</div>
            <div style={{ fontSize:16, fontWeight:800, color:THEME.blue }}>{top ? top.total + "%" : "-"}</div>
            <div style={{ fontSize:9, color:THEME.gray, marginTop:1 }}>{top ? top.nm : ""}</div>
          </div>
          <div style={Object.assign({}, cardStyle, { padding:"8px 10px", marginBottom:0 })}>
            <div style={{ fontSize:8, color:THEME.gray, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:2 }}>Evals</div>
            <div style={{ fontSize:16, fontWeight:800, color:THEME.gold }}>{Object.keys(scores).length}</div>
            <div style={{ fontSize:9, color:THEME.gray, marginTop:1 }}>{evalNames}</div>
          </div>
        </div>

        <div style={cardStyle}>
          {/* Filter bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:6 }}>
            <div style={Object.assign({}, sectionTitleStyle, { marginBottom:0 })}>Rankings</div>
            <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
              {filterOptions.map(f => (
                <button
                  key={f.k}
                  onClick={() => setRankFilter(f.k)}
                  style={{
                    padding:"3px 8px", borderRadius:5, fontSize:9, fontWeight: rankFilter === f.k ? 700 : 500, cursor:"pointer",
                    fontFamily:"'Source Sans 3',sans-serif",
                    border: "1px solid " + (rankFilter === f.k ? THEME.gold + "40" : THEME.charcoal),
                    background: rankFilter === f.k ? "rgba(253,181,21,0.08)" : "transparent",
                    color: rankFilter === f.k ? THEME.gold : THEME.gray,
                  }}
                >
                  {f.l} ({f.c})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:0, fontSize:11 }}>
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => sortCol("n")}>#</th>
                  <th style={thStyle} onClick={() => sortCol("nm")}>Name</th>
                  <th style={thStyle} onClick={() => sortCol("hitting")}>Hit</th>
                  <th style={thStyle} onClick={() => sortCol("gloveWork")}>Glove</th>
                  <th style={thStyle} onClick={() => sortCol("throwing")}>Throw</th>
                  <th style={thStyle} onClick={() => sortCol("hustle")}>Hust</th>
                  <th style={thStyle} onClick={() => sortCol("attitude")}>Att</th>
                  <th style={thStyle} onClick={() => sortCol("coachability")}>Coach</th>
                  <th style={thStyle} onClick={() => sortCol("pitching")}>Pitch</th>
                  <th style={thStyle} onClick={() => sortCol("total")}>Total</th>
                  <th style={thStyle}>Tier</th>
                  <th style={thStyle}>Fit</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => {
                  var a = p.avg || {};
                  var topFit = p.fit[0];
                  return (
                    <React.Fragment key={p.n}>
                      <tr
                        style={{ background: i%2===0 ? "rgba(255,255,255,0.008)" : "transparent", cursor: p.fit.length ? "pointer" : "default" }}
                        onClick={() => setExpandedPlayer(expandedPlayer === p.n ? null : p.n)}
                      >
                        <td style={Object.assign({}, tdBaseStyle, { color:THEME.gray, fontWeight:600 })}>{p.n}</td>
                        <td style={Object.assign({}, tdBaseStyle, { color:THEME.white, fontWeight:600, whiteSpace:"nowrap" })}>
                          {p.nm}
                          {p.pr ? <span style={Object.assign({}, pillStyle("#E67E22"), { marginLeft:4 })}>{p.pr}</span> : null}
                        </td>
                        <td style={tdBaseStyle}><ScoreBar value={a.hitting} max={5} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.gloveWork} max={5} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.throwing} max={5} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.hustle} max={3} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.attitude} max={5} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.coachability} max={5} /></td>
                        <td style={tdBaseStyle}><ScoreBar value={a.pitching} max={5} /></td>
                        <td style={Object.assign({}, tdBaseStyle, { fontWeight:700, color:tierColor(p.total) })}>
                          {p.total != null ? p.total + "%" : "-"}
                        </td>
                        <td style={tdBaseStyle}>
                          {p.total != null ? <span style={pillStyle(tierColor(p.total))}>{tierLabel(p.total)}</span> : null}
                        </td>
                        <td style={Object.assign({}, tdBaseStyle, { fontSize:9, color:THEME.blue })}>
                          {topFit ? topFit.pos : "-"}
                        </td>
                      </tr>
                      {expandedPlayer === p.n && p.fit.length > 0 && (
                        <tr>
                          <td colSpan={12} style={{ padding:"3px 6px 8px 36px", background:"rgba(253,181,21,0.05)" }}>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                              {p.fit.map((r, j) => {
                                var c = r.score >= 75 ? THEME.green : r.score >= 60 ? THEME.blue : r.score >= 45 ? "#F1C40F" : THEME.red;
                                return (
                                  <div key={j} style={{
                                    padding:"3px 8px", borderRadius:4, fontSize:9,
                                    background:THEME.black, border:"1px solid " + THEME.charcoal,
                                  }}>
                                    <span style={{ color:THEME.white }}>{r.pos}</span>{" "}
                                    <span style={{ fontWeight:700, color:c }}>{r.score}%</span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Show notes from each evaluator */}
                            {(function() {
                              var noteEntries = [];
                              for (var ev in scores) {
                                if (scores[ev][p.n] && scores[ev][p.n].notes) {
                                  noteEntries.push({ evaluator: ev, notes: scores[ev][p.n].notes });
                                }
                              }
                              if (noteEntries.length === 0) return null;
                              return (
                                <div style={{ marginTop:6 }}>
                                  {noteEntries.map((ne, ni) => (
                                    <div key={ni} style={{ fontSize:10, color:THEME.gray, marginBottom:2 }}>
                                      <span style={{ color:THEME.gold, fontWeight:600 }}>{ne.evaluator}:</span> {ne.notes}
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data.length === 0 && (
            <div style={{ color:THEME.gray, padding:20, textAlign:"center", fontSize:12 }}>
              No scored players yet. Go to the Score tab to evaluate players.
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // DRAFT BOARD SUB-TAB
  // ═══════════════════════════════════════════════════════════════
  const renderDraft = () => {
    var data = players.map(p => {
      var avg = getAvg(p.n);
      return { n: p.n, nm: p.nm, avg: avg, total: calcTotal(avg), fit: calcFit(avg) };
    }).filter(x => x.total != null);

    var positions = ["Pitcher","Catcher","Shortstop","Third Base","First Base","Second Base","Outfield","Utility"];

    return (
      <div>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Draft Board</div>
          <p style={{ fontSize:11, color:THEME.gray, marginBottom:4 }}>Weighted by position importance. Top 5 per position.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:8 }}>
          {positions.map(pos => {
            var candidates = data
              .filter(p => p.fit.some(f => f.pos === pos))
              .map(p => {
                var f = p.fit.find(f => f.pos === pos);
                return { nm: p.nm, total: p.total, fitScore: f ? f.score : 0 };
              })
              .sort((a,b) => b.fitScore - a.fitScore)
              .slice(0, 5);

            var urg = POSITION_URGENCY[pos];

            return (
              <div key={pos} style={Object.assign({}, cardStyle, { margin:0 })}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontWeight:700, color:THEME.white, fontSize:13 }}>{pos}</span>
                  {urg && <span style={pillStyle(urg[1])}>{urg[0]}</span>}
                </div>
                {candidates.length === 0 ? (
                  <div style={{ fontSize:10, color:THEME.gray }}>No candidates</div>
                ) : (
                  candidates.map((p, i) => {
                    var c = p.fitScore >= 75 ? THEME.green : p.fitScore >= 60 ? THEME.blue : p.fitScore >= 45 ? "#F1C40F" : THEME.red;
                    return (
                      <div key={i} style={{
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"5px 7px", borderRadius:5, marginBottom:2,
                        background: i === 0 ? "rgba(253,181,21,0.06)" : "transparent",
                        border: i === 0 ? "1px solid " + THEME.gold + "30" : "1px solid transparent",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{
                            width:16, height:16, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:8, fontWeight:800, color:THEME.gray,
                            background: THEME.black, border:"1px solid " + THEME.charcoal,
                          }}>{i+1}</span>
                          <div>
                            <div style={{ fontSize:11, fontWeight:600, color: THEME.white }}>{p.nm}</div>
                            <div style={{ fontSize:8, color:THEME.gray }}>{p.total}%</div>
                          </div>
                        </div>
                        <span style={{ fontSize:12, fontWeight:800, color: c }}>{p.fitScore}%</span>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div style={Object.assign({}, cardStyle, { textAlign:"center" })}>
            <div style={{ color:THEME.gray, fontSize:12 }}>No scored players yet. Score players first to populate the draft board.</div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div>
      {/* Header with Evaluator + Sync Status */}
      <div style={Object.assign({}, cardStyle, {
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10,
        borderColor: THEME.gold + "30",
      })}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:THEME.gold, textTransform:"uppercase" }}>Evaluator:</span>
          <div style={{ display:"flex", gap:4 }}>
            {DEFAULT_EVALUATORS.map(ev => (
              <button
                key={ev}
                onClick={() => setEvaluator(ev)}
                style={{
                  padding:"6px 14px", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer",
                  fontFamily:"'Oswald',sans-serif", textTransform:"uppercase", letterSpacing:0.3,
                  border: "1px solid " + (evaluator === ev ? THEME.gold : THEME.charcoal),
                  background: evaluator === ev ? THEME.gold : "transparent",
                  color: evaluator === ev ? THEME.black : THEME.gray,
                  transition: "all 0.2s",
                }}
              >
                {ev}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{
            width:8, height:8, borderRadius:"50%",
            background: fbConnected ? THEME.green : THEME.red,
            boxShadow: fbConnected ? "0 0 6px " + THEME.green : "none",
          }} />
          <span style={{ fontSize:10, color:THEME.gray }}>{fbConnected ? "Synced" : "Offline"}</span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"2px solid " + THEME.charcoal, marginBottom:20, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              padding:"14px 16px", minHeight:48, border:"none", cursor:"pointer",
              fontFamily:"'Oswald',sans-serif", fontSize:12, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap",
              transition:"all 0.2s ease",
              background: subTab === t.id ? THEME.gold : "transparent",
              color: subTab === t.id ? THEME.black : THEME.gray,
              borderBottom: subTab === t.id ? "2px solid " + THEME.gold : "2px solid transparent",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === "rubric" && renderRubric()}
      {subTab === "players" && renderPlayers()}
      {subTab === "score" && renderScore()}
      {subTab === "rankings" && renderRankings()}
      {subTab === "draft" && renderDraft()}

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
          padding:"8px 18px", borderRadius:8, fontSize:12, fontWeight:600, zIndex:300,
          background: toastMsg.type === "ok" ? "rgba(46,204,113,0.9)" : "rgba(231,76,60,0.9)",
          color:"#fff",
        }}>
          {toastMsg.msg}
        </div>
      )}
    </div>
  );
};
