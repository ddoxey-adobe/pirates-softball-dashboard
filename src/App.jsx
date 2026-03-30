import { useState, useEffect, useRef } from "react";

const STORAGE_KEYS = {
  PLAYERS: "pirates-players-2026v3",
  COACHES: "pirates-coaches-2026v1",
  PRACTICES: "pirates-practices-2026v3",
  MESSAGES: "pirates-messages-2026v3",
  GAMELOGS: "pirates-gamelogs-2026v1",
  PRACTICELOGS: "pirates-practicelogs-2026v1",
};

const THEME = {
  gold: "#FDB515", goldLight: "#FDCF58", goldDim: "#C89A12",
  black: "#1B1B1B", blackLight: "#27251F", charcoal: "#3A3A3A",
  white: "#FAF9F6", cream: "#F5F0E6", red: "#E74C3C", green: "#2ECC71",
  blue: "#3498DB", gray: "#8E8E8E", grayLight: "#C4C4C4",
};

const POSITIONS = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "EH", "Bench"];
const GRADES = ["7th", "8th", "9th"];
const SKILL_AREAS = ["Hitting", "Fielding", "Throwing", "Baserunning", "Pitching", "Attitude"];
const AB_RESULTS = [
  { code: "1B", label: "1B", type: "hit", color: "#2ECC71" },
  { code: "2B", label: "2B", type: "hit", color: "#2ECC71" },
  { code: "3B", label: "3B", type: "hit", color: "#2ECC71" },
  { code: "HR", label: "HR", type: "hit", color: "#F1C40F" },
  { code: "BB", label: "BB", type: "on", color: "#3498DB" },
  { code: "HBP", label: "HBP", type: "on", color: "#3498DB" },
  { code: "K", label: "K", type: "out", color: "#E74C3C" },
  { code: "ꓘ", label: "ꓘ", type: "out", color: "#E74C3C" },
  { code: "GO", label: "GO", type: "out", color: "#8E8E8E" },
  { code: "FO", label: "FO", type: "out", color: "#8E8E8E" },
  { code: "FC", label: "FC", type: "on", color: "#8E8E8E" },
  { code: "SAC", label: "SAC", type: "out", color: "#8E8E8E" },
  { code: "E", label: "E", type: "on", color: "#E67E22" },
];
const isHit = (code) => ["1B","2B","3B","HR"].includes(code);
const isOnBase = (code) => ["1B","2B","3B","HR","BB","HBP","FC","E"].includes(code);
const isOut = (code) => ["K","ꓘ","GO","FO","SAC"].includes(code);
const abColor = (code) => (AB_RESULTS.find(a => a.code === code) || {}).color || THEME.gray;

// Drill tracking configuration
const TRACKABLE_DRILLS = {
  b1: { type: "time", label: "Time (seconds)", perPlayer: true, description: "Record each player's home-to-first time" },
  p2: { type: "strikes-balls", label: "Strikes / Balls", perPlayer: true, description: "Track strikes vs balls for each pitcher" },
  p3: { type: "number", label: "Pitch Count", perPlayer: true, description: "Total pitches thrown" },
  f3: { type: "team-count", label: "Consecutive Outs", perPlayer: false, description: "Team's best consecutive outs before error" },
  h9: { type: "number", label: "Points", perPlayer: true, description: "Total points (GB=1, FB=2, LD=3)" },
  h10: { type: "number", label: "Points", perPlayer: true, description: "Bunt accuracy points" },
  h11: { type: "level", label: "Level Reached", perPlayer: true, description: "Highest level (1-6) achieved" },
};

const DRILL_LIBRARY = [
  // ── Warm-Up ──
  { id: "w1", name: "Dynamic Warm-Up", category: "Warm-Up", duration: 10, coach: "Any", description: "Jog, arm circles, high knees, butt kicks, lunges, karaokes, leg swings. Get blood flowing and muscles loose before throwing. Every practice starts here." },
  { id: "w2", name: "Band Work (Shoulders)", category: "Warm-Up", duration: 5, coach: "Any", description: "Resistance band exercises for shoulder stability. Internal/external rotation, pull-aparts, overhead stretches. Experts recommend starting bands at age 11-12 to prevent arm injuries. Especially important for pitchers." },
  // ── Throwing ──
  { id: "t1", name: "One-Knee Throwing", category: "Throwing", duration: 10, coach: "Shari", description: "Players kneel on throwing-side knee, isolating the upper body. Focus on 4-seam grip, L-position arm path, and clean follow-through. Eliminates lower body to build proper arm mechanics. Recommended by GoRout and Covey Sports for youth." },
  { id: "t2", name: "Rock & Fire", category: "Throwing", duration: 10, coach: "Shari", description: "Players rock weight back and forth 3 times, then throw on the final forward shift. Teaches proper weight transfer during the throw. Top drill from Covey Sports for 10U-12U age groups." },
  { id: "t3", name: "Long Toss Progression", category: "Throwing", duration: 10, coach: "Any", description: "Partners start 20ft apart. After every 5 clean catches, both step back 3ft. If you drop it, you're out. Builds arm strength and accuracy under increasing distance with real stakes." },
  { id: "t4", name: "Relay & Cutoff", category: "Throwing", duration: 15, coach: "Ken", description: "Outfielders throw to cutoff, infielders relay to bases. First throw: through the cutoff. Second throw: 'do or die' to home — cutoff should not touch it. Practice all game scenarios. Critical for reducing extra bases." },
  // ── Fielding ──
  { id: "f1", name: "Ground Ball Fundamentals", category: "Fielding", duration: 15, coach: "Ken", description: "Ready position (athletic stance, glove out front), charge the ball, field out in front with two hands, funnel to chest, transfer, crow hop, throw. Roll grounders at varying speeds. The foundation of all infield defense." },
  { id: "f2", name: "Rapid Fire Grounders", category: "Fielding", duration: 15, coach: "Ken", description: "3 consecutive balls hit to the same fielder — first play at 3B, second at 2B, third at 1B. Repeat for each infielder. Teaches reads, footwork, and quick transitions under pressure. Recommended by GoRout for 12U+." },
  { id: "f3", name: "21 Outs Drill", category: "Fielding", duration: 20, coach: "All", description: "Full defense on the field, goal is 21 consecutive outs without an error. Coach hits/throws game-like balls. If anyone makes an error, restart at zero. Builds team accountability and focus. Top game-simulation drill from multiple expert sources." },
  { id: "f4", name: "Fly Ball Tracking Box", category: "Fielding", duration: 15, coach: "Any", description: "Set up 4 cones in a 20x10 yard box. Coach throws fly balls over players' heads. Players drop-step, sprint, and track with their head turned. Trains outfielders to read the ball off the bat and take proper routes. GoRout recommended." },
  { id: "f5", name: "Triangle Pop Fly", category: "Fielding", duration: 15, coach: "Any", description: "From 2025: Hit deep pop flies to groups of 3 outfielders arranged in a triangle. One calls it, one backs up, one communicates. Teaches the communication triangle your team used last year." },
  { id: "f6", name: "Bare Hand Pickups", category: "Fielding", duration: 10, coach: "Any", description: "From 2025: Coach rolls slow grounders and bunts. Players field bare-handed, transfer to throwing hand, and throw to first. Builds soft hands, quick reactions, and clean transfers." },
  { id: "f7", name: "Scoop Step Throw", category: "Fielding", duration: 15, coach: "Ken", description: "From 2025: Field the ball, transfer with proper footwork, step toward target, and throw — all as one fluid motion. Focuses on eliminating wasted movement between catch and throw." },
  { id: "f8", name: "Cone Fielding Triangle", category: "Fielding", duration: 15, coach: "Ken", description: "Use your cones to create triangle patterns. Coach rolls grounders to different angles — left, right, straight on. Players work on lateral movement, approach angles, and setting feet to throw. Uses your agility cone set." },
  { id: "f9", name: "Cone Weave Grounders", category: "Fielding", duration: 15, coach: "Ken", description: "Set up 6-8 cones in a zigzag pattern 5ft apart. Coach rolls grounders to each cone. Player fields at each cone while weaving through the pattern. Builds lateral agility and quick hands while moving. Uses your 12-cone set." },
  { id: "f10", name: "Lateral Shuffle Box", category: "Fielding", duration: 10, coach: "Any", description: "Set up 4 cones in a 10x10 ft box. Fielder starts at center, coach calls a cone. Shuffle laterally to cone, ready position, shuffle back to center. Repeat for all 4 directions. Teaches defensive positioning and quick lateral movement. Uses your agility cone set." },
  // ── Hitting ──
  { id: "h1", name: "Tee Work (Basics)", category: "Hitting", duration: 15, coach: "Any", description: "10 swings per round off the tee. Focus on balanced stance, grip, swing path, and contact point. Even pros use tees daily. The foundation of all hitting — don't rush past it. Use backstop net for collection." },
  { id: "h2", name: "Freeze Drill (Tee)", category: "Hitting", duration: 10, coach: "Any", description: "Player loads into hitting position and HOLDS for 2-3 seconds before swinging. Forces awareness of load position and weight distribution. Works especially well with kids who rush their swing. Recommended by GoRout and SkillShark." },
  { id: "h3", name: "Inside/Outside Tee", category: "Hitting", duration: 15, coach: "Any", description: "Move the tee to different pitch locations — inside, outside, high, low. Teaches players to adjust their swing path and hit the ball to all parts of the field. Every hitter needs this. GoRout recommended." },
  { id: "h4", name: "Soft Toss", category: "Hitting", duration: 10, coach: "Any", description: "Partner or coach kneels to the side and tosses balls into the strike zone. Hitter focuses on tracking the ball, timing, and making solid contact. Bridge between tee work and live pitching." },
  { id: "h5", name: "Front Toss", category: "Hitting", duration: 15, coach: "Any", description: "Coach kneels 15-20ft in front behind an L-screen and flips balls to the hitter. Builds timing with a moving ball and trains barrel awareness. The key progression step before machine or live pitching." },
  { id: "h6", name: "Live Machine BP", category: "Hitting", duration: 20, coach: "Any", description: "Live at-bats against the Jugs pitching machine. Vary speeds. 8-10 swings per player. Use backstop net. The closest thing to facing a real pitcher. Rotate players through quickly to maximize reps." },
  { id: "h7", name: "Power Hitting (Speed Changes)", category: "Hitting", duration: 15, coach: "Any", description: "From 2025: Alternate slow and fast pitches from the Jugs machine. Teaches timing adjustment and weight transfer. Players must read the speed and adjust — just like a real at-bat." },
  { id: "h8", name: "Drop Ball Drill", category: "Hitting", duration: 10, coach: "Any", description: "Coach holds ball above batter's head height and drops it into the strike zone. Batter must hit it before it hits the ground. Trains quick hands, staying inside the ball, and driving line contact. Fun and competitive." },
  { id: "h9", name: "Points-Based Hitting", category: "Hitting", duration: 15, coach: "Any", description: "Draft teams. Ground ball = 1 point, fly ball = 2 points, line drive = 3 points. Each player gets 5 swings, highest score wins. Pushes quality contact — line drives are the goal. Great competitive energy. GoRout recommended." },
  { id: "h10", name: "Bunt Stations", category: "Hitting", duration: 10, coach: "Any", description: "Sacrifice bunt and drag bunt technique. Square early, angle the bat, deaden the ball. Use point values for where the ball stops (bases 1&3 = 2 points, base 2 = 1 point) to make it competitive. Bunting wins rec league games." },
  { id: "h11", name: "Batting Queen", category: "Hitting", duration: 15, coach: "Any", description: "From 2025: Progressive 6-level hitting competition. 1-Make Contact, 2-Has to be Fair, 3-Past the Pitcher, 4-Past Pitcher in the Air, 5-Only Touch Grass (not dirt), 6-Furthest Hit. Girls love this — great energy and competition." },
  // ── Baserunning ──
  { id: "b1", name: "Home to First Sprint", category: "Baserunning", duration: 10, coach: "Any", description: "Timed sprints from batter's box to first base. Emphasize running THROUGH the bag (not slowing down), hitting the front edge of the base, and turning right toward foul territory. Time each girl and track improvement." },
  { id: "b2", name: "Rounding Bases", category: "Baserunning", duration: 10, coach: "Any", description: "Practice the banana curve when rounding bases — arc out slightly before the base, hit the inside corner, and accelerate toward the next base. Use cones to mark the ideal path." },
  { id: "b3", name: "Read & React", category: "Baserunning", duration: 15, coach: "Ken", description: "Runner on base, coach hits ball. Runner must read whether to go, stay, or advance based on where the ball goes. Builds game IQ and base running instincts. Teaches when to be aggressive vs. when to hold." },
  { id: "b4", name: "Sliding Practice", category: "Baserunning", duration: 10, coach: "Any", description: "Bent-leg slide technique on grass. Start from walking, progress to jogging, then running. Emphasize tucking one leg under, keeping hands up, and hitting the base with the top foot. Safety first — always on soft ground." },
  { id: "b5", name: "Baserunning Race", category: "Baserunning", duration: 10, coach: "Any", description: "From 2025: Race to 2nd base and race home. Two runners go at once, competitive format. Proper technique required — touch inside of bases, use banana turns. Girls get fired up for this one." },
  { id: "b6", name: "Four Corners Box Drill", category: "Baserunning", duration: 10, coach: "Any", description: "Set up 4 cones in a box 15x15 ft. Sprint to each cone, touch it, sprint to next. Focus on quick direction changes and acceleration. Builds explosive first-step speed for stealing bases and beating throws. Use your agility cone set." },
  { id: "b7", name: "Star Drill", category: "Baserunning", duration: 12, coach: "Any", description: "Set up 5 cones in a star pattern (1 center, 4 corners). Start at center, sprint to corner cone, backpedal to center, sprint to next corner. Teaches multi-direction movement and quick recovery. Great for baserunning instincts. Use your agility cone set." },
  // ── Pitching ──
  { id: "p1", name: "Pitching Mechanics", category: "Pitching", duration: 20, coach: "Shari", description: "Windmill mechanics breakdown: K position (arm at 90 degrees), full arm circle, stride toward target, wrist snap at hip, follow through. Shari works with Rose, Kaizley, and Jayden on this progression." },
  { id: "p2", name: "Pitch Location Work", category: "Pitching", duration: 15, coach: "Shari", description: "Throwing to specific spots — inside, outside, high, low. Use targets or a strike zone mat. Track strikes vs balls for each pitcher. Builds control and confidence on the mound." },
  { id: "p3", name: "Pitch Count Simulated Innings", category: "Pitching", duration: 15, coach: "Shari", description: "Pitcher throws a simulated inning — 3 batters, full count sequences. Catcher works on framing. Builds game-like rhythm and stamina without needing live hitters. Track pitch count." },
  // ── Game Situations ──
  { id: "g1", name: "Situation Ball", category: "Game Play", duration: 20, coach: "All", description: "Coach calls out a situation (runners on 1st and 3rd, 1 out, ground ball to short). Hit the ball, everyone executes. Best drill for game IQ — teaches every player where to go and what to do. Full team, full field." },
  { id: "g2", name: "First & Third Defense", category: "Game Play", duration: 15, coach: "Ken", description: "Runners on 1st and 3rd — practice defensive reads for different steal scenarios. What does the catcher do? Where does the SS go? When do you throw through vs. hold? Critical game situation for this age group." },
  { id: "g3", name: "Bunt Defense", category: "Game Play", duration: 15, coach: "Ken", description: "Runner on 3rd, batter squares to bunt. Practice the squeeze play offense AND the defensive reaction. Who charges? Who covers? What if the bunt is popped up? Game situation that decides close games." },
  { id: "g4", name: "Live Scrimmage Innings", category: "Game Play", duration: 25, coach: "All", description: "Actual at-bats with full defense on the field. The most realistic practice possible. Keep score, make it competitive. Rotate pitchers. Best used late in practice when energy is high and fundamentals have been drilled." },
  // ── Conditioning ──
  { id: "c1", name: "Agility Ladder", category: "Conditioning", duration: 10, coach: "Any", description: "Quick feet through the ladder: two-in each box, in-out, lateral shuffle, Icky shuffle, single-leg hops. Builds footwork, coordination, and quickness. Uses your agility ladder set. Make it a race." },
  { id: "c2", name: "Cone & Hurdle Course", category: "Conditioning", duration: 10, coach: "Any", description: "Sprint, shuffle, backpedal between cones. Add mini hurdles for explosion and hip flexibility. Uses your agility training set (cones + mini hurdles). Great warm-up or end-of-practice conditioner." },
  { id: "c3", name: "Jump Rope Intervals", category: "Conditioning", duration: 10, coach: "Any", description: "30 seconds jumping, 10 seconds rest, repeat 8 rounds. Mix it up: basic bounce, alternating feet, high knees, double-unders. Builds cardio, foot coordination, and rhythm. Great warm-up or conditioning finisher. Uses your jump rope from agility set." },
  { id: "c4", name: "Hurdle Hops", category: "Conditioning", duration: 10, coach: "Any", description: "Set up 4 hurdles 2-3ft apart. Two-foot hop over each hurdle, focusing on explosive power and soft landings. Progress to lateral hops and single-leg hops. Builds leg power for batting, throwing, and running. Uses your adjustable hurdles (start low!)." },
  { id: "c5", name: "Ladder-Hurdle Combo", category: "Conditioning", duration: 12, coach: "Any", description: "Set up ladder, then 4 hurdles right after. Quick feet through the ladder, then explosive hops over hurdles. Combines speed footwork with power. Advanced conditioning drill — make it a race. Uses your 20ft ladder + adjustable hurdles." },
  // ── Mental ──
  { id: "m1", name: "Team Mental Huddle", category: "Mental", duration: 5, coach: "Head Coach", description: "5-minute talk on ONE mental skill. Topics: positive self-talk, shaking off errors, cheering for teammates, what to focus on during at-bats, being a good teammate, handling pressure. Pick one per practice — don't overload." },
];

const D = (id) => DRILL_LIBRARY.find(d => d.id === id);

const PRACTICE_TEMPLATES = [
  // ═══ EARLY SEASON (Weeks 1-4) ═══
  { id: "early1", name: "Early Season — Fundamentals & Team Building", duration: 120, focus: "Fundamentals",
    description: "First 2-3 weeks. Build culture, assess players, teach basics.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: 'What does being a Pirate mean? We support each other.'" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("t1"), assignedCoach: "Throwing", station: "A" },
        { ...D("f1"), assignedCoach: "Infield", station: "B" },
        { ...D("h1"), assignedCoach: "Hitting", station: "C" },
      ]},
      { name: "Full Team — Baserunning", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any" },
        { ...D("b2"), assignedCoach: "Any" },
      ]},
      { name: "Competition", type: "together", time: "20 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — great energy builder for the first week" },
      ]},
      { name: "Cool Down", type: "together", time: "10 min", drills: [
        { ...D("c1"), assignedCoach: "Any" },
      ]},
    ]},
  { id: "early2", name: "Early Season — Throwing & Hitting Basics", duration: 120, focus: "Mechanics",
    description: "Week 2-3. Focus on proper throwing mechanics and hitting foundation.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Throwing Fundamentals", type: "together", time: "20 min", drills: [
        { ...D("t1"), assignedCoach: "Throwing", notes: "One-knee throwing — isolate arm mechanics" },
        { ...D("t2"), assignedCoach: "Throwing", notes: "Rock & Fire — weight transfer" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("h1"), assignedCoach: "Hitting", station: "A", notes: "Tee work — check stance, grip, swing path" },
        { ...D("h2"), assignedCoach: "Hitting", station: "B", notes: "Freeze drill — slow down rushed swings" },
        { ...D("f6"), assignedCoach: "Infield", station: "C", notes: "Bare hand pickups — soft hands" },
      ]},
      { name: "Baserunning Basics", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any", notes: "Time each player — track improvement" },
        { ...D("b4"), assignedCoach: "Any", notes: "Sliding on grass — safety first" },
      ]},
      { name: "Fun Finish", type: "together", time: "15 min", drills: [
        { ...D("b5"), assignedCoach: "Any", notes: "Baserunning race — competitive energy" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Positive self-talk — we all make mistakes" },
      ]},
    ]},
  { id: "early3", name: "Early Season — Defense & Confidence Building", duration: 120, focus: "Defense",
    description: "Week 3-4. Ground balls, fly balls, and building defensive confidence.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("f1"), assignedCoach: "Infield", station: "A", notes: "Ground ball fundamentals — charge, field, throw" },
        { ...D("f4"), assignedCoach: "Outfield", station: "B", notes: "Fly ball tracking — drop step, read the ball" },
        { ...D("f10"), assignedCoach: "Defense", station: "C", notes: "Lateral shuffle box — defensive positioning" },
      ]},
      { name: "Full Team Throwing", type: "together", time: "15 min", drills: [
        { ...D("t3"), assignedCoach: "Any", notes: "Long toss — distance challenge" },
      ]},
      { name: "Hitting Competition", type: "together", time: "25 min", drills: [
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball — quick hands drill" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based hitting — quality contact" },
      ]},
      { name: "Conditioning", type: "together", time: "10 min", drills: [
        { ...D("c2"), assignedCoach: "Any", notes: "Cone & hurdle course — footwork" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Cheering for teammates — we win together" },
      ]},
    ]},
  { id: "early4", name: "Early Season — All-Around Assessment", duration: 120, focus: "Assessment",
    description: "Week 3-4. Assess each player across all skills to identify strengths.",
    phases: [
      { name: "Warm-Up & Throwing", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("t2"), assignedCoach: "Throwing", notes: "Rock & Fire — assess arm strength" },
      ]},
      { name: "Station Rotations", type: "stations", time: "50 min (3 groups × 15 min each + 5 min buffer)", drills: [
        { ...D("f1"), assignedCoach: "Infield", station: "A", notes: "Assess fielding — speed, hands, accuracy" },
        { ...D("h3"), assignedCoach: "Hitting", station: "B", notes: "Inside/outside tee — assess swing path" },
        { ...D("f8"), assignedCoach: "Infield", station: "C", notes: "Cone triangle — assess footwork & angles" },
      ]},
      { name: "Baserunning Assessment", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any", notes: "Time every player — record for tracking" },
        { ...D("b6"), assignedCoach: "Any", notes: "Four corners box — assess explosive first-step" },
        { ...D("b2"), assignedCoach: "Any", notes: "Assess rounding technique" },
      ]},
      { name: "Hitting Competition", type: "together", time: "25 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — see who thrives under pressure" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Every player brings something unique to this team" },
      ]},
    ]},

  // ═══ MID SEASON (Weeks 5-8) ═══
  { id: "mid1", name: "Mid Season — Game Situations & Refining", duration: 120, focus: "Game IQ",
    description: "Fundamentals are solid. Focus on game IQ and competitive reps.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any", notes: "Shoulder bands for pitchers especially" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Machine BP — vary speeds" },
        { ...D("f9"), assignedCoach: "Infield", station: "B", notes: "Cone weave grounders — lateral movement while fielding" },
        { ...D("p1"), assignedCoach: "Pitching", station: "C", notes: "Rose, Kaizley, Jayden + catchers" },
      ]},
      { name: "Full Team — Game Situations", type: "together", time: "35 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Call different scenarios each round" },
        { ...D("g2"), assignedCoach: "Infield" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: What did we learn from last game?" },
      ]},
    ]},
  { id: "mid2", name: "Mid Season — Advanced Defense & Relays", duration: 120, focus: "Defense",
    description: "Week 5-7. Outfield relays, cutoffs, and rapid-fire infield work.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Outfield Work", type: "together", time: "20 min", drills: [
        { ...D("f10"), assignedCoach: "Any", notes: "Lateral shuffle box — defensive positioning" },
        { ...D("f4"), assignedCoach: "Any", notes: "Fly ball tracking — read off the bat" },
        { ...D("t4"), assignedCoach: "Throwing", notes: "Relay & cutoff — through vs. do-or-die" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("f2"), assignedCoach: "Infield", station: "A", notes: "Rapid fire — 3B, 2B, 1B in sequence" },
        { ...D("h6"), assignedCoach: "Hitting", station: "B", notes: "Live machine BP — game speeds" },
        { ...D("f5"), assignedCoach: "Outfield", station: "C", notes: "Triangle pop fly — communication" },
      ]},
      { name: "Game Situations", type: "together", time: "20 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Focus on outfield scenarios — gaps, over heads" },
      ]},
      { name: "Competition", type: "together", time: "10 min", drills: [
        { ...D("h8"), assignedCoach: "Any" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Trusting your teammates — make the play" },
      ]},
    ]},
  { id: "mid3", name: "Mid Season — Hitting Power & Speed Adjustment", duration: 120, focus: "Hitting",
    description: "Week 6-8. Refine swing mechanics, adjust to pitch speeds, drive the ball.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "50 min (3 groups × 15 min each + 5 buffer)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Machine BP — challenge speeds" },
        { ...D("h7"), assignedCoach: "Hitting", station: "B", notes: "Speed changes — adjust timing" },
        { ...D("h3"), assignedCoach: "Hitting", station: "C", notes: "Inside/outside tee — hit to all fields" },
      ]},
      { name: "Bunting Practice", type: "together", time: "15 min", drills: [
        { ...D("h10"), assignedCoach: "Any", notes: "Sacrifice & drag bunts — game situations" },
      ]},
      { name: "Hitting Competition", type: "together", time: "30 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — full 6 levels" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based — line drives win" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Quality at-bats — make the pitcher work" },
      ]},
    ]},
  { id: "mid4", name: "Mid Season — Pressure Situations & 21 Outs", duration: 120, focus: "Pressure",
    description: "Week 6-8. Build focus under pressure. Team accountability.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "40 min", drills: [
        { ...D("h5"), assignedCoach: "Hitting", station: "A", notes: "Front toss — timing under pressure" },
        { ...D("f7"), assignedCoach: "Infield", station: "B", notes: "Scoop step throw — eliminate wasted movement" },
        { ...D("p2"), assignedCoach: "Pitching", station: "C", notes: "Pitch location — hit your spots" },
      ]},
      { name: "Full Team — 21 Outs", type: "together", time: "30 min", drills: [
        { ...D("f3"), assignedCoach: "All Coaches", notes: "Goal: 21 consecutive outs. Reset on error. Team accountability." },
      ]},
      { name: "Game Situations", type: "together", time: "20 min", drills: [
        { ...D("g3"), assignedCoach: "Infield", notes: "Bunt defense — squeeze play" },
        { ...D("g2"), assignedCoach: "Infield", notes: "First & third — steal scenarios" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Handling pressure — breathe, trust your training" },
      ]},
    ]},

  // ═══ END SEASON / TOURNAMENT PREP (Last 3 weeks) ═══
  { id: "late1", name: "End Season — Tournament Prep & Live Scrimmage", duration: 120, focus: "Game Ready",
    description: "Last 3 weeks. Simulate real games. Keep it fun and competitive.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any", notes: "Pitchers especially" },
        { ...D("c5"), assignedCoach: "Any", notes: "Ladder-hurdle combo — dynamic warm-up" },
      ]},
      { name: "Pre-Game Hitting", type: "together", time: "25 min", drills: [
        { ...D("h4"), assignedCoach: "Any", notes: "Soft toss — feel-good swings" },
        { ...D("h6"), assignedCoach: "Hitting", notes: "8-10 swings each — confidence builders" },
      ]},
      { name: "Live Scrimmage", type: "together", time: "60 min", drills: [
        { ...D("g4"), assignedCoach: "All Coaches", notes: "Full game simulation. Keep score. Rotate pitchers. Most realistic practice." },
      ]},
      { name: "Cool Down & Mental", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Trust your training. You're ready for tournament." },
      ]},
    ]},
  { id: "late2", name: "End Season — Pre-Game Light Work", duration: 120, focus: "Pre-Game",
    description: "Day before tournament or big game. Light reps, build confidence.",
    phases: [
      { name: "Warm-Up & Throwing", type: "together", time: "20 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("t3"), assignedCoach: "Any", notes: "Long toss — build arm strength, keep it fun" },
      ]},
      { name: "Light Hitting", type: "together", time: "30 min", drills: [
        { ...D("h4"), assignedCoach: "Any", notes: "Light soft toss — feel good swings, not fixing mechanics" },
        { ...D("h6"), assignedCoach: "Any", notes: "8-10 swings each on the machine, low pressure" },
      ]},
      { name: "Defensive Review", type: "together", time: "25 min", drills: [
        { ...D("b2"), assignedCoach: "Any", notes: "Review rounding bases" },
        { ...D("f4"), assignedCoach: "Outfield", notes: "Fly ball tracking — outfielders especially" },
      ]},
      { name: "Mental Prep", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Talk about opponent, focus cues, positive energy. 'Trust your training.'" },
      ]},
      { name: "Fun Finish", type: "together", time: "15 min", drills: [
        { ...D("h9"), assignedCoach: "Any", notes: "Points-Based Hitting — end on a high note" },
      ]},
    ]},
  { id: "late3", name: "End Season — Fun & Competitions Day", duration: 120, focus: "Fun",
    description: "Last week of season. All competitions, keep energy high, celebrate the season.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Competitions", type: "together", time: "40 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — crown the champion" },
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball — quick hands" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based team draft" },
      ]},
      { name: "Fielding Competition", type: "together", time: "25 min", drills: [
        { ...D("f3"), assignedCoach: "All Coaches", notes: "21 Outs challenge — beat your record" },
      ]},
      { name: "Baserunning Races", type: "together", time: "20 min", drills: [
        { ...D("b5"), assignedCoach: "Any", notes: "Race to 2nd and race home — bracket style" },
        { ...D("b7"), assignedCoach: "Any", notes: "Star drill — multi-direction competition" },
        { ...D("b1"), assignedCoach: "Any", notes: "Home to first — final season times" },
      ]},
      { name: "Conditioning Challenge", type: "together", time: "10 min", drills: [
        { ...D("c5"), assignedCoach: "Any", notes: "Ladder-hurdle combo — advanced challenge race" },
      ]},
      { name: "Team Celebration", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Season reflection — shoutouts, favorite memories, what we accomplished" },
      ]},
    ]},
  { id: "late4", name: "End Season — Advanced Skills & Team Chemistry", duration: 120, focus: "Advanced",
    description: "Final 2-3 weeks. Polish advanced skills, build team chemistry for playoffs.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("h7"), assignedCoach: "Hitting", station: "A", notes: "Speed changes — timing mastery" },
        { ...D("c4"), assignedCoach: "Conditioning", station: "B", notes: "Hurdle hops — explosive power for tournament prep" },
        { ...D("p3"), assignedCoach: "Pitching", station: "C", notes: "Simulated innings — pitch count management" },
      ]},
      { name: "Advanced Game Situations", type: "together", time: "35 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Complex scenarios — multiple runners" },
        { ...D("g2"), assignedCoach: "Infield", notes: "First & third defense — make the right read" },
        { ...D("g3"), assignedCoach: "Infield", notes: "Bunt defense — squeeze situations" },
      ]},
      { name: "Competition Finish", type: "together", time: "15 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — end practice on a high" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Playing for each other — we're at our best when we play together" },
      ]},
    ]},

  // ═══ SPECIAL PURPOSE ═══
  { id: "special1", name: "Hitting-Focused Day", duration: 120, focus: "Hitting",
    description: "All offense. 3 hitting stations rotating, plus competitive hitting games.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Station Rotations", type: "stations", time: "45 min (3 groups × 15 min each)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Jugs machine — vary speeds each round" },
        { ...D("h3"), assignedCoach: "Hitting", station: "B", notes: "Inside/outside tee — move tee between reps" },
        { ...D("h5"), assignedCoach: "Hitting", station: "C", notes: "Front toss — focus on timing" },
      ]},
      { name: "Bunting", type: "together", time: "10 min", drills: [
        { ...D("h10"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Competitions", type: "together", time: "40 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen — 6 levels" },
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball — quick hands competition" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-Based Hitting — team draft" },
      ]},
      { name: "Cool Down", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "What felt good today? What do we work on next?" },
      ]},
    ]},
];

const MSG_TEMPLATES = [
  { id: "t1", name: "Season Welcome", body: `Hi Pirates Families!\n\nWelcome to the 2026 season!\n\n🥎 Coaches: Devin Doxey (Head), Ken (Assistant), Shari (Pitching)\n\n🥎 Philosophy: Development + love of the game. Every girl gets time and tries positions.\n\n🥎 Bring: Glove, bat, helmet, water, cleats, positive attitude!\n\nI'll send updates through [METHOD]. Questions? Reach out anytime.\n\nGo Pirates! 🏴‍☠️` },
  { id: "t2", name: "Practice Reminder", body: `Hi Pirates Families!\n\nPractice: [DAY] at [TIME] at [LOCATION]\n\nWorking on: [FOCUS]\n\n10 min early please. Let me know if she can't make it.\n\nGo Pirates! 🏴‍☠️` },
  { id: "t3", name: "Game Day Info", body: `Hi Pirates Families!\n\n📍 [LOCATION]\n⏰ Arrive: [TIME] (game at [GAME TIME])\n🆚 [OPPONENT]\n\nFull uniform. Early for warm-ups.\n\nGo Pirates! 🏴‍☠️` },
  { id: "t4", name: "Schedule Change", body: `Hi Pirates Families!\n\n⚠️ [CHANGE DETAILS]\n\nNew plan: [DETAILS]\n\nSorry for the inconvenience.\n\nGo Pirates! 🏴‍☠️` },
  { id: "t5", name: "Weekly Recap", body: `Hi Pirates Families!\n\nGreat week!\n\n✅ Worked on: [TOPICS]\n⭐ Shoutouts: [PLAYER — REASON]\n📅 Next: [EVENT]\n\nGo Pirates! 🏴‍☠️` },
];

const SEED_PLAYERS = [
  { id: "ret1", name: "Aurie Ellison", nickname: "", grade: "9th", returning: true, yearsExp: 1, positions: ["3B", "LF", "2B", "SS"], preferredPosition: "3B", parentName: "Josh and Kalee Ellison", parentPhone: "(808) 747-1950", parentEmail: "", school: "Viewpoint", jersey: "32", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Returning. Primary: 3B. Versatile infielder.", isPitcher: false },
  { id: "ret2", name: "Jessica Allen", nickname: "Wheels", grade: "9th", returning: true, yearsExp: 1, positions: ["LCF", "2B", "RCF"], preferredPosition: "LCF", parentName: "David and Julie Allen", parentPhone: "(801) 225-6418", parentEmail: "", school: "Willowcreek", jersey: "13", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Returning. Fast baserunner. Primary: LCF.", isPitcher: false },
  { id: "ret3", name: "Kaylie Jo Kirk", nickname: "", grade: "8th", returning: true, yearsExp: 1, positions: ["SS", "3B", "2B"], preferredPosition: "SS", parentName: "Brandon Kirk", parentPhone: "(801) 318-9384", parentEmail: "", school: "Viewpoint", jersey: "27", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Returning. Primary: SS. Consistent.", isPitcher: false },
  { id: "ret4", name: "Rose Hall", nickname: "", grade: "8th", returning: true, yearsExp: 1, positions: ["P", "2B"], preferredPosition: "P", parentName: "Sheila and Nathon Khammuan", parentPhone: "(801) 529-5730", parentEmail: "", school: "Viewpoint", jersey: "33", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Returning. #1 pitcher.", isPitcher: true },
  { id: "ret5", name: "Teagan Doxey", nickname: "", grade: "9th", returning: true, yearsExp: 1, positions: ["1B", "C"], preferredPosition: "1B", parentName: "Ashley and Devin Doxey", parentPhone: "(801) 361-7966", parentEmail: "", school: "Willowcreek", jersey: "34", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Returning. Primary: 1B, Backup: C.", isPitcher: false },
  { id: "new1", name: "Penny Mickiewicz", nickname: "", grade: "9th", returning: false, yearsExp: 0, positions: ["1B"], preferredPosition: "", parentName: "Candi Mickiewicz", parentPhone: "(385) 499-4389", parentEmail: "", school: "Willowcreek", jersey: "", skills: { Hitting: 5, Fielding: 5, Throwing: 5, Baserunning: 0, Pitching: 0, Attitude: 5 }, notes: "Tryout: 98.2% #1. Elite all-around.", isPitcher: false },
  { id: "new2", name: "Rilo Stembridge", nickname: "", grade: "7th", returning: false, yearsExp: 0, positions: ["SS"], preferredPosition: "", parentName: "Emily Stembridge", parentPhone: "(801) 427-1240", parentEmail: "", school: "Willowcreek", jersey: "", skills: { Hitting: 5, Fielding: 5, Throwing: 4, Baserunning: 3, Pitching: 0, Attitude: 5 }, notes: "Tryout: 95% #3. Outstanding 7th grader.", isPitcher: false },
  { id: "new3", name: "Evie Woffinden", nickname: "", grade: "7th", returning: false, yearsExp: 0, positions: ["1B"], preferredPosition: "", parentName: "Jenny and Aaron Woffinden", parentPhone: "(801) 592-6734", parentEmail: "", school: "Willowcreek", jersey: "", skills: { Hitting: 4, Fielding: 5, Throwing: 4, Baserunning: 4, Pitching: 0, Attitude: 5 }, notes: "Tryout: 91.3%. Athletic, good speed.", isPitcher: false },
  { id: "new4", name: "Kaizley Long", nickname: "", grade: "8th", returning: false, yearsExp: 0, positions: ["P"], preferredPosition: "", parentName: "Holly & Jesse Long", parentPhone: "(801) 473-2585", parentEmail: "", school: "Viewpoint", jersey: "", skills: { Hitting: 4, Fielding: 4, Throwing: 4, Baserunning: 0, Pitching: 5, Attitude: 0 }, notes: "Tryout: 82.5%. PITCH 4.5 — #2 pitcher.", isPitcher: true },
  { id: "new5", name: "Lucy Norton", nickname: "", grade: "8th", returning: false, yearsExp: 0, positions: ["1B"], preferredPosition: "", parentName: "Skyler Fankhauser", parentPhone: "(801) 362-7996", parentEmail: "", school: "Eagle Mtn Schools", jersey: "", skills: { Hitting: 4, Fielding: 4, Throwing: 4, Baserunning: 0, Pitching: 0, Attitude: 4 }, notes: "Tryout: 78.3%. Solid, well-rounded.", isPitcher: false },
  { id: "new6", name: "Jayden Fawson", nickname: "", grade: "7th", returning: false, yearsExp: 0, positions: ["P"], preferredPosition: "", parentName: "Stephanie & Mike", parentPhone: "(714) 814-1313", parentEmail: "", school: "Other", jersey: "", skills: { Hitting: 2, Fielding: 4, Throwing: 3, Baserunning: 5, Pitching: 4, Attitude: 0 }, notes: "Tryout: 72%. PITCH 4. #3 pitcher. Fast runner.", isPitcher: true },
  { id: "new7", name: "Autumn Clucas", nickname: "", grade: "9th", returning: false, yearsExp: 0, positions: ["1B"], preferredPosition: "", parentName: "Chad Clucas", parentPhone: "(801) 231-8816", parentEmail: "", school: "Other", jersey: "", skills: { Hitting: 4, Fielding: 3, Throwing: 3, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Tryout: 66.7%. Development player.", isPitcher: false },
  { id: "new8", name: "Kynzlee Miller", nickname: "", grade: "7th", returning: false, yearsExp: 0, positions: [], preferredPosition: "", parentName: "Amanda & Curtis Miller", parentPhone: "(702) 358-3371", parentEmail: "", school: "Viewpoint", jersey: "", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "Not in scored tryouts. Assess at first practice.", isPitcher: false },
];

const SEED_COACHES = [
  { id: "c1", name: "Devin Doxey", role: "Head Coach", phone: "(801) 361-7966", email: "", specialties: ["Strategy", "Hitting"] },
  { id: "c2", name: "Ken", role: "Assistant Coach", phone: "", email: "", specialties: ["Infield", "Defense"] },
  { id: "c3", name: "Shari", role: "Pitching Coach", phone: "", email: "", specialties: ["Pitching", "Throwing"] },
];

const SEED_PRACTICES = [
  {
    id: "test-practice-1",
    date: "2026-03-15",
    time: "5:00 PM",
    duration: 120,
    focus: "Hitting fundamentals and base running",
    status: "completed",
    attendance: {
      "ret1": true, "ret2": true, "ret3": true, "ret4": true, "ret5": true,
      "new1": true, "new2": true, "new3": true, "new4": false, "new5": true,
      "new6": true, "new7": true, "new8": true
    },
    drills: [
      { id: "w1", name: "Dynamic Warm-Up", category: "Warm-Up", duration: 10, coach: "Any" },
      { id: "b1", name: "Home to First Sprint", category: "Baserunning", duration: 10, coach: "Any" },
      { id: "p2", name: "Pitch Location Work", category: "Pitching", duration: 15, coach: "Shari" },
      { id: "h9", name: "Points-Based Hitting", category: "Hitting", duration: 15, coach: "Any" },
      { id: "h10", name: "Bunt Stations", category: "Hitting", duration: 10, coach: "Any" },
      { id: "h11", name: "Batting Queen", category: "Hitting", duration: 15, coach: "Any" },
      { id: "f3", name: "21 Outs Drill", category: "Fielding", duration: 20, coach: "All" }
    ],
    drillTracking: {
      "b1": {
        "ret1": "3.2", "ret2": "2.9", "ret3": "3.1", "ret4": "3.3", "ret5": "3.4",
        "new1": "3.0", "new2": "2.8", "new3": "3.2", "new5": "3.3",
        "new6": "2.7", "new7": "3.5", "new8": "3.6"
      },
      "p2": {
        "ret4": { strikes: 18, balls: 7 },
        "new4": { strikes: 15, balls: 10 },
        "new6": { strikes: 12, balls: 13 }
      },
      "f3": "17",
      "h9": {
        "ret1": "12", "ret2": "15", "ret3": "11", "ret4": "9", "ret5": "13",
        "new1": "18", "new2": "14", "new3": "10", "new5": "11",
        "new6": "8", "new7": "7", "new8": "6"
      },
      "h10": {
        "ret1": "8", "ret2": "9", "ret3": "7", "ret4": "6", "ret5": "8",
        "new1": "10", "new2": "9", "new3": "7", "new5": "6",
        "new6": "5", "new7": "4", "new8": "3"
      },
      "h11": {
        "ret1": "4", "ret2": "5", "ret3": "4", "ret4": "3", "ret5": "4",
        "new1": "6", "new2": "5", "new3": "4", "new5": "3",
        "new6": "3", "new7": "2", "new8": "2"
      }
    },
    observations: {
      "new1": "Outstanding all-around performance",
      "new2": "Great speed and bat control",
      "ret2": "Excellent speed work, best sprint time",
      "new6": "Needs pitching consistency work"
    },
    coachNotes: "Great practice! Players showed excellent energy. Focus on pitching control next time.",
    drillsRun: "Dynamic Warm-Up, Home to First Sprint, Pitch Location Work, Points-Based Hitting, Bunt Stations, Batting Queen, 21 Outs Drill",
    groups: {}
  }
];

const SEED_GAMELOGS = [
  {
    id: "test-game-1",
    date: "2026-03-22",
    opponent: "Wildcats",
    location: "Home Field",
    result: "W",
    score: "8-5",
    ourScore: 8,
    theirScore: 5,
    innings: 7,
    lineup: [
      { playerId: "new1", position: "1B", battingOrder: 1 },
      { playerId: "ret2", position: "CF", battingOrder: 2 },
      { playerId: "ret3", position: "SS", battingOrder: 3 },
      { playerId: "ret1", position: "3B", battingOrder: 4 },
      { playerId: "ret5", position: "C", battingOrder: 5 },
      { playerId: "new2", position: "2B", battingOrder: 6 },
      { playerId: "new3", position: "LF", battingOrder: 7 },
      { playerId: "new5", position: "RF", battingOrder: 8 },
      { playerId: "new7", position: "Bench", battingOrder: 9 }
    ],
    atBats: [
      { playerId: "new1", inning: 1, result: "1B", rbi: 0, runs: 1 },
      { playerId: "ret2", inning: 1, result: "2B", rbi: 1, runs: 1 },
      { playerId: "ret3", inning: 1, result: "GO", rbi: 0, runs: 0 },
      { playerId: "ret1", inning: 1, result: "K", rbi: 0, runs: 0 },
      { playerId: "new1", inning: 3, result: "HR", rbi: 2, runs: 1 },
      { playerId: "ret2", inning: 3, result: "1B", rbi: 0, runs: 1 },
      { playerId: "ret3", inning: 3, result: "1B", rbi: 1, runs: 0 },
      { playerId: "ret1", inning: 3, result: "FO", rbi: 0, runs: 0 },
      { playerId: "ret5", inning: 3, result: "BB", rbi: 0, runs: 1 },
      { playerId: "new2", inning: 4, result: "2B", rbi: 1, runs: 1 },
      { playerId: "new3", inning: 4, result: "GO", rbi: 0, runs: 0 },
      { playerId: "new5", inning: 5, result: "1B", rbi: 0, runs: 0 },
      { playerId: "new1", inning: 5, result: "K", rbi: 0, runs: 0 },
      { playerId: "ret2", inning: 6, result: "3B", rbi: 2, runs: 1 },
      { playerId: "ret3", inning: 6, result: "GO", rbi: 0, runs: 0 }
    ],
    pitching: [
      { playerId: "ret4", inningsP: 5, pitches: 78, strikes: 52, balls: 26, k: 6, bb: 2, runs: 3, er: 2 },
      { playerId: "new4", inningsP: 2, pitches: 31, strikes: 19, balls: 12, k: 2, bb: 1, runs: 2, er: 1 }
    ],
    notes: "Great team win! Penny hit a huge home run in the 3rd. Rose pitched strong through 5 innings.",
    mvp: "new1"
  }
];

// ─── Storage ────────────────────────────────────────────────────
const loadStore = async (key, fb) => { try { const r = await window.storage.get(key); return r?.value ? JSON.parse(r.value) : fb; } catch { return fb; } };
const saveStore = async (key, d) => { try { await window.storage.set(key, JSON.stringify(d)); } catch {} };

// ─── UI Components ──────────────────────────────────────────────
const StarRating = ({ value, onChange, size = 18 }) => <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <button key={s} onClick={() => onChange(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: size, lineHeight: 1, color: s <= value ? THEME.gold : THEME.grayLight }}>★</button>)}</div>;
const Badge = ({ children, color = THEME.gold, bg = "rgba(253,181,21,0.15)" }) => <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, color, background: bg, letterSpacing: 0.5, textTransform: "uppercase" }}>{children}</span>;
const Button = ({ children, onClick, variant = "primary", small, style: xs, ...p }) => { const b = { padding: small ? "6px 12px" : "10px 20px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: small ? 12 : 14, transition: "all 0.2s", letterSpacing: 0.3, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }; const v = { primary: { background: THEME.gold, color: THEME.black }, secondary: { background: THEME.charcoal, color: THEME.white }, danger: { background: THEME.red, color: THEME.white }, ghost: { background: "transparent", color: THEME.gold, border: `1px solid ${THEME.gold}` } }; return <button onClick={onClick} style={{ ...b, ...v[variant], ...xs }} {...p}>{children}</button>; };
const Card = ({ children, style }) => <div style={{ background: THEME.blackLight, borderRadius: 10, padding: 20, border: `1px solid ${THEME.charcoal}`, ...style }}>{children}</div>;
const Input = ({ label, ...p }) => <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{label && <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>{label}</label>}<input {...p} style={{ padding: "8px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, fontFamily: "'Source Sans 3',sans-serif", outline: "none", ...(p.style||{}) }} /></div>;
const Select = ({ label, children, ...p }) => <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{label && <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>{label}</label>}<select {...p} style={{ padding: "8px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, outline: "none", ...(p.style||{}) }}>{children}</select></div>;
const TextArea = ({ label, ...p }) => <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{label && <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif" }}>{label}</label>}<textarea {...p} style={{ padding: "8px 12px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 14, fontFamily: "'Source Sans 3',sans-serif", outline: "none", resize: "vertical", minHeight: 80, ...(p.style||{}) }} /></div>;
const SL = ({ children }) => <label style={{ fontSize: 11, fontWeight: 700, color: THEME.gray, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Oswald',sans-serif", marginBottom: 6, display: "block" }}>{children}</label>;

const Modal = ({ open, onClose, title, children, wide }) => { if (!open) return null; return <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}><div onClick={e => e.stopPropagation()} style={{ background: THEME.blackLight, borderRadius: 12, padding: 24, border: `1px solid ${THEME.gold}`, maxWidth: wide ? 800 : 520, width: "100%", maxHeight: "85vh", overflowY: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h3 style={{ margin: 0, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 20, textTransform: "uppercase" }}>{title}</h3><button onClick={onClose} style={{ background: "none", border: "none", color: THEME.gray, fontSize: 22, cursor: "pointer" }}>✕</button></div>{children}</div></div>; };

const Tabs = ({ tabs, active, onSelect }) => <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${THEME.charcoal}`, marginBottom: 20, overflowX: "auto" }}>{tabs.map(t => <button key={t.id} onClick={() => onSelect(t.id)} style={{ padding: "10px 14px", background: active === t.id ? THEME.gold : "transparent", color: active === t.id ? THEME.black : THEME.gray, border: "none", fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: active === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent", whiteSpace: "nowrap" }}>{t.icon} {t.label}</button>)}</div>;

const ToggleChips = ({ players, selected, onToggle }) => <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{players.map(p => <button key={p.id} onClick={() => onToggle(p.id)} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: "'Oswald',sans-serif", cursor: "pointer", background: selected[p.id] ? THEME.gold : THEME.black, color: selected[p.id] ? THEME.black : THEME.gray, border: `1px solid ${selected[p.id] ? THEME.gold : THEME.charcoal}` }}>{p.name.split(" ")[0]}</button>)}</div>;

// ─── ROSTER ─────────────────────────────────────────────────────
const emptyPlayer = () => ({ id: Date.now().toString(), name: "", nickname: "", grade: "7th", returning: false, yearsExp: 0, positions: [], primaryPosition: "", secondaryPositions: [], parentName: "", parentPhone: "", parentEmail: "", school: "", jersey: "", skills: { Hitting: 0, Fielding: 0, Throwing: 0, Baserunning: 0, Pitching: 0, Attitude: 0 }, notes: "", isPitcher: false, status: "active" });
const emptyCoach = () => ({ id: Date.now().toString(), name: "", role: "Assistant Coach", phone: "", email: "", specialties: [] });

const RosterPanel = ({ players, setPlayers, coaches, setCoaches }) => {
  const [editing, setEditing] = useState(null); const [show, setShow] = useState(false); const [form, setForm] = useState(emptyPlayer()); const [filter, setFilter] = useState("all");
  const [editingCoach, setEditingCoach] = useState(null); const [showCoach, setShowCoach] = useState(false); const [coachForm, setCoachForm] = useState(emptyCoach());

  const save = () => { if (!form.name.trim()) return; if (editing) setPlayers(p => p.map(x => x.id === editing ? { ...form } : x)); else setPlayers(p => [...p, { ...form, id: Date.now().toString() }]); setShow(false); setEditing(null); setForm(emptyPlayer()); };
  const saveCoach = () => { if (!coachForm.name.trim()) return; if (editingCoach) setCoaches(p => p.map(x => x.id === editingCoach ? { ...coachForm } : x)); else setCoaches(p => [...p, { ...coachForm, id: Date.now().toString() }]); setShowCoach(false); setEditingCoach(null); setCoachForm(emptyCoach()); };

  const filtered = filter === "all" ? players : filter === "returning" ? players.filter(p => p.returning) : players.filter(p => !p.returning);
  const avg = p => { const v = Object.values(p.skills).filter(x => x > 0); return v.length ? (v.reduce((a,b) => a+b,0)/v.length).toFixed(1) : "—"; };

  const COACH_ROLES = ["Head Coach", "Assistant Coach", "Pitching Coach", "Hitting Coach", "Base Coach"];
  const COACH_SPECIALTIES = ["Hitting", "Pitching", "Throwing", "Infield", "Outfield", "Defense", "Strategy", "Baserunning", "Conditioning"];

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>{["all","returning","new"].map(f => <Button key={f} small variant={filter===f?"primary":"ghost"} onClick={() => setFilter(f)}>{f==="all"?`All (${players.length})`:f==="returning"?`Returning (${players.filter(p=>p.returning).length})`:`New (${players.filter(p=>!p.returning).length})`}</Button>)}</div>
      <Button onClick={() => { setForm(emptyPlayer()); setEditing(null); setShow(true); }}>+ Add Player</Button>
    </div>
    {filtered.length === 0 ? <Card style={{ textAlign: "center", padding: 40 }}><p style={{ color: THEME.gray }}>No players yet.</p></Card> :
    <div style={{ display: "grid", gap: 10 }}>{filtered.map(p => <Card key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: p.returning ? THEME.gold : THEME.charcoal, color: p.returning ? THEME.black : THEME.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{p.jersey || p.name?.charAt(0) || "?"}</div>
        <div><div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>{p.name}{p.nickname ? ` "${p.nickname}"` : ""}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}><Badge>{p.grade}</Badge>{p.returning && <Badge color={THEME.green} bg="rgba(46,204,113,0.15)">Returning</Badge>}{p.isPitcher && <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">Pitcher</Badge>}{p.school && <Badge color={THEME.gray} bg="rgba(142,142,142,0.1)">{p.school}</Badge>}</div></div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {p.primaryPosition && <span style={{ padding: "2px 6px", background: THEME.gold, borderRadius: 4, fontSize: 11, color: THEME.black, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{p.primaryPosition}</span>}
        {(p.secondaryPositions||[]).map(pos => <span key={pos} style={{ padding: "2px 6px", background: THEME.blue, borderRadius: 4, fontSize: 11, color: THEME.white, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{pos}</span>)}
        {(p.positions||[]).length > 0 && !p.primaryPosition && (p.positions||[]).map(pos => <span key={pos} style={{ padding: "2px 6px", background: THEME.black, borderRadius: 4, fontSize: 11, color: THEME.goldLight, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{pos}</span>)}
      </div>
      <div style={{ color: THEME.gold, fontWeight: 700, fontFamily: "'Oswald',sans-serif", fontSize: 16 }}>{avg(p)}</div>
      <div style={{ display: "flex", gap: 4 }}><Button small variant="ghost" onClick={() => { setForm({...p}); setEditing(p.id); setShow(true); }}>Edit</Button><Button small variant="danger" onClick={() => setPlayers(x => x.filter(q => q.id !== p.id))}>✕</Button></div>
    </Card>)}</div>}

    {/* Coaching Staff Section */}
    <div style={{ marginTop: 40, paddingTop: 24, borderTop: `2px solid ${THEME.charcoal}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: THEME.gold, fontSize: 18, fontWeight: 700, fontFamily: "'Oswald',sans-serif", margin: 0, textTransform: "uppercase" }}>Coaching Staff</h3>
        <Button onClick={() => { setCoachForm(emptyCoach()); setEditingCoach(null); setShowCoach(true); }}>+ Add Coach</Button>
      </div>
      {coaches.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}><p style={{ color: THEME.gray }}>No coaches added yet.</p></Card>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {coaches.map(c => (
            <Card key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: THEME.blue, color: THEME.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {c.name?.charAt(0) || "C"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>{c.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                    <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{c.role}</Badge>
                    {(c.specialties||[]).map(spec => (
                      <Badge key={spec} color={THEME.gray} bg="rgba(142,142,142,0.1)">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <Button small variant="ghost" onClick={() => { setCoachForm({...c}); setEditingCoach(c.id); setShowCoach(true); }}>Edit</Button>
                <Button small variant="danger" onClick={() => setCoaches(x => x.filter(q => q.id !== c.id))}>✕</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>

    <Modal open={show} onClose={() => { setShow(false); setEditing(null); }} title={editing ? "Edit Player" : "Add Player"} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Input label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><Input label="Nickname" value={form.nickname||""} onChange={e => setForm({...form, nickname: e.target.value})} /><Select label="Grade" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>{GRADES.map(g => <option key={g} value={g}>{g}</option>)}</Select>
        <Input label="School" value={form.school||""} onChange={e => setForm({...form, school: e.target.value})} /><Input label="Jersey #" value={form.jersey||""} onChange={e => setForm({...form, jersey: e.target.value})} /><Input label="Years Exp" type="number" min={0} value={form.yearsExp} onChange={e => setForm({...form, yearsExp: parseInt(e.target.value)||0})} />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}><label style={{ color: THEME.white, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={form.returning} onChange={e => setForm({...form, returning: e.target.checked})} /> Returning</label><label style={{ color: THEME.white, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" checked={form.isPitcher} onChange={e => setForm({...form, isPitcher: e.target.checked})} /> Pitcher</label></div>
      <div style={{ marginTop: 12 }}>
        <SL>Primary Position</SL>
        <Select value={form.primaryPosition||""} onChange={e => setForm({...form, primaryPosition: e.target.value})}>
          <option value="">Select primary position...</option>
          {POSITIONS.filter(x=>x!=="Bench").map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </Select>
      </div>
      <div style={{ marginTop: 12 }}>
        <SL>Secondary Positions (Can Also Play)</SL>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {POSITIONS.filter(x=>x!=="Bench" && x!==form.primaryPosition).map(pos => (
            <button key={pos} onClick={() => setForm({...form, secondaryPositions: ((form.secondaryPositions||[]).includes(pos) ? (form.secondaryPositions||[]).filter(x=>x!==pos) : [...(form.secondaryPositions||[]), pos])})} style={{ padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: "'Oswald',sans-serif", cursor: "pointer", background: (form.secondaryPositions||[]).includes(pos)?THEME.blue:THEME.black, color: (form.secondaryPositions||[]).includes(pos)?THEME.white:THEME.gray, border: `1px solid ${(form.secondaryPositions||[]).includes(pos)?THEME.blue:THEME.charcoal}` }}>{pos}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12 }}><SL>Skills</SL><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{SKILL_AREAS.map(sk => <div key={sk} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: THEME.black, borderRadius: 6 }}><span style={{ color: THEME.white, fontSize: 13 }}>{sk}</span><StarRating value={form.skills[sk]} onChange={v => setForm({...form, skills: {...form.skills, [sk]: v}})} /></div>)}</div></div>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Input label="Parent Name" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} /><Input label="Parent Phone" value={form.parentPhone} onChange={e => setForm({...form, parentPhone: e.target.value})} /></div>
      <TextArea label="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ marginTop: 12 }} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}><Button variant="ghost" onClick={() => { setShow(false); setEditing(null); }}>Cancel</Button><Button onClick={save}>{editing?"Save":"Add"}</Button></div>
    </Modal>

    <Modal open={showCoach} onClose={() => { setShowCoach(false); setEditingCoach(null); }} title={editingCoach ? "Edit Coach" : "Add Coach"}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Name" value={coachForm.name} onChange={e => setCoachForm({...coachForm, name: e.target.value})} />
        <Select label="Role" value={coachForm.role} onChange={e => setCoachForm({...coachForm, role: e.target.value})}>
          {COACH_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <Input label="Phone" value={coachForm.phone||""} onChange={e => setCoachForm({...coachForm, phone: e.target.value})} />
        <Input label="Email" value={coachForm.email||""} onChange={e => setCoachForm({...coachForm, email: e.target.value})} />
      </div>
      <div style={{ marginTop: 12 }}>
        <SL>Specialties</SL>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {COACH_SPECIALTIES.map(spec => (
            <button
              key={spec}
              onClick={() => setCoachForm({...coachForm, specialties: (coachForm.specialties||[]).includes(spec) ? coachForm.specialties.filter(x=>x!==spec) : [...(coachForm.specialties||[]), spec]})}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Oswald',sans-serif",
                cursor: "pointer",
                background: (coachForm.specialties||[]).includes(spec)?THEME.gold:THEME.black,
                color: (coachForm.specialties||[]).includes(spec)?THEME.black:THEME.gray,
                border: `1px solid ${(coachForm.specialties||[]).includes(spec)?THEME.gold:THEME.charcoal}`
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button variant="ghost" onClick={() => { setShowCoach(false); setEditingCoach(null); }}>Cancel</Button>
        <Button onClick={saveCoach}>{editingCoach?"Save":"Add"}</Button>
      </div>
    </Modal>
  </div>;
};

// ─── EXPORT UTILITIES ───────────────────────────────────────────
const exportToCSV = (data, filename) => {
  const csv = data.map(row => row.map(cell => {
    // Escape quotes and wrap in quotes if contains comma
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── UNIFIED PRACTICE LOG ───────────────────────────────────────
const PracticeLog = ({ players, coaches }) => {
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("plan"); // "plan", "active", or "complete"
  const [form, setForm] = useState({});
  const [ed, setEd] = useState(null);
  const [df, setDf] = useState("all");
  const [exp, setExp] = useState(null);
  const [expandedDrill, setExpandedDrill] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Enhanced tracking states
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [trackingGroup, setTrackingGroup] = useState(null); // Which group coach is tracking for station drills

  const emptyPlan = () => ({
    id: "", date: "", time: "", duration: 120, focus: "", drills: [], notes: "", status: "planned",
    attendance: players.reduce((a, p) => ({ ...a, [p.id]: true }), {}),
    groups: {} // { playerId: "red" | "blue" | "gold" | null }
  });

  const emptyActive = (practice) => {
    // Initialize drill tracking for trackable drills in this practice
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

    // Initialize station rotation if this practice has station drills
    const stationDrills = (practice.drills || []).filter(d => d.station);
    const stationRotation = stationDrills.length > 0 ? {
      stations: stationDrills.map(d => ({
        id: d.station,
        drillId: d.id,
        drillName: d.name,
        currentGroup: null // Will be set manually by coach
      })),
      round: 1,
      active: false // Coach activates rotation when ready
    } : null;

    return {
      ...practice,
      status: "active",
      drillTracking: drillTracking,
      observations: players.reduce((a, p) => ({ ...a, [p.id]: "" }), {}),
      groups: practice.groups || {}, // Carry over groups from plan, or initialize empty
      stationRotation: practice.stationRotation || stationRotation
    };
  };

  const emptyComplete = (practice) => {
    return {
      ...practice,
      status: "completed",
      drillsRun: practice.drills?.map(d => d.name).join(", ") || "",
      coachNotes: practice.coachNotes || ""
    };
  };

  useEffect(() => {
    // Migrate data from old storage keys to unified structure
    const migrate = async () => {
      const oldPlans = await loadStore(STORAGE_KEYS.PRACTICES, []);
      const oldLogs = await loadStore(STORAGE_KEYS.PRACTICELOGS, []);
      const unified = await loadStore("pirates-practices-unified-2026v1", []);

      if (unified.length === 0 && (oldPlans.length > 0 || oldLogs.length > 0)) {
        // Migration needed
        const migrated = [
          ...oldPlans.map(p => ({ ...p, status: "planned" })),
          ...oldLogs.map(l => ({ ...l, status: "completed", drills: [] }))
        ];
        setList(migrated);
        saveStore("pirates-practices-unified-2026v1", migrated);
      } else {
        setList(unified);
      }
      setLoaded(true);
    };
    migrate();
  }, []);

  useEffect(() => { if (loaded) saveStore("pirates-practices-unified-2026v1", list); }, [list, loaded]);

  // Cleanup stopwatch interval on unmount or modal close
  useEffect(() => {
    return () => {
      if (stopwatchInterval.current) {
        clearInterval(stopwatchInterval.current);
      }
    };
  }, []);

  // Clear stopwatch when closing modal
  useEffect(() => {
    if (!show && stopwatchRunning) {
      setStopwatchRunning(false);
      clearInterval(stopwatchInterval.current);
      setStopwatchTime(0);
    }
  }, [show, stopwatchRunning]);

  const cats = ["all", ...new Set(DRILL_LIBRARY.map(d => d.category))];
  const fd = df === "all" ? DRILL_LIBRARY : DRILL_LIBRARY.filter(d => d.category === df);
  const tt = form.drills?.reduce((s, d) => s + d.duration, 0) || 0;

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
      console.log("Active form created:", activeForm);
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

  const loadTemplate = (tmpl) => {
    const allDrills = tmpl.phases.flatMap(phase => phase.drills.map(d => ({ ...d, phase: phase.name, phaseType: phase.type, station: d.station || null })));
    setForm({ ...form, focus: tmpl.focus, duration: tmpl.duration, drills: allDrills, notes: tmpl.description });
    setShowTemplates(false);
  };

  const planned = list.filter(p => p.status === "planned").sort((a,b) => (a.date||"").localeCompare(b.date||""));
  const active = list.filter(p => p.status === "active").sort((a,b) => (a.date||"").localeCompare(b.date||""));
  const completed = list.filter(p => p.status === "completed").sort((a,b) => (b.date||"").localeCompare(a.date||""));

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <p style={{ color: THEME.gray, margin: 0, fontSize: 13 }}>{list.length} practice{list.length !== 1 ? "s" : ""} ({planned.length} planned, {active.length} active, {completed.length} completed)</p>
      <Button onClick={() => { setForm(emptyPlan()); setEd(null); setMode("plan"); setShow(true); }}>+ Plan Practice</Button>
    </div>

    {list.length === 0 ? (
      <Card style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
        <p style={{ color: THEME.gray, margin: 0 }}>No practices yet. Plan your first practice!</p>
      </Card>
    ) : (
      <div>
        {planned.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: THEME.gold, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>📅 Upcoming & Planned</h3>
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
                      <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice?")) setList(x => x.filter(q => q.id !== p.id)); }}>✕</Button>
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

        {active.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: THEME.blue, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>🏃 Active Practice</h3>
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
                      <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice?")) setList(x => x.filter(q => q.id !== p.id)); }}>✕</Button>
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

        {completed.length > 0 && (
          <div>
            <h3 style={{ color: THEME.green, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald',sans-serif", marginBottom: 12, textTransform: "uppercase" }}>✅ Completed</h3>
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
                          return typeof data === 'object' ? Object.keys(data).length > 0 : data !== "";
                        }) && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">📊 Tracked</Badge>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Button small variant="ghost" onClick={e => { e.stopPropagation(); setForm({ ...l }); setEd(l.id); setMode("complete"); setShow(true); }}>Edit</Button>
                      <Button small variant="danger" onClick={e => { e.stopPropagation(); if (confirm("Delete this practice log?")) setList(x => x.filter(q => q.id !== l.id)); }}>✕</Button>
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

                      {/* Display Drill Tracking Data */}
                      {l.drillTracking && Object.keys(l.drillTracking).length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${THEME.charcoal}` }}>
                          <span style={{ color: THEME.gold, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>📊 Drill Metrics: </span>
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
                                  <div style={{ fontSize: 11, color: THEME.white }}>
                                    Team: {data} consecutive outs
                                  </div>
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
    <Modal open={show} onClose={() => { setShow(false); setEd(null); setMode("plan"); }} title={mode === "plan" ? (ed ? "Edit Practice Plan" : "Plan Practice") : mode === "active" ? "Active Practice - Record Data" : "Complete Practice"} wide>
      {mode === "plan" ? (
        <div>
      {/* Template Loader */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowTemplates(!showTemplates)} style={{ background: "none", border: `1px solid ${THEME.gold}`, color: THEME.gold, padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700, textTransform: "uppercase", width: "100%" }}>
          {showTemplates ? "Hide Templates" : "Load a Practice Template"}
        </button>
        {showTemplates && <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
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
        </div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}><Input label="Date" type="date" value={form.date||""} onChange={e => setForm({...form, date: e.target.value})} /><Input label="Time" type="time" value={form.time||""} onChange={e => setForm({...form, time: e.target.value})} /><Input label="Duration" type="number" value={form.duration||120} onChange={e => setForm({...form, duration: parseInt(e.target.value)||120})} /></div>
      <div style={{ marginTop: 12 }}><Input label="Focus" value={form.focus||""} onChange={e => setForm({...form, focus: e.target.value})} placeholder="Fundamentals, Hitting, Game Situations..." /></div>

      <div style={{ marginTop: 16 }}>
        <SL>Expected Attendance</SL>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => setForm({ ...form, attendance: { ...(form.attendance || {}), [p.id]: !(form.attendance || {})[p.id] } })}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${(form.attendance || {})[p.id] ? THEME.gold : THEME.charcoal}`,
                background: (form.attendance || {})[p.id] ? "rgba(253,181,21,0.15)" : THEME.black,
                color: (form.attendance || {})[p.id] ? THEME.gold : THEME.gray,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><SL>Practice Plan — {tt}/{form.duration||120}min</SL><div style={{ width: 120, height: 6, background: THEME.charcoal, borderRadius: 3 }}><div style={{ width: `${Math.min(100,(tt/(form.duration||120))*100)}%`, height: "100%", background: tt>(form.duration||120)?THEME.red:THEME.gold, borderRadius: 3 }} /></div></div>
        {(form.drills?.length || 0)>0 && <div style={{ marginBottom: 12 }}>{(() => {
          let lastPhase = "";
          return (form.drills||[]).map((d,i) => {
            const showPhaseHeader = d.phase && d.phase !== lastPhase;
            if (d.phase) lastPhase = d.phase;
            return <div key={i}>
              {showPhaseHeader && <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0 4px 0", marginTop: i > 0 ? 8 : 0 }}>
                <span style={{ color: d.phaseType === "stations" ? THEME.gold : THEME.white, fontSize: 12, fontWeight: 700, fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>{d.phase}</span>
                {d.phaseType === "stations" && <Badge color={THEME.gold} bg="rgba(253,181,21,0.15)">3 Groups Rotate</Badge>}
              </div>}
              <div style={{ background: THEME.black, borderRadius: 6, marginBottom: 3, overflow: "hidden", borderLeft: d.station ? `3px solid ${THEME.gold}` : "3px solid transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, cursor: "pointer" }} onClick={() => setExpandedDrill(expandedDrill === `plan-${i}` ? null : `plan-${i}`)}>
                      {d.station && <span style={{ color: THEME.gold, fontWeight: 700, fontSize: 11, fontFamily: "'Oswald',sans-serif", background: "rgba(253,181,21,0.15)", padding: "2px 7px", borderRadius: 3 }}>{d.station}</span>}
                      <span style={{ color: THEME.white, fontSize: 13 }}>{d.name}</span>
                      <Badge>{d.duration}min</Badge>
                      <span style={{ color: THEME.gray, fontSize: 10 }}>{expandedDrill === `plan-${i}` ? "▲" : "▼"}</span>
                    </div>
                    <select
                      value={d.assignedCoach || d.coach || "Any"}
                      onChange={(e) => {
                        e.stopPropagation();
                        const arr = [...(form.drills||[])];
                        arr[i] = { ...arr[i], assignedCoach: e.target.value };
                        setForm({...form, drills: arr});
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: "4px 8px",
                        background: THEME.black,
                        border: `1px solid ${THEME.blue}40`,
                        borderRadius: 4,
                        color: THEME.blue,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "'Oswald',sans-serif",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        outline: "none"
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
                    <button disabled={i === 0} onClick={() => { const arr = [...(form.drills||[])]; [arr[i], arr[i-1]] = [arr[i-1], arr[i]]; setForm({...form, drills: arr}); }} style={{ background: "none", border: "none", color: i === 0 ? THEME.charcoal : THEME.gold, cursor: i === 0 ? "default" : "pointer", fontSize: 14, padding: "2px" }}>▲</button>
                    <button disabled={i === (form.drills?.length || 0) - 1} onClick={() => { const arr = [...(form.drills||[])]; [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; setForm({...form, drills: arr}); }} style={{ background: "none", border: "none", color: i === (form.drills?.length || 0) - 1 ? THEME.charcoal : THEME.gold, cursor: i === (form.drills?.length || 0) - 1 ? "default" : "pointer", fontSize: 14, padding: "2px" }}>▼</button>
                    <button onClick={() => setForm({...form, drills: (form.drills||[]).filter((_,idx) => idx!==i)})} style={{ background: "none", border: "none", color: THEME.red, cursor: "pointer", fontSize: 16, padding: "2px" }}>✕</button>
                  </div>
                </div>
                {expandedDrill === `plan-${i}` && <div style={{ padding: "0 10px 10px 38px", color: THEME.gray, fontSize: 12, lineHeight: 1.5 }}>{d.description}{d.notes && <div style={{ color: THEME.goldDim, marginTop: 4 }}>Note: {d.notes}</div>}</div>}
              </div>
            </div>;
          });
        })()}</div>}

        <SL>Add Drills</SL>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>{cats.map(c => <button key={c} onClick={() => setDf(c)} style={{ padding: "3px 8px", fontSize: 11, borderRadius: 4, cursor: "pointer", background: df===c?THEME.gold:THEME.black, color: df===c?THEME.black:THEME.gray, border: `1px solid ${df===c?THEME.gold:THEME.charcoal}`, fontWeight: 700, textTransform: "capitalize" }}>{c}</button>)}</div>
        <div style={{ maxHeight: 250, overflowY: "auto", border: `1px solid ${THEME.charcoal}`, borderRadius: 6 }}>{fd.map(d => <div key={d.id} style={{ borderBottom: `1px solid ${THEME.charcoal}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setExpandedDrill(expandedDrill === d.id ? null : d.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                <Badge>{d.duration}min</Badge>
                <Badge color={THEME.blue} bg="rgba(52,152,219,0.15)">{d.coach}</Badge>
              </div>
            </div>
            <button onClick={() => setForm({...form, drills: [...(form.drills||[]), {...d, assignedCoach: d.coach}]})} style={{ background: THEME.gold, border: "none", color: THEME.black, width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>+</button>
          </div>
          {expandedDrill === d.id && <div style={{ padding: "0 10px 10px 10px", color: THEME.gray, fontSize: 12, lineHeight: 1.5 }}>{d.description}</div>}
        </div>)}</div>
      </div>
      <TextArea label="Notes" value={form.notes||""} onChange={e => setForm({...form, notes: e.target.value})} style={{ marginTop: 12 }} placeholder="General notes about this practice..." />
        </div>
      ) : mode === "active" ? (
        <div>
          {/* Active Practice Mode - Record data during practice */}
          <div style={{ marginBottom: 16, padding: 12, background: THEME.blackLight, borderRadius: 6, border: `1px solid ${THEME.blue}` }}>
            <div style={{ color: THEME.blue, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🏃 Practice In Progress</div>
            <div style={{ color: THEME.gray, fontSize: 12 }}>Record attendance, drill tracking, and player observations as you go.</div>
          </div>

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
              <SL>📋 Practice Agenda</SL>
              <div style={{ marginTop: 8, maxHeight: 300, overflowY: "auto", border: `1px solid ${THEME.charcoal}`, borderRadius: 6, padding: 8 }}>
                {form.drills.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderBottom: i < form.drills.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: THEME.gray, fontSize: 11, fontWeight: 700, minWidth: 20 }}>#{i+1}</span>
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
            <SL>🎨 Station Groups (for rotations)</SL>
            <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 8 }}>
              Assign players to color groups for station rotations. Leave unassigned if doing whole-team drills.
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {players.filter(p => (form.attendance || {})[p.id]).map(p => {
                const currentGroup = (form.groups || {})[p.id];
                const GROUP_COLORS = {
                  red: { bg: "rgba(231,76,60,0.2)", border: "#e74c3c", text: "#e74c3c" },
                  blue: { bg: "rgba(52,152,219,0.2)", border: "#3498db", text: "#3498db" },
                  gold: { bg: "rgba(253,181,21,0.2)", border: "#fdb515", text: "#fdb515" }
                };

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
                            flex: 1,
                            padding: "6px 8px",
                            borderRadius: 4,
                            border: `2px solid ${currentGroup === color ? GROUP_COLORS[color].border : THEME.charcoal}`,
                            background: currentGroup === color ? GROUP_COLORS[color].bg : THEME.black,
                            color: currentGroup === color ? GROUP_COLORS[color].text : THEME.gray,
                            cursor: "pointer",
                            fontSize: 12,
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
                const colorStyles = {
                  red: "#e74c3c",
                  blue: "#3498db",
                  gold: "#fdb515"
                };
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
              <SL>🔄 Station Rotations</SL>
              <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 8 }}>
                Assign groups to stations, then rotate them through. Round: {form.stationRotation.round}
              </div>

              {/* Station Assignment */}
              <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                {form.stationRotation.stations.map((station, idx) => {
                  const currentGroup = station.currentGroup;
                  const GROUP_COLORS = {
                    red: { bg: "rgba(231,76,60,0.2)", border: "#e74c3c", text: "#e74c3c" },
                    blue: { bg: "rgba(52,152,219,0.2)", border: "#3498db", text: "#3498db" },
                    gold: { bg: "rgba(253,181,21,0.2)", border: "#fdb515", text: "#fdb515" }
                  };

                  return (
                    <div key={station.id} style={{
                      padding: 12,
                      background: THEME.black,
                      borderRadius: 6,
                      border: `1px solid ${THEME.charcoal}`
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div>
                          <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700 }}>
                            Station {station.id}
                          </div>
                          <div style={{ color: THEME.gray, fontSize: 11 }}>{station.drillName}</div>
                        </div>
                        {currentGroup && (
                          <div style={{
                            padding: "4px 12px",
                            borderRadius: 4,
                            background: GROUP_COLORS[currentGroup].bg,
                            border: `1px solid ${GROUP_COLORS[currentGroup].border}`,
                            color: GROUP_COLORS[currentGroup].text,
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "capitalize"
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
                              flex: 1,
                              padding: "6px 8px",
                              borderRadius: 4,
                              border: `2px solid ${currentGroup === color ? (color ? GROUP_COLORS[color].border : THEME.charcoal) : THEME.charcoal}`,
                              background: currentGroup === color ? (color ? GROUP_COLORS[color].bg : THEME.blackLight) : THEME.blackLight,
                              color: currentGroup === color ? (color ? GROUP_COLORS[color].text : THEME.white) : THEME.gray,
                              cursor: "pointer",
                              fontSize: 11,
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

              {/* Rotate Button */}
              <Button
                onClick={() => {
                  const newRotation = { ...form.stationRotation };
                  const groups = ["red", "blue", "gold"];
                  const currentAssignments = newRotation.stations.map(s => s.currentGroup);

                  // Rotate: shift groups to next station
                  newRotation.stations.forEach((station, idx) => {
                    const prevIdx = idx === 0 ? newRotation.stations.length - 1 : idx - 1;
                    station.currentGroup = currentAssignments[prevIdx];
                  });

                  newRotation.round += 1;
                  setForm({ ...form, stationRotation: newRotation });
                }}
                style={{ width: "100%" }}
              >
                🔄 Rotate Groups to Next Station
              </Button>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <SL>Attendance (mark who showed up)</SL>
            <ToggleChips
              players={players}
              selected={form.attendance || {}}
              onToggle={id => setForm({ ...form, attendance: { ...(form.attendance || {}), [id]: !(form.attendance || {})[id] } })}
            />
          </div>

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
                      flex: 1,
                      padding: "6px 8px",
                      background: THEME.black,
                      border: `1px solid ${THEME.charcoal}`,
                      borderRadius: 4,
                      color: THEME.white,
                      fontSize: 12,
                      outline: "none"
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

            // Check if any trackable drills are station drills
            const hasStationDrills = trackableDrills.some(d => d.station);

            return (
              <div style={{ marginTop: 16 }}>
                <SL>📊 Drill Tracking</SL>

                {/* Group Filter for Station Drills */}
                {hasStationDrills && Object.values(form.groups || {}).some(g => g) && (
                  <div style={{ marginTop: 8, marginBottom: 12, padding: 10, background: THEME.blackLight, borderRadius: 6 }}>
                    <div style={{ color: THEME.white, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Which group are you tracking?
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["red", "blue", "gold", null].map(color => {
                        const GROUP_COLORS = {
                          red: { bg: "rgba(231,76,60,0.2)", border: "#e74c3c", text: "#e74c3c" },
                          blue: { bg: "rgba(52,152,219,0.2)", border: "#3498db", text: "#3498db" },
                          gold: { bg: "rgba(253,181,21,0.2)", border: "#fdb515", text: "#fdb515" }
                        };

                        const isSelected = trackingGroup === color;
                        const colorStyle = color ? GROUP_COLORS[color] : null;

                        return (
                          <button
                            key={color || "all"}
                            onClick={() => setTrackingGroup(color)}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              borderRadius: 4,
                              border: `2px solid ${isSelected ? (colorStyle ? colorStyle.border : THEME.gold) : THEME.charcoal}`,
                              background: isSelected ? (colorStyle ? colorStyle.bg : "rgba(253,181,21,0.1)") : THEME.black,
                              color: isSelected ? (colorStyle ? colorStyle.text : THEME.gold) : THEME.gray,
                              cursor: "pointer",
                              fontSize: 12,
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

                    // Filter players by group if tracking a specific group
                    const getFilteredPlayers = () => {
                      let filtered = players.filter(p => (form.attendance || {})[p.id]);
                      if (trackingGroup && drill.station) {
                        filtered = filtered.filter(p => (form.groups || {})[p.id] === trackingGroup);
                      }
                      return filtered;
                    };

                    const filteredPlayers = getFilteredPlayers();

                    // b1: Home to First Sprint - Stopwatch Interface
                    if (drill.id === "b1") {
                      const times = tracking.times || [];
                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.blue}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⏱️ {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Time each player home-to-first</div>

                          {/* Stopwatch Display */}
                          <div style={{ textAlign: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 48, fontWeight: 700, color: stopwatchRunning ? THEME.gold : THEME.white, fontFamily: "monospace" }}>
                              {(stopwatchTime / 1000).toFixed(2)}
                            </div>
                            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                              {!stopwatchRunning ? (
                                <Button onClick={() => {
                                  setStopwatchTime(0);
                                  setStopwatchRunning(true);
                                  stopwatchInterval.current = setInterval(() => {
                                    setStopwatchTime(t => t + 10);
                                  }, 10);
                                }}>
                                  ▶️ Start
                                </Button>
                              ) : (
                                <Button onClick={() => {
                                  setStopwatchRunning(false);
                                  clearInterval(stopwatchInterval.current);
                                }} variant="danger">
                                  ⏸️ Stop
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Player Selection to Save Time */}
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
                                        drillTracking: {
                                          ...(form.drillTracking || {}),
                                          [drill.id]: { times: newTimes }
                                        }
                                      });
                                      setStopwatchTime(0);
                                    }}
                                    style={{
                                      padding: "8px",
                                      background: THEME.blackLight,
                                      border: `1px solid ${THEME.charcoal}`,
                                      borderRadius: 4,
                                      color: THEME.white,
                                      cursor: "pointer",
                                      fontSize: 12
                                    }}
                                  >
                                    {p.name.split(" ")[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sorted Leaderboard */}
                          {times.length > 0 && (
                            <div>
                              <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Results (fastest first):</div>
                              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                                {times.sort((a, b) => a.time - b.time).map((t, idx) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: idx === 0 ? "rgba(253,181,21,0.1)" : THEME.blackLight, borderRadius: 4, marginBottom: 4 }}>
                                    <span style={{ color: THEME.white, fontSize: 12 }}>
                                      {idx === 0 && "⭐ "}{t.playerName.split(" ")[0]}
                                    </span>
                                    <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontFamily: "monospace" }}>
                                      {t.time.toFixed(2)}s
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // f3: 21 Outs Drill - Team Counter
                    if (drill.id === "f3") {
                      const count = tracking.count || 0;
                      const best = tracking.best || 0;
                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.green}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🎯 {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Consecutive outs without error</div>

                          <div style={{ textAlign: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 64, fontWeight: 700, color: THEME.green, fontFamily: "monospace" }}>
                              {count}
                            </div>
                            <div style={{ color: THEME.gray, fontSize: 13 }}>
                              Best Today: <span style={{ color: THEME.gold, fontWeight: 600 }}>{best}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 8 }}>
                            <Button onClick={() => {
                              const newCount = count + 1;
                              const newBest = Math.max(newCount, best);
                              setForm({
                                ...form,
                                drillTracking: {
                                  ...(form.drillTracking || {}),
                                  [drill.id]: { count: newCount, best: newBest }
                                }
                              });
                            }} style={{ flex: 1 }}>
                              ✓ OUT (+1)
                            </Button>
                            <Button onClick={() => {
                              setForm({
                                ...form,
                                drillTracking: {
                                  ...(form.drillTracking || {}),
                                  [drill.id]: { count: 0, best }
                                }
                              });
                            }} variant="danger" style={{ flex: 1 }}>
                              ✕ ERROR (Reset)
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    // p2: Pitch Location - Strike/Ball Counter
                    if (drill.id === "p2") {
                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `1px solid ${THEME.charcoal}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚾ {drill.name}</div>
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
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        drillTracking: {
                                          ...(form.drillTracking || {}),
                                          [drill.id]: {
                                            ...tracking,
                                            [p.id]: { ...pData, strikes: pData.strikes + 1 }
                                          }
                                        }
                                      });
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: "10px",
                                      background: THEME.green,
                                      border: "none",
                                      borderRadius: 4,
                                      color: THEME.white,
                                      cursor: "pointer",
                                      fontSize: 14,
                                      fontWeight: 700
                                    }}
                                  >
                                    ✓ Strike
                                  </button>
                                  <button
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        drillTracking: {
                                          ...(form.drillTracking || {}),
                                          [drill.id]: {
                                            ...tracking,
                                            [p.id]: { ...pData, balls: pData.balls + 1 }
                                          }
                                        }
                                      });
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: "10px",
                                      background: THEME.red,
                                      border: "none",
                                      borderRadius: 4,
                                      color: THEME.white,
                                      cursor: "pointer",
                                      fontSize: 14,
                                      fontWeight: 700
                                    }}
                                  >
                                    ✕ Ball
                                  </button>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: THEME.gray }}>
                                  <span>Strikes: {pData.strikes} | Balls: {pData.balls} | Total: {total}</span>
                                  <span style={{ color: strikePercent >= 60 ? THEME.green : THEME.gray }}>
                                    {strikePercent}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // p3: Pitch Count - Simple counter per pitcher
                    if (drill.id === "p3") {
                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `1px solid ${THEME.charcoal}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>⚾ {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Track total pitch count per pitcher</div>

                          {filteredPlayers.map(p => {
                            const count = tracking[p.id] || 0;
                            return (
                              <div key={p.id} style={{ marginBottom: 8, padding: 10, background: THEME.blackLight, borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <button
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        drillTracking: {
                                          ...(form.drillTracking || {}),
                                          [drill.id]: { ...tracking, [p.id]: Math.max(0, count - 1) }
                                        }
                                      });
                                    }}
                                    style={{ padding: "4px 10px", background: THEME.charcoal, border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 16 }}
                                  >
                                    −
                                  </button>
                                  <span style={{ color: THEME.gold, fontSize: 20, fontWeight: 700, minWidth: 40, textAlign: "center" }}>{count}</span>
                                  <button
                                    onClick={() => {
                                      setForm({
                                        ...form,
                                        drillTracking: {
                                          ...(form.drillTracking || {}),
                                          [drill.id]: { ...tracking, [p.id]: count + 1 }
                                        }
                                      });
                                    }}
                                    style={{ padding: "4px 10px", background: THEME.gold, border: "none", borderRadius: 4, color: THEME.black, cursor: "pointer", fontSize: 16, fontWeight: 700 }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // h9: Points-Based Hitting - GB/FB/LD buttons with leaderboard
                    if (drill.id === "h9") {
                      const swingsPerPlayer = tracking.swingsPerPlayer || 5;
                      const playerData = tracking.players || {};

                      // Calculate leaderboard
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
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🏆 {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>GB=1pt | FB=2pts | LD=3pts</div>

                          {/* Set Swings */}
                          {!tracking.started && (
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ color: THEME.white, fontSize: 12, display: "block", marginBottom: 4 }}>Swings per player:</label>
                              <input
                                type="number"
                                min="1"
                                value={swingsPerPlayer}
                                onChange={e => setForm({
                                  ...form,
                                  drillTracking: {
                                    ...(form.drillTracking || {}),
                                    [drill.id]: { ...tracking, swingsPerPlayer: parseInt(e.target.value) || 5 }
                                  }
                                })}
                                style={{ padding: "6px 8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, fontSize: 13, width: 80 }}
                              />
                              <Button onClick={() => setForm({
                                ...form,
                                drillTracking: {
                                  ...(form.drillTracking || {}),
                                  [drill.id]: { ...tracking, started: true }
                                }
                              })} style={{ marginLeft: 8 }}>
                                Start Tracking
                              </Button>
                            </div>
                          )}

                          {tracking.started && (
                            <>
                              {/* Tracking Interface */}
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
                                      <button
                                        onClick={() => {
                                          setForm({
                                            ...form,
                                            drillTracking: {
                                              ...(form.drillTracking || {}),
                                              [drill.id]: {
                                                ...tracking,
                                                players: {
                                                  ...playerData,
                                                  [p.id]: { ...pData, gb: pData.gb + 1 }
                                                }
                                              }
                                            }
                                          });
                                        }}
                                        style={{ flex: 1, padding: "8px", background: "rgba(142,142,142,0.3)", border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                                      >
                                        GB (+1)
                                      </button>
                                      <button
                                        onClick={() => {
                                          setForm({
                                            ...form,
                                            drillTracking: {
                                              ...(form.drillTracking || {}),
                                              [drill.id]: {
                                                ...tracking,
                                                players: {
                                                  ...playerData,
                                                  [p.id]: { ...pData, fb: pData.fb + 1 }
                                                }
                                              }
                                            }
                                          });
                                        }}
                                        style={{ flex: 1, padding: "8px", background: "rgba(52,152,219,0.3)", border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                                      >
                                        FB (+2)
                                      </button>
                                      <button
                                        onClick={() => {
                                          setForm({
                                            ...form,
                                            drillTracking: {
                                              ...(form.drillTracking || {}),
                                              [drill.id]: {
                                                ...tracking,
                                                players: {
                                                  ...playerData,
                                                  [p.id]: { ...pData, ld: pData.ld + 1 }
                                                }
                                              }
                                            }
                                          });
                                        }}
                                        style={{ flex: 1, padding: "8px", background: "rgba(46,204,113,0.3)", border: "none", borderRadius: 4, color: THEME.white, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                                      >
                                        LD (+3)
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Leaderboard */}
                              {leaderboard.length > 0 && (
                                <div style={{ marginTop: 12, padding: 10, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                                  <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>🏆 Leaderboard</div>
                                  {leaderboard.map((entry, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: idx < leaderboard.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                                      <span style={{ color: THEME.white, fontSize: 12 }}>
                                        {idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : `${idx + 1}. `}
                                        {entry.name.split(" ")[0]}
                                      </span>
                                      <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontWeight: 600 }}>
                                        {entry.total} pts
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    }

                    // h10: Bunt Stations - Zone tap interface with leaderboard
                    if (drill.id === "h10") {
                      const attemptsPerPlayer = tracking.attemptsPerPlayer || 5;
                      const playerData = tracking.players || {};
                      const ZONES = [
                        { id: "1st", label: "1st Base Line", points: 2 },
                        { id: "middle", label: "Up the Middle", points: 1 },
                        { id: "3rd", label: "3rd Base Line", points: 2 },
                        { id: "foul", label: "Foul", points: 0 }
                      ];

                      // Calculate leaderboard
                      const leaderboard = filteredPlayers
                        .filter(p => playerData[p.id])
                        .map(p => {
                          const bunts = playerData[p.id].bunts || [];
                          const total = bunts.reduce((sum, b) => sum + b.points, 0);
                          return { name: p.name, total, attempts: bunts.length };
                        })
                        .sort((a, b) => b.total - a.total);

                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.gold}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🎯 {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Tap where the bunt lands</div>

                          {/* Set Attempts */}
                          {!tracking.started && (
                            <div style={{ marginBottom: 12 }}>
                              <label style={{ color: THEME.white, fontSize: 12, display: "block", marginBottom: 4 }}>Attempts per player:</label>
                              <input
                                type="number"
                                min="1"
                                value={attemptsPerPlayer}
                                onChange={e => setForm({
                                  ...form,
                                  drillTracking: {
                                    ...(form.drillTracking || {}),
                                    [drill.id]: { ...tracking, attemptsPerPlayer: parseInt(e.target.value) || 5 }
                                  }
                                })}
                                style={{ padding: "6px 8px", background: THEME.blackLight, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, fontSize: 13, width: 80 }}
                              />
                              <Button onClick={() => setForm({
                                ...form,
                                drillTracking: {
                                  ...(form.drillTracking || {}),
                                  [drill.id]: { ...tracking, started: true, currentPlayer: null }
                                }
                              })} style={{ marginLeft: 8 }}>
                                Start Tracking
                              </Button>
                            </div>
                          )}

                          {tracking.started && (
                            <>
                              {/* Player Selection */}
                              {!tracking.currentPlayer && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ color: THEME.white, fontSize: 13, marginBottom: 6 }}>Select player to track:</div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                                    {filteredPlayers.map(p => {
                                      const attempts = (playerData[p.id]?.bunts || []).length;
                                      return (
                                        <button
                                          key={p.id}
                                          onClick={() => setForm({
                                            ...form,
                                            drillTracking: {
                                              ...(form.drillTracking || {}),
                                              [drill.id]: { ...tracking, currentPlayer: p.id, currentPlayerName: p.name }
                                            }
                                          })}
                                          style={{
                                            padding: "8px",
                                            background: THEME.blackLight,
                                            border: `1px solid ${THEME.charcoal}`,
                                            borderRadius: 4,
                                            color: THEME.white,
                                            cursor: "pointer",
                                            fontSize: 12
                                          }}
                                        >
                                          {p.name.split(" ")[0]} ({attempts}/{attemptsPerPlayer})
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Zone Selection */}
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
                                          setForm({
                                            ...form,
                                            drillTracking: {
                                              ...(form.drillTracking || {}),
                                              [drill.id]: {
                                                ...tracking,
                                                players: {
                                                  ...playerData,
                                                  [playerId]: { bunts }
                                                },
                                                currentPlayer: null,
                                                currentPlayerName: null
                                              }
                                            }
                                          });
                                        }}
                                        style={{
                                          padding: "12px",
                                          background: zone.points === 2 ? "rgba(46,204,113,0.2)" : zone.points === 1 ? "rgba(52,152,219,0.2)" : "rgba(142,142,142,0.2)",
                                          border: `2px solid ${zone.points === 2 ? THEME.green : zone.points === 1 ? THEME.blue : THEME.gray}`,
                                          borderRadius: 4,
                                          color: THEME.white,
                                          cursor: "pointer",
                                          fontSize: 13,
                                          fontWeight: 600
                                        }}
                                      >
                                        {zone.label} ({zone.points} pts)
                                      </button>
                                    ))}
                                  </div>
                                  <Button variant="ghost" onClick={() => setForm({
                                    ...form,
                                    drillTracking: {
                                      ...(form.drillTracking || {}),
                                      [drill.id]: { ...tracking, currentPlayer: null, currentPlayerName: null }
                                    }
                                  })} style={{ marginTop: 8, width: "100%" }}>
                                    Cancel
                                  </Button>
                                </div>
                              )}

                              {/* Leaderboard */}
                              {leaderboard.length > 0 && (
                                <div style={{ marginTop: 12, padding: 10, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                                  <div style={{ color: THEME.gold, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>🏆 Leaderboard</div>
                                  {leaderboard.map((entry, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: idx < leaderboard.length - 1 ? `1px solid ${THEME.charcoal}` : "none" }}>
                                      <span style={{ color: THEME.white, fontSize: 12 }}>
                                        {idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : `${idx + 1}. `}
                                        {entry.name.split(" ")[0]}
                                      </span>
                                      <span style={{ color: idx === 0 ? THEME.gold : THEME.gray, fontSize: 12, fontWeight: 600 }}>
                                        {entry.total} pts
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    }

                    // h11: Batting Queen - Elimination bracket with 6 levels
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

                      const activePlayers = filteredPlayers.filter(p =>
                        (!playerStatus[p.id] || playerStatus[p.id].eliminated === false || playerStatus[p.id].eliminatedAt >= currentLevel)
                      );

                      const eliminatedPlayers = filteredPlayers.filter(p =>
                        playerStatus[p.id]?.eliminated &&
                        playerStatus[p.id].eliminatedAt < currentLevel
                      );

                      return (
                        <div key={drill.id} style={{ background: THEME.black, borderRadius: 6, padding: 12, border: `2px solid ${THEME.gold}` }}>
                          <div style={{ color: THEME.gold, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>👑 {drill.name}</div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginBottom: 12 }}>Single elimination - 6 levels of difficulty</div>

                          {!started && (
                            <Button onClick={() => {
                              const initialStatus = {};
                              filteredPlayers.forEach(p => {
                                initialStatus[p.id] = { eliminated: false, eliminatedAt: null, level: 1 };
                              });
                              setForm({
                                ...form,
                                drillTracking: {
                                  ...(form.drillTracking || {}),
                                  [drill.id]: { started: true, currentLevel: 1, playerStatus: initialStatus }
                                }
                              });
                            }}>
                              Start Competition
                            </Button>
                          )}

                          {started && (
                            <>
                              {/* Level Display */}
                              <div style={{ marginBottom: 12, padding: 12, background: "rgba(253,181,21,0.1)", borderRadius: 4, border: `1px solid ${THEME.gold}` }}>
                                <div style={{ color: THEME.gold, fontSize: 16, fontWeight: 700 }}>
                                  Level {currentLevel}: {LEVELS[currentLevel - 1].name}
                                </div>
                                <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>
                                  {LEVELS[currentLevel - 1].desc}
                                </div>
                                <div style={{ color: THEME.white, fontSize: 12, marginTop: 6 }}>
                                  {activePlayers.length} player{activePlayers.length !== 1 ? "s" : ""} remaining
                                </div>
                              </div>

                              {/* Active Players */}
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
                                              // Undo elimination
                                              setForm({
                                                ...form,
                                                drillTracking: {
                                                  ...(form.drillTracking || {}),
                                                  [drill.id]: {
                                                    ...tracking,
                                                    playerStatus: {
                                                      ...playerStatus,
                                                      [p.id]: { eliminated: false, eliminatedAt: null, level: currentLevel }
                                                    }
                                                  }
                                                }
                                              });
                                            } else {
                                              // Mark eliminated
                                              setForm({
                                                ...form,
                                                drillTracking: {
                                                  ...(form.drillTracking || {}),
                                                  [drill.id]: {
                                                    ...tracking,
                                                    playerStatus: {
                                                      ...playerStatus,
                                                      [p.id]: { eliminated: true, eliminatedAt: currentLevel, level: currentLevel }
                                                    }
                                                  }
                                                }
                                              });
                                            }
                                          }}
                                          style={{
                                            padding: "10px",
                                            background: isEliminated ? "rgba(231,76,60,0.2)" : THEME.blackLight,
                                            border: `2px solid ${isEliminated ? THEME.red : THEME.charcoal}`,
                                            borderRadius: 4,
                                            color: THEME.white,
                                            cursor: "pointer",
                                            fontSize: 13,
                                            textAlign: "left",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                          }}
                                        >
                                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            {isEliminated && <span style={{ color: THEME.red, fontSize: 16 }}>❌</span>}
                                            <span style={{ textDecoration: isEliminated ? "line-through" : "none" }}>
                                              {p.name.split(" ")[0]}
                                            </span>
                                          </span>
                                          <span style={{ color: isEliminated ? THEME.green : THEME.red, fontSize: 11 }}>
                                            {isEliminated ? "Tap to undo" : "Tap to eliminate →"}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Level Controls */}
                              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                {currentLevel < 6 && activePlayers.length > 0 && (
                                  <Button onClick={() => {
                                    setForm({
                                      ...form,
                                      drillTracking: {
                                        ...(form.drillTracking || {}),
                                        [drill.id]: { ...tracking, currentLevel: currentLevel + 1 }
                                      }
                                    });
                                  }} style={{ flex: 1 }}>
                                    Next Level →
                                  </Button>
                                )}
                                {currentLevel === 6 && activePlayers.length === 1 && (
                                  <div style={{ flex: 1, padding: 12, background: "rgba(253,181,21,0.2)", borderRadius: 4, textAlign: "center" }}>
                                    <div style={{ color: THEME.gold, fontSize: 18, fontWeight: 700 }}>
                                      👑 {activePlayers[0].name.split(" ")[0]} WINS!
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Eliminated Players by Level */}
                              {eliminatedPlayers.length > 0 && (
                                <div style={{ padding: 10, background: THEME.blackLight, borderRadius: 4 }}>
                                  <div style={{ color: THEME.gray, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Eliminated:</div>
                                  {LEVELS.map(level => {
                                    const atThisLevel = eliminatedPlayers.filter(p => playerStatus[p.id].eliminatedAt === level.id);
                                    if (atThisLevel.length === 0) return null;
                                    return (
                                      <div key={level.id} style={{ marginBottom: 4 }}>
                                        <span style={{ color: THEME.gray, fontSize: 11 }}>Level {level.id}: </span>
                                        <span style={{ color: THEME.white, fontSize: 11 }}>
                                          {atThisLevel.map(p => p.name.split(" ")[0]).join(", ")}
                                        </span>
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

                    // Fallback for any other trackable drills
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
        </div>
      ) : (
        <div>
          {/* Completion Mode UI */}
          <div style={{ marginBottom: 16, padding: 12, background: THEME.blackLight, borderRadius: 6, border: `1px solid ${THEME.green}` }}>
            <div style={{ color: THEME.green, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>✅ Review & Complete</div>
            <div style={{ color: THEME.gray, fontSize: 12 }}>Review your data and add final coach notes before marking complete.</div>
          </div>

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

          <div style={{ marginTop: 16 }}>
            <SL>Attendance</SL>
            <div style={{ color: THEME.white, fontSize: 13 }}>
              {players.filter(p => (form.attendance || {})[p.id]).map(p => p.name.split(" ")[0]).join(", ") || "No attendance recorded"}
            </div>
          </div>

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

          {/* Show Drill Tracking Summary */}
          {(() => {
            const trackableDrills = (form.drills || []).filter(d => TRACKABLE_DRILLS[d.id]);
            if (trackableDrills.length === 0 || !form.drillTracking) return null;

            return (
              <div style={{ marginTop: 16 }}>
                <SL>📊 Drill Metrics Summary</SL>
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
                          <div style={{ fontSize: 11, color: THEME.white }}>
                            Team: {tracking} consecutive outs
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <TextArea label="Coach Notes" value={form.coachNotes || ""} onChange={e => setForm({ ...form, coachNotes: e.target.value })} style={{ marginTop: 16 }} placeholder="What went well, what to work on..." />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button variant="ghost" onClick={() => { setShow(false); setEd(null); setMode("plan"); }}>
          {mode === "active" ? "Save & Close" : "Cancel"}
        </Button>
        <Button onClick={save}>
          {mode === "plan" ? (ed ? "Save Plan" : "Create Plan") : mode === "active" ? "Save Progress" : "Mark Complete"}
        </Button>
      </div>
    </Modal>
  </div>;
};

// ─── LINEUP BUILDER ─────────────────────────────────────────────
const LineupBuilder = ({ players }) => {
  const [lineups, setLineups] = useState([]);
  const [practices, setPractices] = useState([]);
  const [games, setGames] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    loadStore("pirates-lineups-2026v1", []).then(setLineups);
    loadStore("pirates-practices-unified-2026v1", []).then(setPractices);
    loadStore(STORAGE_KEYS.GAMELOGS, []).then(setGames);
  }, []);

  useEffect(() => {
    saveStore("pirates-lineups-2026v1", lineups);
  }, [lineups]);

  const emptyLineup = () => ({
    id: Date.now().toString(),
    opponent: "",
    date: "",
    location: "",
    status: "draft", // "draft" or "finalized"
    createdDate: new Date().toISOString(),
    availability: players.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}),
    lineup: [], // [{ playerId, battingOrder, position }]
    alignments: [], // [{ name, lineup: [...] }]
    activeAlignment: null,
    notes: ""
  });

  const [form, setForm] = useState(emptyLineup());

  const save = () => {
    if (!form.opponent || !form.date) {
      alert("Please enter opponent and date");
      return;
    }
    if (editing) {
      setLineups(prev => prev.map(l => l.id === editing ? form : l));
    } else {
      setLineups(prev => [...prev, form]);
    }
    setShowBuilder(false);
    setEditing(null);
    setForm(emptyLineup());
  };

  // Calculate practice attendance and playing time for warnings
  const getPlayerWarnings = (playerId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPractices = practices.filter(p => {
      if (!p.date || p.status !== "completed") return false;
      const practiceDate = new Date(p.date + "T12:00:00");
      return practiceDate >= thirtyDaysAgo;
    });

    const practicesAttended = recentPractices.filter(p => p.attendance?.[playerId]).length;
    const attendancePercent = recentPractices.length > 0 ? (practicesAttended / recentPractices.length) * 100 : 100;

    const gamesPlayed = games.filter(g => (g.lineup || []).find(l => l.playerId === playerId)).length;
    const playingTimePercent = games.length > 0 ? (gamesPlayed / games.length) * 100 : 100;

    return {
      lowAttendance: attendancePercent < 70,
      lowPlayingTime: playingTimePercent < 40 && attendancePercent >= 70,
      attendancePercent,
      playingTimePercent
    };
  };

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <div>
        <h2 style={{ color: THEME.gold, fontSize: 20, fontWeight: 700, fontFamily: "'Oswald',sans-serif", margin: 0 }}>📋 Lineup Builder</h2>
        <p style={{ color: THEME.gray, fontSize: 13, margin: "4px 0 0 0" }}>Create and manage game lineups with defensive alignments</p>
      </div>
      <Button onClick={() => { setForm(emptyLineup()); setEditing(null); setShowBuilder(true); }}>+ New Lineup</Button>
    </div>

    {lineups.length === 0 ? (
      <Card style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
        <p style={{ color: THEME.gray, margin: 0 }}>No lineups created yet.</p>
        <p style={{ color: THEME.gray, margin: "8px 0 0 0", fontSize: 13 }}>Click "New Lineup" to create your first game lineup.</p>
      </Card>
    ) : (
      <div style={{ display: "grid", gap: 12 }}>
        {lineups.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map(lineup => (
          <Card key={lineup.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ color: THEME.white, fontSize: 16, fontWeight: 700, margin: 0 }}>
                    vs {lineup.opponent}
                  </h3>
                  <Badge color={lineup.status === "finalized" ? THEME.green : THEME.gold} bg={lineup.status === "finalized" ? "rgba(46,204,113,0.15)" : "rgba(253,181,21,0.15)"}>
                    {lineup.status === "finalized" ? "✓ Finalized" : "Draft"}
                  </Badge>
                </div>
                <div style={{ color: THEME.gray, fontSize: 12 }}>
                  {lineup.date ? new Date(lineup.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "No date"}
                  {lineup.location && ` • ${lineup.location}`}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, marginTop: 4 }}>
                  {lineup.lineup.length} players • {lineup.alignments.length} alignment{lineup.alignments.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <Button small onClick={() => { setForm({...lineup}); setEditing(lineup.id); setShowBuilder(true); }}>
                  {lineup.status === "finalized" ? "View" : "Edit"}
                </Button>
                <Button small variant="danger" onClick={() => {
                  if (confirm(`Delete lineup for ${lineup.opponent}?`)) {
                    setLineups(prev => prev.filter(l => l.id !== lineup.id));
                  }
                }}>✕</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}

    {/* Lineup Builder Modal */}
    {showBuilder && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
        overflowY: "auto"
      }} onClick={() => { if (!editing || confirm("Close without saving?")) { setShowBuilder(false); setEditing(null); } }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: THEME.blackLight,
          borderRadius: 12,
          padding: 24,
          border: `2px solid ${THEME.gold}`,
          maxWidth: 1000,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 20, textTransform: "uppercase" }}>
              {editing ? `Edit Lineup: vs ${form.opponent}` : "Create New Lineup"}
            </h3>
            <button onClick={() => { if (!editing || confirm("Close without saving?")) { setShowBuilder(false); setEditing(null); } }} style={{
              background: "none",
              border: "none",
              color: THEME.gray,
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              width: 32,
              height: 32
            }}>✕</button>
          </div>

          {/* Game Setup */}
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Game Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Input label="Opponent *" value={form.opponent} onChange={e => setForm({...form, opponent: e.target.value})} />
              <Input label="Date *" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              <Input label="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Home Field" />
            </div>
          </Card>

          {/* Player Availability */}
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              👥 Player Availability ({Object.values(form.availability).filter(Boolean).length}/{players.length})
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {players.map(player => {
                const warnings = getPlayerWarnings(player.id);
                const isAvailable = form.availability[player.id];

                return (
                  <div key={player.id} onClick={() => setForm({...form, availability: {...form.availability, [player.id]: !isAvailable}})} style={{
                    padding: "8px 12px",
                    background: isAvailable ? THEME.blackLight : THEME.black,
                    borderRadius: 6,
                    border: `1px solid ${isAvailable ? THEME.gold : THEME.charcoal}`,
                    cursor: "pointer",
                    opacity: isAvailable ? 1 : 0.5
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={isAvailable} onChange={() => {}} style={{ cursor: "pointer" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{player.name}</div>
                        {isAvailable && (warnings.lowAttendance || warnings.lowPlayingTime) && (
                          <div style={{ color: THEME.red, fontSize: 10, marginTop: 2 }}>
                            {warnings.lowAttendance && "⚠️ Low attendance"}
                            {warnings.lowPlayingTime && "⚠️ Needs playing time"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Batting Order & Positions */}
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, margin: 0 }}>⚾ Batting Order & Positions</h4>
              <Button small onClick={() => {
                const available = players.filter(p => form.availability[p.id]);
                const lineup = available.slice(0, 9).map((p, i) => ({
                  playerId: p.id,
                  battingOrder: i + 1,
                  position: p.primaryPosition || "Bench"
                }));
                setForm({...form, lineup});
              }}>Auto-Fill</Button>
            </div>

            {form.lineup.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: THEME.gray, fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚾</div>
                <p>No lineup created yet. Click "Auto-Fill" to get started, or add players manually below.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                {form.lineup.sort((a, b) => a.battingOrder - b.battingOrder).map((spot, idx) => {
                  const player = players.find(p => p.id === spot.playerId);
                  const warnings = getPlayerWarnings(spot.playerId);
                  return (
                    <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", background: THEME.black, padding: 8, borderRadius: 6 }}>
                      <div style={{
                        minWidth: 32,
                        height: 32,
                        background: THEME.gold,
                        color: THEME.black,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 14
                      }}>{spot.battingOrder}</div>
                      <div style={{ flex: 1, color: THEME.white, fontSize: 13 }}>
                        {player?.name}
                        {(warnings.lowAttendance || warnings.lowPlayingTime) && (
                          <div style={{ fontSize: 10, color: THEME.red, marginTop: 2 }}>
                            {warnings.lowAttendance && "⚠️ Low attendance"}
                            {warnings.lowPlayingTime && "⚠️ Needs playing time"}
                          </div>
                        )}
                      </div>
                      <select
                        value={spot.position}
                        onChange={e => {
                          const newLineup = [...form.lineup];
                          newLineup[idx].position = e.target.value;
                          setForm({...form, lineup: newLineup});
                        }}
                        style={{
                          background: THEME.blackLight,
                          color: THEME.white,
                          border: `1px solid ${THEME.charcoal}`,
                          borderRadius: 6,
                          padding: "6px 8px",
                          fontSize: 12,
                          minWidth: 100
                        }}
                      >
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      <button onClick={() => {
                        setForm({...form, lineup: form.lineup.filter((_, i) => i !== idx)});
                      }} style={{
                        background: THEME.red,
                        color: THEME.white,
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: 12
                      }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Player to Lineup */}
            <div style={{ display: "flex", gap: 8 }}>
              <select
                style={{
                  flex: 1,
                  background: THEME.blackLight,
                  color: THEME.white,
                  border: `1px solid ${THEME.charcoal}`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 13
                }}
                onChange={e => {
                  if (!e.target.value) return;
                  const playerId = e.target.value;
                  const player = players.find(p => p.id === playerId);
                  const maxOrder = Math.max(0, ...form.lineup.map(l => l.battingOrder));
                  setForm({
                    ...form,
                    lineup: [...form.lineup, {
                      playerId,
                      battingOrder: maxOrder + 1,
                      position: player?.primaryPosition || "Bench"
                    }]
                  });
                  e.target.value = "";
                }}
              >
                <option value="">+ Add player to lineup...</option>
                {players.filter(p => form.availability[p.id] && !form.lineup.find(l => l.playerId === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Defensive Alignments */}
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, margin: 0 }}>🛡️ Defensive Alignments</h4>
              <Button small onClick={() => {
                const name = prompt("Alignment name (e.g., 'Rose Pitching'):");
                if (!name) return;
                setForm({
                  ...form,
                  alignments: [...form.alignments, { id: Date.now().toString(), name, lineup: JSON.parse(JSON.stringify(form.lineup)) }]
                });
              }}>Save Current as Alignment</Button>
            </div>

            {form.alignments.length === 0 ? (
              <div style={{ textAlign: "center", padding: 16, color: THEME.gray, fontSize: 12 }}>
                <p style={{ margin: 0 }}>No defensive alignments saved. Create your batting order above, then save it as an alignment for quick switching during the game.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {form.alignments.map(alignment => (
                  <div key={alignment.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: THEME.black,
                    padding: 12,
                    borderRadius: 6,
                    border: form.activeAlignment === alignment.id ? `2px solid ${THEME.gold}` : `1px solid ${THEME.charcoal}`
                  }}>
                    <div>
                      <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{alignment.name}</div>
                      <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>
                        {alignment.lineup.length} players
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <Button small onClick={() => {
                        setForm({...form, lineup: JSON.parse(JSON.stringify(alignment.lineup)), activeAlignment: alignment.id});
                      }}>Load</Button>
                      <Button small variant="danger" onClick={() => {
                        if (confirm(`Delete alignment "${alignment.name}"?`)) {
                          setForm({
                            ...form,
                            alignments: form.alignments.filter(a => a.id !== alignment.id),
                            activeAlignment: form.activeAlignment === alignment.id ? null : form.activeAlignment
                          });
                        }
                      }}>✕</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📝 Notes</h4>
            <textarea
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              placeholder="Strategy notes, reminders, special situations..."
              style={{
                width: "100%",
                background: THEME.black,
                color: THEME.white,
                border: `1px solid ${THEME.charcoal}`,
                borderRadius: 6,
                padding: 12,
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: 80
              }}
            />
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="ghost" onClick={() => { if (!editing || confirm("Close without saving?")) { setShowBuilder(false); setEditing(null); } }}>Cancel</Button>
            <Button onClick={save}>Save {form.status === "finalized" ? "Changes" : "Draft"}</Button>
            {form.status === "draft" && (
              <Button onClick={() => { setForm({...form, status: "finalized"}); setTimeout(save, 100); }}>Finalize Lineup</Button>
            )}
          </div>
        </div>
      </div>
    )}
  </div>;
};

// ─── GAME LOG ───────────────────────────────────────────────────
const OUT_CODES = ["K", "GO", "FO", "SAC"];

const GameLog = ({ players }) => {
  const [logs, setLogs] = useState([]); const [show, setShow] = useState(false); const [ed, setEd] = useState(null); const [expId, setExpId] = useState(null);
  const [mode, setMode] = useState("setup");
  const [curBatterIdx, setCurBatterIdx] = useState(0);
  const [showSBPicker, setShowSBPicker] = useState(false);
  const [showRunPicker, setShowRunPicker] = useState(false);
  const [defenseMode, setDefenseMode] = useState("offense"); // "defense" or "offense"
  const [currentPitcher, setCurrentPitcher] = useState(null);
  const [pitchCount, setPitchCount] = useState({ pitches: 0, strikes: 0, balls: 0 });
  const [inningPitchers, setInningPitchers] = useState({}); // { inning: [{ playerId, pitches, strikes, balls }] }

  const empty = () => ({
    id: Date.now().toString(), date: "", opponent: "", result: "", homeAway: "home",
    ourScore: "", theirScore: "",
    battingOrder: players.map(p => p.id),
    attendance: players.reduce((a, p) => ({ ...a, [p.id]: true }), {}),
    atBats: players.reduce((a, p) => ({ ...a, [p.id]: [] }), {}),
    runs: players.reduce((a, p) => ({ ...a, [p.id]: 0 }), {}),
    rbis: players.reduce((a, p) => ({ ...a, [p.id]: 0 }), {}),
    steals: players.reduce((a, p) => ({ ...a, [p.id]: 0 }), {}),
    positions: players.reduce((a, p) => ({ ...a, [p.id]: [] }), {}),
    pitching: {}, observations: players.reduce((a, p) => ({ ...a, [p.id]: "" }), {}),
    coachNotes: "", outs: 0, inning: 1,
    // Defensive tracking
    inningHalf: "top", // "top" = defense, "bottom" = offense
    defensiveInnings: {}, // { 1: { top: { positions: {...}, plays: [...], pitcher: {...} } } }
    defensiveStats: players.reduce((a, p) => ({ ...a, [p.id]: { putouts: 0, assists: 0, errors: 0 } }), {}),
  });
  const [form, setForm] = useState(empty());
  const [count, setCount] = useState({ balls: 0, strikes: 0, fouls: 0 });

  useEffect(() => { loadStore(STORAGE_KEYS.GAMELOGS, []).then(setLogs); }, []);
  useEffect(() => { saveStore(STORAGE_KEYS.GAMELOGS, logs); }, [logs]);

  const save = () => { if (ed) setLogs(p => p.map(x => x.id === ed ? { ...form } : x)); else setLogs(p => [...p, { ...form, id: Date.now().toString() }]); setShow(false); setEd(null); setCurBatterIdx(0); setCount({ balls: 0, strikes: 0, fouls: 0 }); };

  const activeBattingOrder = (form.battingOrder || []).filter(id => form.attendance[id]);
  const getPlayer = (id) => players.find(p => p.id === id);
  const pLine = (abs) => { const codes = abs.map(a => typeof a === "string" ? a : a.code); const h = codes.filter(a => isHit(a)).length; const ab = codes.filter(a => !["BB", "HBP", "SAC"].includes(a)).length; return `${h}-${ab}`; };

  // Save current pitcher's stats (for mid-inning pitcher changes)
  const savePitcherStats = () => {
    if (!currentPitcher || pitchCount.pitches === 0) return;

    // Save to defensive stats
    setForm(prev => ({
      ...prev,
      defensiveStats: {
        ...prev.defensiveStats,
        [currentPitcher]: {
          ...(prev.defensiveStats?.[currentPitcher] || { putouts: 0, assists: 0, errors: 0, pitches: 0 }),
          pitches: (prev.defensiveStats?.[currentPitcher]?.pitches || 0) + pitchCount.pitches
        }
      }
    }));

    // Track this pitcher in this inning
    setInningPitchers(prev => ({
      ...prev,
      [form.inning]: [
        ...(prev[form.inning] || []),
        { playerId: currentPitcher, pitches: pitchCount.pitches, strikes: pitchCount.strikes, balls: pitchCount.balls }
      ]
    }));

    // Reset pitch count
    setPitchCount({ pitches: 0, strikes: 0, balls: 0 });
  };

  const resetCount = () => setCount({ balls: 0, strikes: 0, fouls: 0 });

  const addBall = () => {
    const newBalls = count.balls + 1;
    if (newBalls >= 4) {
      recordABWithCount("BB", { balls: newBalls, strikes: count.strikes, fouls: count.fouls });
    } else {
      setCount({ ...count, balls: newBalls });
    }
  };

  const addStrike = () => {
    const newStrikes = count.strikes + 1;
    if (newStrikes >= 3) {
      recordABWithCount("K", { balls: count.balls, strikes: newStrikes, fouls: count.fouls });
    } else {
      setCount({ ...count, strikes: newStrikes });
    }
  };

  const addFoul = () => {
    if (count.strikes < 2) {
      setCount({ ...count, strikes: count.strikes + 1, fouls: count.fouls + 1 });
    } else {
      setCount({ ...count, fouls: count.fouls + 1 });
    }
  };

  const recordABWithCount = (code, countData) => {
    const pid = activeBattingOrder[curBatterIdx];
    if (!pid) return;
    const c = countData || { balls: count.balls, strikes: count.strikes, fouls: count.fouls };
    const newAB = { code, inning: form.inning, balls: c.balls, strikes: c.strikes, fouls: c.fouls };
    const newAbs = { ...form.atBats, [pid]: [...(form.atBats[pid] || []), newAB] };
    let newOuts = form.outs;
    let newInning = form.inning;
    if (OUT_CODES.includes(code)) {
      newOuts = form.outs + 1;
      if (newOuts >= 3) { newOuts = 0; newInning = form.inning + 1; }
    }
    setForm({ ...form, atBats: newAbs, outs: newOuts, inning: newInning });
    setCurBatterIdx((curBatterIdx + 1) % activeBattingOrder.length);
    resetCount();
  };

  const recordAB = (code) => recordABWithCount(code);

  const undoLastAB = () => {
    const prevIdx = (curBatterIdx - 1 + activeBattingOrder.length) % activeBattingOrder.length;
    const pid = activeBattingOrder[prevIdx];
    if (!pid) return;
    const abs = form.atBats[pid] || [];
    if (abs.length === 0) return;
    const removed = abs[abs.length - 1];
    const removedCode = typeof removed === "string" ? removed : removed.code;
    let newOuts = form.outs; let newInning = form.inning;
    if (OUT_CODES.includes(removedCode)) {
      if (form.outs === 0 && form.inning > 1) { newOuts = 2; newInning = form.inning - 1; }
      else { newOuts = Math.max(0, form.outs - 1); }
    }
    setForm({ ...form, atBats: { ...form.atBats, [pid]: abs.slice(0, -1) }, outs: newOuts, inning: newInning });
    setCurBatterIdx(prevIdx);
    // Restore count from the undone at-bat if available
    if (typeof removed === "object" && removed.balls !== undefined) {
      setCount({ balls: removed.balls, strikes: removed.strikes, fouls: removed.fouls || 0 });
    } else {
      resetCount();
    }
  };

  // Helper to get code from an at-bat (supports old string format and new {code, inning} format)
  const abCode = (ab) => typeof ab === "string" ? ab : ab.code;
  const abInning = (ab) => typeof ab === "string" ? null : ab.inning;

  const moveBatter = (idx, dir) => {
    const order = [...(form.battingOrder || [])]; const to = idx + dir;
    if (to < 0 || to >= order.length) return;
    [order[idx], order[to]] = [order[to], order[idx]];
    setForm({ ...form, battingOrder: order });
  };

  const counter = (label, value, onChange, color) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
      <span style={{ color: THEME.gray, fontSize: 14 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => onChange(Math.max(0, value - 1))} style={{ background: THEME.charcoal, border: "none", color: THEME.white, width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 20 }}>−</button>
        <span style={{ color, fontWeight: 700, fontFamily: "'Oswald',sans-serif", fontSize: 22, minWidth: 28, textAlign: "center" }}>{value}</span>
        <button onClick={() => onChange(value + 1)} style={{ background: THEME.charcoal, border: "none", color: THEME.white, width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 20 }}>+</button>
      </div>
    </div>
  );
  const bigBtn = (label, color, bg, onClick) => <button onClick={onClick} style={{ padding: "16px 0", fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: bg, color, border: "none", fontFamily: "'Oswald',sans-serif", width: "100%", minHeight: 52 }}>{label}</button>;

  const curPid = activeBattingOrder[curBatterIdx];
  const curPlayer = getPlayer(curPid);

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <p style={{ color: THEME.gray, margin: 0, fontSize: 13 }}>{logs.length} game{logs.length !== 1 ? "s" : ""}</p>
      <Button onClick={() => { setForm(empty()); setEd(null); setMode("setup"); setCurBatterIdx(0); setShow(true); }}>+ New Game</Button>
    </div>

    {logs.length === 0 ? <Card style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 8 }}>⚾</div><p style={{ color: THEME.gray, margin: 0 }}>No games logged yet.</p></Card> :
    <div style={{ display: "grid", gap: 10 }}>{logs.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map(l => <Card key={l.id} style={{ padding: 14, cursor: "pointer" }} onClick={() => setExpId(expId === l.id ? null : l.id)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, color: THEME.white, fontSize: 15 }}>{l.date ? new Date(l.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "No date"} {l.opponent && `vs ${l.opponent}`}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {l.homeAway && <Badge color={THEME.gray} bg="rgba(142,142,142,0.15)">{l.homeAway === "home" ? "Home" : "Away"}</Badge>}
            {l.result && <Badge color={l.result === "W" ? THEME.green : l.result === "L" ? THEME.red : THEME.gray} bg={l.result === "W" ? "rgba(46,204,113,0.15)" : l.result === "L" ? "rgba(231,76,60,0.15)" : "rgba(142,142,142,0.15)"}>{l.result}</Badge>}
            {(l.ourScore || l.theirScore) && <Badge>{l.ourScore || "?"}-{l.theirScore || "?"}</Badge>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Button small variant="ghost" onClick={e => { e.stopPropagation(); setForm({ ...empty(), ...l, battingOrder: l.battingOrder || players.map(p => p.id) }); setEd(l.id); setMode("setup"); setCurBatterIdx(0); setShow(true); }}>Edit</Button>
          <Button small variant="danger" onClick={e => { e.stopPropagation(); setLogs(x => x.filter(q => q.id !== l.id)); }}>✕</Button>
        </div>
      </div>
      {expId === l.id && <div style={{ marginTop: 12, borderTop: `1px solid ${THEME.charcoal}`, paddingTop: 12 }}>
        {players.filter(p => l.attendance?.[p.id]).map(p => {
          const abs = l.atBats?.[p.id] || []; const pos = l.positions?.[p.id] || [];
          const obs = l.observations?.[p.id]; const r = l.runs?.[p.id] || 0; const rbi = l.rbis?.[p.id] || 0; const sb = l.steals?.[p.id] || 0;
          const defStats = l.defensiveStats?.[p.id] || {};
          return <div key={p.id} style={{ padding: "5px 0", borderBottom: `1px solid ${THEME.charcoal}`, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: THEME.white, fontWeight: 600 }}>{p.name}</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {pos.map(po => <Badge key={po}>{po}</Badge>)}
                <span style={{ color: THEME.gold, fontFamily: "'Oswald',sans-serif", marginLeft: 4 }}>{pLine(abs)}</span>
                {r > 0 && <span style={{ color: THEME.green, fontSize: 11 }}>{r}R</span>}
                {rbi > 0 && <span style={{ color: THEME.blue, fontSize: 11 }}>{rbi}RBI</span>}
                {sb > 0 && <span style={{ color: THEME.goldDim, fontSize: 11 }}>{sb}SB</span>}
              </div>
            </div>
            {abs.length > 0 && <div style={{ display: "flex", gap: 3, marginTop: 3 }}>{abs.map((ab, i) => { const c = typeof ab === "string" ? ab : ab.code; const inn = typeof ab === "string" ? null : ab.inning; return <span key={i} style={{ padding: "1px 5px", fontSize: 10, borderRadius: 3, background: `${abColor(c)}20`, color: abColor(c) }}>{inn ? `${inn}:` : ""}{c}</span>; })}</div>}
            {(defStats.putouts > 0 || defStats.assists > 0 || defStats.errors > 0 || defStats.pitches > 0) && <div style={{ display: "flex", gap: 6, marginTop: 3, fontSize: 11 }}>
              {defStats.putouts > 0 && <span style={{ color: THEME.green }}>{defStats.putouts} PO</span>}
              {defStats.assists > 0 && <span style={{ color: THEME.blue }}>{defStats.assists} A</span>}
              {defStats.errors > 0 && <span style={{ color: THEME.red }}>{defStats.errors} E</span>}
              {defStats.pitches > 0 && <span style={{ color: THEME.gold, fontWeight: 700 }}>{defStats.pitches} pitches</span>}
            </div>}
            {obs && <div style={{ color: THEME.gray, fontStyle: "italic", marginTop: 2 }}>→ {obs}</div>}
          </div>;
        })}
        {l.coachNotes && <p style={{ color: THEME.gray, fontSize: 12, marginTop: 8, fontStyle: "italic" }}>Coach: {l.coachNotes}</p>}
      </div>}
    </Card>)}</div>}

    <Modal open={show} onClose={() => { setShow(false); setEd(null); setCurBatterIdx(0); }} title={ed ? "Edit Game" : "New Game"} wide>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `2px solid ${THEME.charcoal}` }}>
        {[{ id: "setup", label: "Game Setup" }, { id: "score", label: "Live Scorer" }, { id: "coach", label: "Coach Review" }].map(t => (
          <button key={t.id} onClick={() => setMode(t.id)} style={{ padding: "8px 16px", background: mode === t.id ? THEME.gold : "transparent", color: mode === t.id ? THEME.black : THEME.gray, border: "none", fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", borderBottom: mode === t.id ? `2px solid ${THEME.gold}` : "2px solid transparent" }}>{t.label}</button>
        ))}
      </div>

      {/* SETUP */}
      {mode === "setup" && <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Input label="Opponent" value={form.opponent} onChange={e => setForm({ ...form, opponent: e.target.value })} placeholder="Team name" />
          <Select label="Home / Away" value={form.homeAway || "home"} onChange={e => setForm({ ...form, homeAway: e.target.value })}><option value="home">Home</option><option value="away">Away</option></Select>
          <Select label="Result" value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}><option value="">—</option><option value="W">Win</option><option value="L">Loss</option><option value="T">Tie</option></Select>
          <Input label="Our Score" type="number" value={form.ourScore} onChange={e => setForm({ ...form, ourScore: e.target.value })} />
          <Input label="Their Score" type="number" value={form.theirScore} onChange={e => setForm({ ...form, theirScore: e.target.value })} />
        </div>
        <div style={{ marginTop: 16 }}><SL>Who's Playing?</SL><ToggleChips players={players} selected={form.attendance} onToggle={id => setForm({ ...form, attendance: { ...form.attendance, [id]: !form.attendance[id] } })} /></div>
        <div style={{ marginTop: 16 }}><SL>Batting Order</SL>
          <div style={{ border: `1px solid ${THEME.charcoal}`, borderRadius: 6, overflow: "hidden" }}>
            {activeBattingOrder.map((pid, i) => { const p = getPlayer(pid); if (!p) return null;
              return <div key={pid} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < activeBattingOrder.length - 1 ? `1px solid ${THEME.charcoal}` : "none", background: i % 2 === 0 ? THEME.black : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: THEME.gold, fontWeight: 700, fontFamily: "'Oswald',sans-serif", width: 24, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button disabled={i === 0} onClick={() => { const fi = form.battingOrder.indexOf(pid); const ti = form.battingOrder.indexOf(activeBattingOrder[i - 1]); const o = [...form.battingOrder]; [o[fi], o[ti]] = [o[ti], o[fi]]; setForm({ ...form, battingOrder: o }); }} style={{ background: "none", border: "none", color: i === 0 ? THEME.charcoal : THEME.gold, cursor: i === 0 ? "default" : "pointer", fontSize: 18 }}>▲</button>
                  <button disabled={i === activeBattingOrder.length - 1} onClick={() => { const fi = form.battingOrder.indexOf(pid); const ti = form.battingOrder.indexOf(activeBattingOrder[i + 1]); const o = [...form.battingOrder]; [o[fi], o[ti]] = [o[ti], o[fi]]; setForm({ ...form, battingOrder: o }); }} style={{ background: "none", border: "none", color: i === activeBattingOrder.length - 1 ? THEME.charcoal : THEME.gold, cursor: i === activeBattingOrder.length - 1 ? "default" : "pointer", fontSize: 18 }}>▼</button>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>}

      {/* LIVE SCORER */}
      {mode === "score" && <div>
        {/* Defense/Offense Toggle */}
        {(() => {
          // Dynamic labels based on home/away
          const isHome = form.homeAway === "home";
          const defenseLabel = isHome ? "🛡️ Defense (Top)" : "🛡️ Defense (Bottom)";
          const offenseLabel = isHome ? "⚾ Offense (Bottom)" : "⚾ Offense (Top)";

          return <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setDefenseMode("defense")} style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: defenseMode === "defense" ? THEME.red : THEME.charcoal, color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>{defenseLabel}</button>
            <button onClick={() => setDefenseMode("offense")} style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: defenseMode === "offense" ? THEME.green : THEME.charcoal, color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>{offenseLabel}</button>
          </div>;
        })()}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: THEME.black, borderRadius: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: THEME.gray, fontSize: 13 }}>Inning</span>
            <button onClick={() => setForm({ ...form, inning: Math.max(1, form.inning - 1), outs: 0 })} style={{ background: THEME.charcoal, border: "none", color: THEME.white, width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 14 }}>−</button>
            <span style={{ color: THEME.gold, fontWeight: 700, fontFamily: "'Oswald',sans-serif", fontSize: 24, minWidth: 28, textAlign: "center" }}>{form.inning}</span>
            <button onClick={() => setForm({ ...form, inning: form.inning + 1, outs: 0 })} style={{ background: THEME.charcoal, border: "none", color: THEME.white, width: 28, height: 28, borderRadius: 4, cursor: "pointer", fontSize: 14 }}>+</button>
            {(() => {
              const isHome = form.homeAway === "home";
              const inDefense = defenseMode === "defense";
              // Home team: defense = top, offense = bottom
              // Away team: defense = bottom, offense = top
              const currentHalf = (isHome && inDefense) || (!isHome && !inDefense) ? "TOP" : "BOT";
              return <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: THEME.gold, fontFamily: "'Oswald',sans-serif" }}>({currentHalf})</span>;
            })()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: THEME.gray, fontSize: 13 }}>Outs</span>
            {[0, 1, 2].map(o => <div key={o} style={{ width: 20, height: 20, borderRadius: "50%", background: o < form.outs ? THEME.red : THEME.charcoal, border: `2px solid ${o < form.outs ? THEME.red : THEME.gray}` }} />)}
            <span style={{ color: THEME.red, fontWeight: 700, fontFamily: "'Oswald',sans-serif", fontSize: 18, marginLeft: 4 }}>{form.outs}</span>
          </div>
        </div>

        {/* DEFENSE MODE */}
        {defenseMode === "defense" && <div>
          <Card style={{ marginBottom: 12 }}>
            <SL>Select Pitcher</SL>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {activeBattingOrder.filter(pid => {
                const p = getPlayer(pid);
                return p && p.isPitcher;
              }).map(pid => {
                const p = getPlayer(pid);
                return <button key={pid} onClick={() => {
                  // Save previous pitcher's stats if switching mid-inning
                  if (currentPitcher && currentPitcher !== pid) {
                    savePitcherStats();
                  }
                  setCurrentPitcher(pid);
                  setPitchCount({ pitches: 0, strikes: 0, balls: 0 });
                }} style={{ padding: "10px 12px", background: currentPitcher === pid ? THEME.gold : THEME.charcoal, color: currentPitcher === pid ? THEME.black : THEME.white, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                  {p.name.split(" ")[0]}
                </button>;
              })}
            </div>
            {activeBattingOrder.filter(p => getPlayer(p)?.isPitcher).length === 0 && <p style={{ color: THEME.gray, fontSize: 12, marginTop: 8 }}>No pitchers in lineup. Mark pitchers in Roster tab.</p>}
          </Card>

          {currentPitcher && (() => {
            const pitcher = getPlayer(currentPitcher);
            const pitchesThisGame = form.defensiveStats?.[currentPitcher]?.pitches || 0;
            const totalPitches = pitchCount.pitches + pitchesThisGame;
            const warningLevel = totalPitches >= 60 ? "danger" : totalPitches >= 50 ? "warning" : totalPitches >= 40 ? "caution" : "safe";
            const warningColor = warningLevel === "danger" ? THEME.red : warningLevel === "warning" ? "#E67E22" : warningLevel === "caution" ? "#F1C40F" : THEME.green;

            return <Card style={{ marginBottom: 12 }}>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: THEME.white, fontFamily: "'Oswald',sans-serif" }}>Pitcher: {pitcher.name}</div>
                <div style={{ fontSize: 32, color: warningColor, fontFamily: "'Oswald',sans-serif", fontWeight: 700, marginTop: 4 }}>
                  {totalPitches} pitches
                </div>
                {totalPitches >= 40 && <div style={{ fontSize: 11, color: warningColor, marginTop: 2 }}>
                  {totalPitches >= 60 ? "⚠️ LIMIT REACHED - MUST REST" : totalPitches >= 50 ? "⚠️ APPROACHING LIMIT" : "⚠️ MONITOR CLOSELY"}
                </div>}
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8, fontSize: 13 }}>
                  <span><span style={{ color: THEME.green, fontWeight: 700 }}>{pitchCount.strikes}</span> <span style={{ color: THEME.gray }}>Strikes</span></span>
                  <span><span style={{ color: THEME.red, fontWeight: 700 }}>{pitchCount.balls}</span> <span style={{ color: THEME.gray }}>Balls</span></span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <button onClick={() => setPitchCount({ ...pitchCount, pitches: pitchCount.pitches + 1, strikes: pitchCount.strikes + 1 })} style={{ padding: "14px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#2ECC71", color: THEME.black, border: "none", fontFamily: "'Oswald',sans-serif" }}>Strike</button>
                <button onClick={() => setPitchCount({ ...pitchCount, pitches: pitchCount.pitches + 1, balls: pitchCount.balls + 1 })} style={{ padding: "14px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#E74C3C", color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>Ball</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                <button onClick={savePitcherStats} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 700, borderRadius: 6, cursor: "pointer", background: THEME.gold, color: THEME.black, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                  💾 Save & Switch Pitcher
                </button>
                <button onClick={savePitcherStats} style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 700, borderRadius: 6, cursor: "pointer", background: THEME.charcoal, color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                  End Inning (Save Stats)
                </button>
              </div>
              {inningPitchers[form.inning] && inningPitchers[form.inning].length > 0 && (
                <div style={{ marginTop: 12, padding: "8px 10px", background: THEME.black, borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: THEME.gray, marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Inning {form.inning} Pitchers:</div>
                  {inningPitchers[form.inning].map((p, i) => {
                    const pitcher = getPlayer(p.playerId);
                    return <div key={i} style={{ fontSize: 12, color: THEME.white, padding: "2px 0" }}>
                      {pitcher?.name.split(" ")[0]}: {p.pitches} pitches ({p.strikes}S / {p.balls}B)
                    </div>;
                  })}
                </div>
              )}
            </Card>;
          })()}

          <Card style={{ marginBottom: 12 }}>
            <SL>Quick Entry - Defensive Plays</SL>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <button onClick={() => {
                const newOuts = form.outs + 1;
                setForm({ ...form, outs: newOuts >= 3 ? 0 : newOuts, inning: newOuts >= 3 ? form.inning + 1 : form.inning });
                if (currentPitcher) {
                  setForm(prev => ({
                    ...prev,
                    defensiveStats: {
                      ...prev.defensiveStats,
                      [currentPitcher]: {
                        ...(prev.defensiveStats?.[currentPitcher] || { putouts: 0, assists: 0, errors: 0 }),
                        putouts: (prev.defensiveStats?.[currentPitcher]?.putouts || 0) + 1
                      }
                    }
                  }));
                }
              }} style={{ padding: "14px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: THEME.red, color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                Strikeout (K)
              </button>
              <button onClick={() => {
                const newOuts = form.outs + 1;
                setForm({ ...form, outs: newOuts >= 3 ? 0 : newOuts, inning: newOuts >= 3 ? form.inning + 1 : form.inning });
              }} style={{ padding: "14px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#8E8E8E", color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                Ground Out
              </button>
              <button onClick={() => {
                const newOuts = form.outs + 1;
                setForm({ ...form, outs: newOuts >= 3 ? 0 : newOuts, inning: newOuts >= 3 ? form.inning + 1 : form.inning });
              }} style={{ padding: "14px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#8E8E8E", color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                Fly Out
              </button>
              <button onClick={() => {
                // Error - no out
              }} style={{ padding: "14px 0", fontSize: 14, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#E67E22", color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>
                Error (No Out)
              </button>
            </div>
            <p style={{ color: THEME.gray, fontSize: 11, textAlign: "center", margin: 0 }}>Quick entry updates outs automatically. Detailed tracking coming soon.</p>
          </Card>

          <Card>
            <SL>Defensive Stats (This Game)</SL>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {activeBattingOrder.map(pid => {
                const p = getPlayer(pid);
                const stats = form.defensiveStats?.[pid] || { putouts: 0, assists: 0, errors: 0, pitches: 0 };
                if (stats.putouts === 0 && stats.assists === 0 && stats.errors === 0 && stats.pitches === 0) return null;
                return <div key={pid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${THEME.charcoal}` }}>
                  <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
                  <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                    {stats.putouts > 0 && <span style={{ color: THEME.green }}>{stats.putouts} PO</span>}
                    {stats.assists > 0 && <span style={{ color: THEME.blue }}>{stats.assists} A</span>}
                    {stats.errors > 0 && <span style={{ color: THEME.red }}>{stats.errors} E</span>}
                    {stats.pitches > 0 && <span style={{ color: THEME.gold }}>{stats.pitches} P</span>}
                  </div>
                </div>;
              })}
            </div>
          </Card>
        </div>}

        {/* OFFENSE MODE */}
        {defenseMode === "offense" && curPlayer ? <div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: THEME.white, fontFamily: "'Oswald',sans-serif" }}>#{curBatterIdx + 1} {curPlayer.name} {curPlayer.jersey && <span style={{ color: THEME.gray, fontSize: 16 }}>#{curPlayer.jersey}</span>}</div>
            <div style={{ fontSize: 18, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontWeight: 700, marginTop: 4 }}>
              {pLine(form.atBats[curPid] || [])}
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 6 }}>
              <span style={{ fontSize: 13 }}><span style={{ color: THEME.green, fontWeight: 700 }}>{form.runs?.[curPid] || 0}</span> <span style={{ color: THEME.gray }}>Runs</span></span>
              <span style={{ fontSize: 13 }}><span style={{ color: THEME.blue, fontWeight: 700 }}>{form.rbis?.[curPid] || 0}</span> <span style={{ color: THEME.gray }}>RBI</span></span>
              <span style={{ fontSize: 13 }}><span style={{ color: THEME.goldLight, fontWeight: 700 }}>{form.steals?.[curPid] || 0}</span> <span style={{ color: THEME.gray }}>SB</span></span>
            </div>
            {(form.atBats[curPid] || []).length > 0 && <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>{(form.atBats[curPid] || []).map((ab, i) => { const code = abCode(ab); const inn = abInning(ab); const b = typeof ab === "object" ? ab.balls : null; const s = typeof ab === "object" ? ab.strikes : null; const allAbs = form.atBats[curPid] || []; const dupeInning = inn && allAbs.filter((a, k) => k !== i && typeof a === "object" && a.inning === inn).length > 0; const abNum = dupeInning ? allAbs.slice(0, i + 1).filter(a => typeof a === "object" && a.inning === inn).length : null; return <span key={i} style={{ padding: "2px 8px", fontSize: 12, borderRadius: 4, background: `${abColor(code)}25`, color: abColor(code), fontWeight: 700 }}>{inn ? `Inn ${inn}${abNum ? ` AB${abNum}` : ""}` : `AB ${i+1}`}: {code}{b !== null ? ` (${b}-${s})` : ""}</span>; })}</div>}
          </div>

          <SL>Pitch Count</SL>
          <div style={{ padding: 12, background: THEME.black, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 10 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{[0,1,2,3].map(b => <div key={b} style={{ width: 22, height: 22, borderRadius: "50%", background: b < count.balls ? "#2ECC71" : THEME.charcoal, border: `2px solid ${b < count.balls ? "#2ECC71" : THEME.gray}` }} />)}</div>
                <span style={{ color: THEME.gray, fontSize: 11 }}>Balls</span>
              </div>
              <div style={{ color: THEME.white, fontSize: 28, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{count.balls}-{count.strikes}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{[0,1,2].map(s => <div key={s} style={{ width: 22, height: 22, borderRadius: "50%", background: s < count.strikes ? "#E74C3C" : THEME.charcoal, border: `2px solid ${s < count.strikes ? "#E74C3C" : THEME.gray}` }} />)}</div>
                <span style={{ color: THEME.gray, fontSize: 11 }}>Strikes</span>
              </div>
            </div>
            {count.fouls > 0 && <div style={{ textAlign: "center", marginBottom: 8 }}><span style={{ color: THEME.goldDim, fontSize: 12 }}>{count.fouls} foul{count.fouls !== 1 ? "s" : ""}</span></div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              <button onClick={addBall} style={{ padding: "12px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#2ECC71", color: THEME.black, border: "none", fontFamily: "'Oswald',sans-serif" }}>Ball</button>
              <button onClick={addStrike} style={{ padding: "12px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#E74C3C", color: THEME.white, border: "none", fontFamily: "'Oswald',sans-serif" }}>Strike</button>
              <button onClick={addFoul} style={{ padding: "12px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: THEME.goldDim, color: THEME.black, border: "none", fontFamily: "'Oswald',sans-serif" }}>Foul</button>
              <button onClick={resetCount} style={{ padding: "12px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: THEME.charcoal, color: THEME.gray, border: "none", fontFamily: "'Oswald',sans-serif" }}>Reset</button>
            </div>
          </div>

          <SL>At-Bat Result (Inning {form.inning})</SL>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            {bigBtn("1B", THEME.black, "#2ECC71", () => recordAB("1B"))}
            {bigBtn("2B", THEME.black, "#2ECC71", () => recordAB("2B"))}
            {bigBtn("3B", THEME.black, "#2ECC71", () => recordAB("3B"))}
            {bigBtn("HR", THEME.black, "#F1C40F", () => recordAB("HR"))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            {bigBtn("Ground Out", THEME.white, "#8E8E8E", () => recordAB("GO"))}
            {bigBtn("Fly Out", THEME.white, "#8E8E8E", () => recordAB("FO"))}
            {bigBtn("Hit By Pitch", THEME.white, "#3498DB", () => recordAB("HBP"))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginBottom: 12 }}>
            {bigBtn("Stolen Base", THEME.black, THEME.goldLight, () => setShowSBPicker(true))}
          </div>

          {/* Stolen Base Picker */}
          {showSBPicker && <div style={{ padding: 14, background: THEME.black, borderRadius: 8, marginBottom: 12, border: `1px solid ${THEME.gold}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <SL>Who stole a base?</SL>
              <button onClick={() => setShowSBPicker(false)} style={{ background: "none", border: "none", color: THEME.gray, fontSize: 16, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {activeBattingOrder.map(pid => {
                const p = getPlayer(pid);
                if (!p) return null;
                const sb = form.steals?.[pid] || 0;
                return <button key={pid} onClick={() => {
                  setForm({ ...form, steals: { ...form.steals, [pid]: sb + 1 } });
                  setShowSBPicker(false);
                }} style={{
                  padding: "10px 12px", background: THEME.charcoal, border: "none", borderRadius: 6,
                  cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ color: THEME.white, fontWeight: 600, fontSize: 14 }}>{p.name.split(" ")[0]}</span>
                  {sb > 0 && <span style={{ color: THEME.goldLight, fontSize: 12, fontFamily: "'Oswald',sans-serif" }}>{sb} SB</span>}
                </button>;
              })}
            </div>
          </div>}

          <div style={{ textAlign: "center", marginBottom: 16 }}><button onClick={undoLastAB} style={{ padding: "8px 20px", fontSize: 13, borderRadius: 6, cursor: "pointer", background: "transparent", color: THEME.red, border: `1px solid ${THEME.red}40`, fontWeight: 600 }}>Undo Last At-Bat</button></div>

          <div style={{ padding: 14, background: THEME.black, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setShowRunPicker(!showRunPicker)} style={{ flex: 1, padding: "12px 0", fontSize: 15, fontWeight: 700, borderRadius: 8, cursor: "pointer", background: "#2ECC71", color: THEME.black, border: "none", fontFamily: "'Oswald',sans-serif" }}>Who Scored?</button>
            </div>
            {showRunPicker && <div style={{ marginBottom: 10, border: `1px solid ${THEME.green}`, borderRadius: 6, padding: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: THEME.white, fontSize: 12, fontWeight: 700 }}>Tap each player who scored. Tap again to undo.</span>
                <button onClick={() => setShowRunPicker(false)} style={{ background: THEME.gold, border: "none", color: THEME.black, padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'Oswald',sans-serif" }}>Done</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {activeBattingOrder.map(pid => {
                  const p = getPlayer(pid); if (!p) return null;
                  const r = form.runs?.[pid] || 0;
                  return <button key={pid} onClick={() => {
                    setForm(prev => ({ ...prev, runs: { ...prev.runs, [pid]: (prev.runs?.[pid] || 0) + 1 }, rbis: { ...prev.rbis, [curPid]: (prev.rbis?.[curPid] || 0) + 1 } }));
                  }} style={{ padding: "10px 10px", background: THEME.charcoal, border: "none", borderRadius: 6, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: THEME.white, fontWeight: 600, fontSize: 14 }}>{p.name.split(" ")[0]}</span>
                    <span style={{ color: THEME.green, fontSize: 13, fontFamily: "'Oswald',sans-serif", fontWeight: 700 }}>{r}R</span>
                  </button>;
                })}
              </div>
              <p style={{ color: THEME.gray, fontSize: 10, margin: "6px 0 0 0", textAlign: "center" }}>Each tap = +1 run for that player and +1 RBI for current batter. Tap "Done" when finished.</p>
            </div>}
            {counter("RBIs (current batter)", form.rbis?.[curPid] || 0, v => setForm({ ...form, rbis: { ...form.rbis, [curPid]: v } }), THEME.blue)}
          </div>

          <SL>Positions Played</SL>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>{POSITIONS.map(pos => <button key={pos} onClick={() => { const c = form.positions[curPid] || []; setForm({ ...form, positions: { ...form.positions, [curPid]: c.includes(pos) ? c.filter(x => x !== pos) : [...c, pos] } }); }} style={{ padding: "8px 14px", fontSize: 13, borderRadius: 6, cursor: "pointer", background: (form.positions[curPid] || []).includes(pos) ? THEME.gold : THEME.charcoal, color: (form.positions[curPid] || []).includes(pos) ? THEME.black : THEME.gray, border: "none", fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{pos}</button>)}</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${THEME.charcoal}` }}>
            <button onClick={() => { setCurBatterIdx((curBatterIdx - 1 + activeBattingOrder.length) % activeBattingOrder.length); resetCount(); }} style={{ background: "none", border: `1px solid ${THEME.gold}`, color: THEME.gold, padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700 }}>← Prev</button>
            <span style={{ color: THEME.gray, fontSize: 12 }}>{curBatterIdx + 1} of {activeBattingOrder.length}</span>
            <button onClick={() => { setCurBatterIdx((curBatterIdx + 1) % activeBattingOrder.length); resetCount(); }} style={{ background: "none", border: `1px solid ${THEME.gold}`, color: THEME.gold, padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700 }}>Next →</button>
          </div>

          <div style={{ marginTop: 12 }}><SL>Full Lineup</SL>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>{activeBattingOrder.map((pid, i) => {
              const p = getPlayer(pid); if (!p) return null; const abs = form.atBats[pid] || [];
              return <button key={pid} onClick={() => setCurBatterIdx(i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "6px 10px", background: i === curBatterIdx ? `${THEME.gold}15` : "transparent", border: "none", borderBottom: `1px solid ${THEME.charcoal}`, cursor: "pointer", textAlign: "left", borderLeft: i === curBatterIdx ? `3px solid ${THEME.gold}` : "3px solid transparent" }}>
                <span style={{ color: i === curBatterIdx ? THEME.gold : THEME.white, fontSize: 13, fontWeight: i === curBatterIdx ? 700 : 400 }}>{i + 1}. {p.name.split(" ")[0]}</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {abs.map((ab, j) => { const c = typeof ab === "string" ? ab : ab.code; const inn = typeof ab === "string" ? null : ab.inning; const dupeInning = inn && abs.filter((a, k) => k !== j && typeof a === "object" && a.inning === inn).length > 0; return <span key={j} style={{ padding: "0 4px", fontSize: 9, borderRadius: 2, background: `${abColor(c)}20`, color: abColor(c) }}>{inn ? `${inn}:` : ""}{c}{dupeInning ? `(${abs.slice(0, j + 1).filter(a => typeof a === "object" && a.inning === inn).length})` : ""}</span>; })}
                  <span style={{ color: THEME.gold, fontSize: 11, fontFamily: "'Oswald',sans-serif", marginLeft: 4 }}>{pLine(abs)}</span>
                </div>
              </button>;
            })}</div>
          </div>
        </div> : defenseMode === "offense" ? <p style={{ color: THEME.gray }}>Set up attendance and batting order in Game Setup first.</p> : null}
      </div>}

      {/* COACH REVIEW */}
      {mode === "coach" && <div>
        <SL>Player Observations</SL>
        <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>{activeBattingOrder.map(pid => { const p = getPlayer(pid); if (!p) return null; return <div key={pid} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ color: THEME.white, fontSize: 12, fontWeight: 600, minWidth: 80, flexShrink: 0 }}>{p.name.split(" ")[0]}</span><input value={form.observations[pid] || ""} onChange={e => setForm({ ...form, observations: { ...form.observations, [pid]: e.target.value } })} placeholder="One thing..." style={{ flex: 1, padding: "6px 8px", background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 4, color: THEME.white, fontSize: 12, outline: "none" }} /></div>; })}</div>
        {players.filter(p => p.isPitcher && form.attendance[p.id]).length > 0 && <div style={{ marginBottom: 16 }}><SL>Pitching</SL>{players.filter(p => p.isPitcher && form.attendance[p.id]).map(p => <div key={p.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 8, alignItems: "center", padding: "6px 0" }}><span style={{ color: THEME.white, fontSize: 13, fontWeight: 600, minWidth: 80 }}>{p.name.split(" ")[0]}</span><Input label="Innings" type="number" min={0} value={(form.pitching[p.id] || {}).innings || ""} onChange={e => setForm({ ...form, pitching: { ...form.pitching, [p.id]: { ...(form.pitching[p.id] || {}), innings: e.target.value } } })} /><Input label="Pitches" type="number" min={0} value={(form.pitching[p.id] || {}).pitchCount || ""} onChange={e => setForm({ ...form, pitching: { ...form.pitching, [p.id]: { ...(form.pitching[p.id] || {}), pitchCount: e.target.value } } })} /></div>)}</div>}
        <TextArea label="Coach Notes" value={form.coachNotes} onChange={e => setForm({ ...form, coachNotes: e.target.value })} placeholder="What worked, adjustments, highlights..." />
      </div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button variant="ghost" onClick={() => { setShow(false); setEd(null); setCurBatterIdx(0); }}>Cancel</Button>
        <Button onClick={save}>Save Game</Button>
      </div>
    </Modal>
  </div>;
};

// ─── PRACTICE LOG ───────────────────────────────────────────────
// ─── COMMS ──────────────────────────────────────────────────────
const Comms = ({ players }) => {
  const [sel, setSel] = useState(null); const [body, setBody] = useState(""); const [sent, setSent] = useState([]);
  useEffect(() => { loadStore(STORAGE_KEYS.MESSAGES, []).then(setSent); }, []); useEffect(() => { saveStore(STORAGE_KEYS.MESSAGES, sent); }, [sent]);

  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    <div><SL>Templates</SL>{MSG_TEMPLATES.map(t => <div key={t.id} onClick={() => { setSel(t); setBody(t.body); }} style={{ padding: "10px 14px", background: sel?.id===t.id?THEME.charcoal:THEME.black, borderRadius: 6, marginBottom: 6, cursor: "pointer", border: `1px solid ${sel?.id===t.id?THEME.gold:THEME.charcoal}` }}><div style={{ color: THEME.white, fontWeight: 600, fontSize: 14 }}>{t.name}</div></div>)}
      {sent.length>0 && <div style={{ marginTop: 16 }}><SL>Sent</SL>{sent.slice(-5).reverse().map(m => <div key={m.id} style={{ padding: "6px 10px", background: THEME.black, borderRadius: 4, marginBottom: 4, fontSize: 12 }}><span style={{ color: THEME.gold }}>{m.template}</span><span style={{ color: THEME.gray, marginLeft: 8 }}>{new Date(m.date).toLocaleDateString()}</span></div>)}</div>}</div>
    <div>{sel ? <div><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><SL>Edit</SL><Button small onClick={() => { navigator.clipboard?.writeText(body); setSent(p => [...p, { id: Date.now().toString(), template: sel.name, date: new Date().toISOString() }]); }}>Copy</Button></div>
      <textarea value={body} onChange={e => setBody(e.target.value)} style={{ width: "100%", minHeight: 300, padding: 12, background: THEME.black, border: `1px solid ${THEME.charcoal}`, borderRadius: 6, color: THEME.white, fontSize: 13, fontFamily: "'Source Sans 3',sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
      {players.filter(p=>p.parentPhone).length>0 && <div style={{ marginTop: 8 }}><SL>Contacts</SL><div style={{ maxHeight: 100, overflowY: "auto", background: THEME.black, borderRadius: 6, padding: 8 }}>{players.filter(p=>p.parentPhone).map(p => <div key={p.id} style={{ fontSize: 11, color: THEME.gray, padding: "2px 0" }}><span style={{ color: THEME.white }}>{p.name}</span> — {p.parentName} {p.parentPhone}</div>)}</div></div>}
    </div> : <Card style={{ textAlign: "center", padding: 40 }}><p style={{ color: THEME.gray }}>Select a template</p></Card>}</div>
  </div>;
};

// ─── COLLAPSIBLE SECTION COMPONENT ──────────────────────────────
const CollapsibleSection = ({ id, title, icon, badge, isCollapsed, onToggle, children }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={() => onToggle(id)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isCollapsed ? 0 : 12,
          cursor: "pointer",
          padding: "12px 16px",
          background: THEME.charcoal,
          borderRadius: 8,
          transition: "all 0.2s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h3 style={{
            color: THEME.gold,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "'Oswald',sans-serif",
            margin: 0,
            textTransform: "uppercase"
          }}>
            {icon} {title}
          </h3>
          {badge && <span style={{
            color: THEME.gray,
            fontSize: 13,
            fontWeight: 600,
            background: THEME.black,
            padding: "4px 10px",
            borderRadius: 12
          }}>{badge}</span>}
        </div>
        <div style={{
          color: THEME.gold,
          fontSize: 20,
          transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
          transition: "transform 0.2s ease"
        }}>
          ▼
        </div>
      </div>
      {!isCollapsed && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
};

// ─── REPORTS ────────────────────────────────────────────────────
const Reports = ({ players }) => {
  const [practices, setPractices] = useState([]);
  const [games, setGames] = useState([]);
  const [dateRange, setDateRange] = useState("all"); // "all", "30", "60", "90"
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlayerGameLog, setSelectedPlayerGameLog] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const saved = localStorage.getItem("pirates-reports-collapsed");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    loadStore("pirates-practices-unified-2026v1", []).then(setPractices);
    loadStore(STORAGE_KEYS.GAMELOGS, []).then(setGames);
  }, []);

  useEffect(() => {
    localStorage.setItem("pirates-reports-collapsed", JSON.stringify(collapsedSections));
  }, [collapsedSections]);

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Filter practices by date range
  const getFilteredPractices = () => {
    if (dateRange === "all") return practices;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(dateRange));
    return practices.filter(p => p.date && new Date(p.date + "T12:00:00") >= cutoff);
  };

  const filteredPractices = getFilteredPractices();
  const completedPractices = filteredPractices.filter(p => p.status === "completed");

  // Calculate overall stats
  const totalPractices = completedPractices.length;
  const totalPlayers = players.length;
  const avgAttendance = totalPractices > 0
    ? completedPractices.reduce((sum, p) => sum + Object.values(p.attendance || {}).filter(Boolean).length, 0) / totalPractices
    : 0;

  // Get all drills that have been tracked
  const trackedDrills = [...new Set(
    completedPractices.flatMap(p => Object.keys(p.drillTracking || {}))
  )].map(drillId => ({
    id: drillId,
    ...DRILL_LIBRARY.find(d => d.id === drillId),
    config: TRACKABLE_DRILLS[drillId]
  })).filter(d => d.config);

  // Collapse/Expand functions (defined after trackedDrills)
  const collapseAll = () => {
    const allSections = ["stats", "attendance", "games", ...trackedDrills.map(d => d.id)];
    const collapsed = {};
    allSections.forEach(id => collapsed[id] = true);
    setCollapsedSections(collapsed);
  };

  const expandAll = () => {
    setCollapsedSections({});
  };

  // Calculate player drill performance
  const getPlayerDrillData = (playerId, drillId) => {
    const config = TRACKABLE_DRILLS[drillId];
    if (!config || !config.perPlayer) return [];

    return completedPractices
      .filter(p => p.drillTracking?.[drillId]?.[playerId] && p.attendance?.[playerId])
      .map(p => ({
        date: p.date,
        value: p.drillTracking[drillId][playerId],
        practice: p
      }))
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  };

  // Calculate leaderboards for each drill
  const getLeaderboard = (drillId) => {
    const config = TRACKABLE_DRILLS[drillId];
    if (!config || !config.perPlayer) return [];

    const playerStats = players.map(player => {
      const drillData = getPlayerDrillData(player.id, drillId);
      if (drillData.length === 0) return null;

      let bestValue = null;
      let avgValue = null;
      let improvement = null;

      if (config.type === "time") {
        // Lower is better for time
        const times = drillData.map(d => parseFloat(d.value)).filter(t => !isNaN(t) && t > 0);
        if (times.length === 0) return null;
        bestValue = Math.min(...times);
        avgValue = times.reduce((a, b) => a + b, 0) / times.length;
        if (times.length >= 2) {
          improvement = times[0] - times[times.length - 1]; // Positive = got faster
        }
      } else if (config.type === "strikes-balls") {
        const ratios = drillData.map(d => {
          const s = d.value.strikes || 0;
          const b = d.value.balls || 0;
          return (s + b) > 0 ? s / (s + b) : 0;
        });
        if (ratios.length === 0) return null;
        bestValue = Math.max(...ratios);
        avgValue = ratios.reduce((a, b) => a + b, 0) / ratios.length;
        if (ratios.length >= 2) {
          improvement = ratios[ratios.length - 1] - ratios[0];
        }
      } else {
        // Higher is better for points/level
        const values = drillData.map(d => parseFloat(d.value)).filter(v => !isNaN(v));
        if (values.length === 0) return null;
        bestValue = Math.max(...values);
        avgValue = values.reduce((a, b) => a + b, 0) / values.length;
        if (values.length >= 2) {
          improvement = values[values.length - 1] - values[0];
        }
      }

      return {
        player,
        attempts: drillData.length,
        bestValue,
        avgValue,
        improvement,
        trend: improvement > 0 ? "up" : improvement < 0 ? "down" : "flat"
      };
    }).filter(Boolean);

    // Sort by best value (ascending for time, descending for others)
    if (config.type === "time") {
      playerStats.sort((a, b) => a.bestValue - b.bestValue);
    } else {
      playerStats.sort((a, b) => b.bestValue - a.bestValue);
    }

    return playerStats;
  };

  // Game Analytics Calculations
  const filteredGames = games.filter(g => {
    if (dateRange === "all") return true;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(dateRange));
    return g.date && new Date(g.date + "T12:00:00") >= cutoff;
  });

  const gameStats = {
    total: filteredGames.length,
    wins: filteredGames.filter(g => g.result === "W").length,
    losses: filteredGames.filter(g => g.result === "L").length,
    ties: filteredGames.filter(g => g.result === "T").length,
    runsScored: filteredGames.reduce((sum, g) => sum + (g.ourScore || 0), 0),
    runsAllowed: filteredGames.reduce((sum, g) => sum + (g.theirScore || 0), 0)
  };
  gameStats.winPct = gameStats.total > 0 ? (gameStats.wins / gameStats.total) : 0;

  // Calculate batting stats
  const playerBattingStats = players.map(player => {
    const atBats = filteredGames.flatMap(g => g.atBats || []).filter(ab => ab.playerId === player.id);
    if (atBats.length === 0) return null;

    const hits = atBats.filter(ab => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
    const singles = atBats.filter(ab => ab.result === "1B").length;
    const doubles = atBats.filter(ab => ab.result === "2B").length;
    const triples = atBats.filter(ab => ab.result === "3B").length;
    const hrs = atBats.filter(ab => ab.result === "HR").length;
    const totalBases = singles + (doubles * 2) + (triples * 3) + (hrs * 4);
    const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
    const runs = atBats.reduce((sum, ab) => sum + (ab.runs || 0), 0);
    const avg = atBats.length > 0 ? hits / atBats.length : 0;
    const slg = atBats.length > 0 ? totalBases / atBats.length : 0;

    return {
      player,
      atBats: atBats.length,
      hits,
      avg,
      slg,
      rbi,
      runs,
      hrs,
      doubles,
      triples
    };
  }).filter(Boolean).sort((a, b) => b.avg - a.avg);

  // Calculate pitching stats
  const playerPitchingStats = players.map(player => {
    const pitching = filteredGames.flatMap(g => (g.pitching || []).filter(p => p.playerId === player.id));
    if (pitching.length === 0) return null;

    const inningsPitched = pitching.reduce((sum, p) => sum + (p.innings || 0), 0);
    const runsAllowed = pitching.reduce((sum, p) => sum + (p.runsAllowed || 0), 0);
    const earnedRuns = pitching.reduce((sum, p) => sum + (p.earnedRuns || 0), 0);
    const strikeouts = pitching.reduce((sum, p) => sum + (p.strikeouts || 0), 0);
    const walks = pitching.reduce((sum, p) => sum + (p.walks || 0), 0);
    const era = inningsPitched > 0 ? (earnedRuns / inningsPitched) * 7 : 0;

    return {
      player,
      inningsPitched,
      era,
      strikeouts,
      walks,
      earnedRuns,
      appearances: pitching.length
    };
  }).filter(Boolean).sort((a, b) => a.era - b.era);

  // Format value for display
  const formatValue = (value, config) => {
    if (config.type === "time") {
      return `${value.toFixed(2)}s`;
    } else if (config.type === "strikes-balls") {
      return `${(value * 100).toFixed(0)}%`;
    } else if (config.type === "level") {
      return `Level ${Math.round(value)}`;
    } else {
      return `${Math.round(value)} pts`;
    }
  };

  return <div>
    {/* Header with date range filter */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div>
        <h2 style={{ color: THEME.gold, fontSize: 20, fontWeight: 700, fontFamily: "'Oswald',sans-serif", margin: 0, textTransform: "uppercase" }}>📊 Reports</h2>
        <p style={{ color: THEME.gray, margin: "4px 0 0 0", fontSize: 13 }}>Track player improvement and team performance</p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[["all", "All Time"], ["30", "30 Days"], ["60", "60 Days"], ["90", "90 Days"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setDateRange(val)}
            style={{
              background: dateRange === val ? THEME.gold : "transparent",
              border: `1px solid ${dateRange === val ? THEME.gold : THEME.charcoal}`,
              color: dateRange === val ? THEME.black : THEME.white,
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Oswald',sans-serif"
            }}
          >{label}</button>
        ))}
      </div>
    </div>

    {/* Collapse/Expand Controls */}
    {(completedPractices.length > 0 || filteredGames.length > 0) && (
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button small onClick={expandAll}>⬇️ Expand All</Button>
        <Button small onClick={collapseAll}>⬆️ Collapse All</Button>
      </div>
    )}

    {completedPractices.length === 0 ? (
      <Card style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
        <p style={{ color: THEME.gray, margin: 0 }}>No completed practices with tracking data yet.</p>
        <p style={{ color: THEME.gray, margin: "8px 0 0 0", fontSize: 13 }}>Complete practices with drill tracking to see analytics here.</p>
      </Card>
    ) : (
      <div>
        {/* Practice Stats - Collapsible */}
        <CollapsibleSection
          id="stats"
          title="Practice Analytics"
          icon="📊"
          isCollapsed={collapsedSections["stats"]}
          onToggle={toggleSection}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.gold}40` }}>
              <div style={{ color: THEME.gold, fontSize: 32, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{totalPractices}</div>
              <div style={{ color: THEME.gray, fontSize: 12, textTransform: "uppercase", marginTop: 4 }}>Completed Practices</div>
            </Card>
            <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.blue}40` }}>
              <div style={{ color: THEME.blue, fontSize: 32, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{avgAttendance.toFixed(1)}</div>
              <div style={{ color: THEME.gray, fontSize: 12, textTransform: "uppercase", marginTop: 4 }}>Avg Attendance</div>
            </Card>
            <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.green}40` }}>
              <div style={{ color: THEME.green, fontSize: 32, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{trackedDrills.length}</div>
              <div style={{ color: THEME.gray, fontSize: 12, textTransform: "uppercase", marginTop: 4 }}>Drills Tracked</div>
            </Card>
          </div>
        </CollapsibleSection>

        {/* Drill Leaderboards - Each drill is collapsible */}

        {trackedDrills.length === 0 ? (
          <Card style={{ padding: 20, textAlign: "center" }}>
            <p style={{ color: THEME.gray, margin: 0 }}>No drill tracking data available for this date range.</p>
          </Card>
        ) : (
          <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
            {trackedDrills.map(drill => {
              const leaderboard = getLeaderboard(drill.id);
              if (leaderboard.length === 0) return null;

              return (
                <CollapsibleSection
                  key={drill.id}
                  id={drill.id}
                  title={drill.name}
                  icon="🏆"
                  badge={`${leaderboard.length} players`}
                  isCollapsed={collapsedSections[drill.id]}
                  onToggle={toggleSection}
                >
                  <Card style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ color: THEME.gray, fontSize: 12 }}>{drill.config.description}</div>
                      <Button small onClick={(e) => {
                        e.stopPropagation();
                        const csvData = [
                          ['Rank', 'Player', 'Best', 'Average', 'Attempts', 'Improvement'],
                          ...leaderboard.map((stat, idx) => [
                            idx + 1,
                            stat.player.name,
                            formatValue(stat.bestValue, drill.config),
                            formatValue(stat.avgValue, drill.config),
                            stat.attempts,
                            stat.improvement !== null ? (stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "→") : "N/A"
                          ])
                        ];
                        exportToCSV(csvData, `${drill.name.replace(/\s+/g, '_')}_leaderboard.csv`);
                      }}>📥 Export CSV</Button>
                    </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    {leaderboard.slice(0, 10).map((stat, idx) => (
                      <div
                        key={stat.player.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: idx < 3 ? THEME.blackLight : "transparent",
                          borderRadius: 6,
                          border: `1px solid ${idx === 0 ? THEME.gold : idx === 1 ? THEME.grayLight : idx === 2 ? "#CD7F32" : THEME.charcoal}`,
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setSelectedPlayer(stat.player.id);
                          setSelectedDrill(drill.id);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: idx === 0 ? THEME.gold : idx === 1 ? THEME.grayLight : idx === 2 ? "#CD7F32" : THEME.charcoal,
                            color: idx < 3 ? THEME.black : THEME.white,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "'Oswald',sans-serif"
                          }}>{idx + 1}</div>
                          <div>
                            <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>{stat.player.name}</div>
                            <div style={{ color: THEME.gray, fontSize: 11 }}>{stat.attempts} attempt{stat.attempts !== 1 ? "s" : ""}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: THEME.white, fontSize: 15, fontWeight: 700 }}>
                              {formatValue(stat.bestValue, drill.config)}
                            </div>
                            <div style={{ color: THEME.gray, fontSize: 11 }}>
                              avg: {formatValue(stat.avgValue, drill.config)}
                            </div>
                          </div>
                          {stat.improvement !== null && (
                            <div style={{
                              color: stat.trend === "up" ? THEME.green : stat.trend === "down" ? THEME.red : THEME.gray,
                              fontSize: 18,
                              width: 24,
                              textAlign: "center"
                            }}>
                              {stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "→"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                    {leaderboard.length > 10 && (
                      <p style={{ color: THEME.gray, fontSize: 11, textAlign: "center", marginTop: 8, marginBottom: 0 }}>
                        + {leaderboard.length - 10} more player{leaderboard.length - 10 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </Card>
                </CollapsibleSection>
              );
            })}
          </div>
        )}

        {/* Player Progress Detail Modal */}
        {selectedPlayer && selectedDrill && (() => {
          const player = players.find(p => p.id === selectedPlayer);
          const drill = trackedDrills.find(d => d.id === selectedDrill);
          const drillData = getPlayerDrillData(selectedPlayer, selectedDrill);

          return (
            <Modal
              open={true}
              onClose={() => { setSelectedPlayer(null); setSelectedDrill(null); }}
              title={`${player?.name} - ${drill?.name}`}
            >
              <div>
                <p style={{ color: THEME.gray, fontSize: 13, marginBottom: 16 }}>{drill?.config?.description}</p>

                {drillData.length === 0 ? (
                  <p style={{ color: THEME.gray, textAlign: "center", padding: 20 }}>No data available for this player.</p>
                ) : (
                  <div>
                    <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Progress Over Time ({drillData.length} session{drillData.length !== 1 ? "s" : ""})</h4>
                    <div style={{ display: "grid", gap: 8 }}>
                      {drillData.map((d, idx) => {
                        let displayValue = "";
                        if (drill.config.type === "strikes-balls") {
                          const s = d.value.strikes || 0;
                          const b = d.value.balls || 0;
                          const pct = (s + b) > 0 ? ((s / (s + b)) * 100).toFixed(0) : 0;
                          displayValue = `${s}/${b} (${pct}% strikes)`;
                        } else if (drill.config.type === "time") {
                          displayValue = `${d.value}s`;
                        } else if (drill.config.type === "level") {
                          displayValue = `Level ${d.value}`;
                        } else {
                          displayValue = `${d.value} pts`;
                        }

                        return (
                          <div key={idx} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: idx === drillData.length - 1 ? THEME.blackLight : "transparent",
                            borderRadius: 4,
                            border: `1px solid ${THEME.charcoal}`
                          }}>
                            <span style={{ color: THEME.gray, fontSize: 12 }}>
                              {d.date ? new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date"}
                            </span>
                            <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{displayValue}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <Button onClick={() => { setSelectedPlayer(null); setSelectedDrill(null); }}>Close</Button>
              </div>
            </Modal>
          );
        })()}

        {/* Game Analytics Section */}
        {filteredGames.length > 0 && (
          <CollapsibleSection
            id="games"
            title="Game Analytics"
            icon="⚾"
            badge={`${gameStats.total} games`}
            isCollapsed={collapsedSections["games"]}
            onToggle={toggleSection}
          >
            {/* Game Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
              <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.green}40` }}>
                <div style={{ color: THEME.green, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                  {gameStats.wins}-{gameStats.losses}{gameStats.ties > 0 ? `-${gameStats.ties}` : ""}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>
                  Record ({(gameStats.winPct * 100).toFixed(0)}%)
                </div>
              </Card>
              <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.blue}40` }}>
                <div style={{ color: THEME.blue, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                  {gameStats.runsScored}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>Runs Scored</div>
              </Card>
              <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.red}40` }}>
                <div style={{ color: THEME.red, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                  {gameStats.runsAllowed}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>Runs Allowed</div>
              </Card>
              <Card style={{ padding: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)`, border: `1px solid ${THEME.gold}40` }}>
                <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                  +{gameStats.runsScored - gameStats.runsAllowed}
                </div>
                <div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase", marginTop: 4 }}>Run Differential</div>
              </Card>
            </div>

            {/* Game History Timeline */}
            <Card style={{ padding: 16, marginBottom: 16 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Game History</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {filteredGames.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map(game => {
                  const isWin = game.result === "W";
                  const isLoss = game.result === "L";
                  const isTie = game.result === "T";
                  const resultColor = isWin ? THEME.green : isLoss ? THEME.red : THEME.gray;
                  const resultIcon = isWin ? "✅" : isLoss ? "❌" : "⏸️";
                  const locationIcon = game.location?.toLowerCase().includes("home") ? "🏠" : "✈️";

                  return (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 14px",
                        background: THEME.blackLight,
                        borderRadius: 6,
                        border: `1px solid ${resultColor}40`,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = resultColor}
                      onMouseLeave={e => e.currentTarget.style.borderColor = `${resultColor}40`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          fontSize: 20,
                          width: 32,
                          textAlign: "center"
                        }}>{resultIcon}</div>
                        <div>
                          <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                            {game.date ? new Date(game.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                            {" "}vs {game.opponent}
                          </div>
                          <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>
                            {locationIcon} {game.location || "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            color: resultColor,
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: "'Oswald',sans-serif"
                          }}>
                            {game.result} {game.ourScore}-{game.theirScore}
                          </div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>
                            {game.innings || 7} innings
                          </div>
                          <div style={{ color: THEME.gold, fontSize: 9, marginTop: 2, fontStyle: "italic" }}>
                            Click for details
                          </div>
                        </div>
                        <div style={{ color: THEME.gold, fontSize: 16 }}>›</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Top Hitters */}
            {playerBattingStats.length > 0 && (
              <Card style={{ padding: 16, marginBottom: 16 }}>
                <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏏 Top Hitters</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {playerBattingStats.slice(0, 5).map((stat, idx) => (
                    <div key={stat.player.id} onClick={() => setSelectedPlayerGameLog(stat.player)} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: idx === 0 ? THEME.blackLight : "transparent",
                      borderRadius: 4,
                      border: `1px solid ${idx === 0 ? THEME.gold : THEME.charcoal}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = THEME.blackLight}
                    onMouseLeave={e => e.currentTarget.style.background = idx === 0 ? THEME.blackLight : "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: idx === 0 ? THEME.gold : THEME.charcoal,
                          color: idx === 0 ? THEME.black : THEME.white,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700
                        }}>{idx + 1}</div>
                        <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{stat.player.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.gold, fontWeight: 700 }}>{stat.avg.toFixed(3)}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>AVG</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.white, fontWeight: 700 }}>{stat.hits}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>H</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.white, fontWeight: 700 }}>{stat.rbi}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>RBI</div>
                        </div>
                        {stat.hrs > 0 && (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: THEME.green, fontWeight: 700 }}>{stat.hrs}</div>
                            <div style={{ color: THEME.gray, fontSize: 10 }}>HR</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Top Pitchers */}
            {playerPitchingStats.length > 0 && (
              <Card style={{ padding: 16 }}>
                <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚡ Top Pitchers</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {playerPitchingStats.slice(0, 5).map((stat, idx) => (
                    <div key={stat.player.id} onClick={() => setSelectedPlayerGameLog(stat.player)} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: idx === 0 ? THEME.blackLight : "transparent",
                      borderRadius: 4,
                      border: `1px solid ${idx === 0 ? THEME.gold : THEME.charcoal}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = THEME.blackLight}
                    onMouseLeave={e => e.currentTarget.style.background = idx === 0 ? THEME.blackLight : "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: idx === 0 ? THEME.gold : THEME.charcoal,
                          color: idx === 0 ? THEME.black : THEME.white,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700
                        }}>{idx + 1}</div>
                        <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{stat.player.name}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.gold, fontWeight: 700 }}>{stat.era.toFixed(2)}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>ERA</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.white, fontWeight: 700 }}>{stat.inningsPitched.toFixed(1)}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>IP</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.green, fontWeight: 700 }}>{stat.strikeouts}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>K</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: THEME.red, fontWeight: 700 }}>{stat.walks}</div>
                          <div style={{ color: THEME.gray, fontSize: 10 }}>BB</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </CollapsibleSection>
        )}

        {/* Attendance Summary */}
        <CollapsibleSection
          id="attendance"
          title="Attendance Summary"
          icon="📅"
          badge={`${players.length} players`}
          isCollapsed={collapsedSections["attendance"]}
          onToggle={toggleSection}
        >
          <Card style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <Button small onClick={() => {
                const csvData = [
                  ['Player', 'Practices Attended', 'Total Practices', 'Attendance %'],
                  ...players.map(player => {
                    const attended = completedPractices.filter(p => p.attendance?.[player.id]).length;
                    const percentage = totalPractices > 0 ? ((attended / totalPractices) * 100).toFixed(0) : 0;
                    return [player.name, attended, totalPractices, percentage + '%'];
                  })
                ];
                exportToCSV(csvData, 'attendance_summary.csv');
              }}>📥 Export CSV</Button>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {players.map(player => {
                const attended = completedPractices.filter(p => p.attendance?.[player.id]).length;
                const percentage = totalPractices > 0 ? ((attended / totalPractices) * 100).toFixed(0) : 0;

                return (
                  <div key={player.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "transparent",
                    borderRadius: 4,
                    border: `1px solid ${THEME.charcoal}`
                  }}>
                    <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{player.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 120, height: 8, background: THEME.charcoal, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${THEME.gold} 0%, ${THEME.goldLight} 100%)`,
                          transition: "width 0.3s ease"
                        }} />
                      </div>
                      <span style={{ color: THEME.gray, fontSize: 12, minWidth: 70, textAlign: "right" }}>
                        {attended}/{totalPractices} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </CollapsibleSection>

        {/* Playing Time & Attendance Equity */}
        <CollapsibleSection
          id="playing-time"
          title="Playing Time & Attendance Equity"
          icon="⏱️"
          badge={`${players.length} players`}
          isCollapsed={collapsedSections["playing-time"]}
          onToggle={toggleSection}
        >
          {(() => {
            // Calculate practice attendance (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentPractices = completedPractices.filter(p => {
              if (!p.date) return false;
              const practiceDate = new Date(p.date + "T12:00:00");
              return practiceDate >= thirtyDaysAgo;
            });

            // Calculate innings played from games (estimate: each game = 7 innings, divide by lineup size)
            const playerPlayingTime = players.map(player => {
              // Practice attendance
              const practicesAttended = recentPractices.filter(p => p.attendance?.[player.id]).length;
              const attendancePercent = recentPractices.length > 0 ? (practicesAttended / recentPractices.length) * 100 : 0;

              // Game innings played (estimate from games they were in lineup)
              const gamesPlayed = filteredGames.filter(g => (g.lineup || []).find(l => l.playerId === player.id));
              const estimatedInnings = gamesPlayed.length * 7; // Rough estimate - assume full game
              const totalPossibleInnings = filteredGames.length * 7;
              const playingTimePercent = totalPossibleInnings > 0 ? (estimatedInnings / totalPossibleInnings) * 100 : 0;

              return {
                player,
                practicesAttended,
                totalRecentPractices: recentPractices.length,
                attendancePercent,
                gamesPlayed: gamesPlayed.length,
                totalGames: filteredGames.length,
                estimatedInnings,
                totalPossibleInnings,
                playingTimePercent,
                needsAttention: attendancePercent < 70 || playingTimePercent < 40
              };
            }).sort((a, b) => b.attendancePercent - a.attendancePercent);

            return (
              <div>
                {/* Summary Stats */}
                <Card style={{ padding: 16, marginBottom: 16, background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)` }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, textAlign: "center" }}>
                    <div>
                      <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                        {recentPractices.length}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 11 }}>Practices (30 days)</div>
                    </div>
                    <div>
                      <div style={{ color: THEME.blue, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                        {filteredGames.length}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 11 }}>Games Played</div>
                    </div>
                    <div>
                      <div style={{ color: THEME.red, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>
                        {playerPlayingTime.filter(p => p.needsAttention).length}
                      </div>
                      <div style={{ color: THEME.gray, fontSize: 11 }}>Need Attention</div>
                    </div>
                  </div>
                </Card>

                {/* Player List */}
                <Card style={{ padding: 16 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    {playerPlayingTime.map(pt => {
                      const lowAttendance = pt.attendancePercent < 70;
                      const lowPlayingTime = pt.playingTimePercent < 40;

                      return (
                        <div key={pt.player.id} style={{
                          padding: "12px",
                          background: pt.needsAttention ? "rgba(231,76,60,0.1)" : THEME.blackLight,
                          borderRadius: 6,
                          border: `1px solid ${pt.needsAttention ? THEME.red + "40" : THEME.charcoal}`
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <div style={{ color: THEME.white, fontSize: 14, fontWeight: 600 }}>
                                {pt.player.name}
                                {pt.needsAttention && <span style={{ color: THEME.red, marginLeft: 8 }}>⚠️ Needs Attention</span>}
                              </div>
                              <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>
                                {pt.player.primaryPosition && `Primary: ${pt.player.primaryPosition}`}
                                {(pt.player.secondaryPositions || []).length > 0 && ` • Can play: ${(pt.player.secondaryPositions || []).join(", ")}`}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {/* Practice Attendance */}
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ color: THEME.gray, fontSize: 11 }}>Practice Attendance (30d)</span>
                                <span style={{
                                  color: lowAttendance ? THEME.red : THEME.green,
                                  fontSize: 11,
                                  fontWeight: 700
                                }}>
                                  {pt.practicesAttended}/{pt.totalRecentPractices} ({pt.attendancePercent.toFixed(0)}%)
                                </span>
                              </div>
                              <div style={{ width: "100%", height: 6, background: THEME.charcoal, borderRadius: 3, overflow: "hidden" }}>
                                <div style={{
                                  width: `${pt.attendancePercent}%`,
                                  height: "100%",
                                  background: lowAttendance ? THEME.red : THEME.green,
                                  transition: "width 0.3s ease"
                                }} />
                              </div>
                              {lowAttendance && (
                                <div style={{ color: THEME.red, fontSize: 10, marginTop: 2 }}>
                                  ⚠️ Low practice attendance - limit playing time
                                </div>
                              )}
                            </div>

                            {/* Playing Time */}
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ color: THEME.gray, fontSize: 11 }}>Est. Playing Time</span>
                                <span style={{
                                  color: lowPlayingTime ? THEME.red : THEME.green,
                                  fontSize: 11,
                                  fontWeight: 700
                                }}>
                                  {pt.gamesPlayed}/{pt.totalGames} games ({pt.playingTimePercent.toFixed(0)}%)
                                </span>
                              </div>
                              <div style={{ width: "100%", height: 6, background: THEME.charcoal, borderRadius: 3, overflow: "hidden" }}>
                                <div style={{
                                  width: `${pt.playingTimePercent}%`,
                                  height: "100%",
                                  background: lowPlayingTime ? THEME.red : THEME.green,
                                  transition: "width 0.3s ease"
                                }} />
                              </div>
                              {lowPlayingTime && !lowAttendance && (
                                <div style={{ color: THEME.red, fontSize: 10, marginTop: 2 }}>
                                  ⚠️ Low playing time - prioritize in next game
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })()}
        </CollapsibleSection>
      </div>
    )}

    {/* Game Details Modal - Rendered at component level */}
    {selectedGame && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20
      }} onClick={() => setSelectedGame(null)}>
        <div onClick={e => e.stopPropagation()} style={{
          background: THEME.blackLight,
          borderRadius: 12,
          padding: 24,
          border: `2px solid ${THEME.gold}`,
          maxWidth: 800,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 20, textTransform: "uppercase" }}>
              {selectedGame.result === "W" ? "✅" : selectedGame.result === "L" ? "❌" : "⏸️"} vs {selectedGame.opponent}
            </h3>
            <button onClick={() => setSelectedGame(null)} style={{
              background: "none",
              border: "none",
              color: THEME.gray,
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              width: 32,
              height: 32
            }}>✕</button>
          </div>
          <div style={{ color: THEME.gray, fontSize: 12, marginBottom: 16 }}>
            {selectedGame.date ? new Date(selectedGame.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : ""}
            {" • "}{selectedGame.location || "Unknown Location"}
          </div>

        {/* Final Score */}
        <Card style={{ padding: 20, marginBottom: 16, textAlign: "center", background: `linear-gradient(135deg, ${THEME.blackLight} 0%, ${THEME.black} 100%)` }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
            <div>
              <div style={{ color: THEME.gray, fontSize: 12, marginBottom: 4 }}>Pirates</div>
              <div style={{
                color: selectedGame.result === "W" ? THEME.green : selectedGame.result === "L" ? THEME.red : THEME.gray,
                fontSize: 48,
                fontWeight: 700,
                fontFamily: "'Oswald',sans-serif"
              }}>{selectedGame.ourScore}</div>
            </div>
            <div style={{ color: THEME.gray, fontSize: 24 }}>-</div>
            <div>
              <div style={{ color: THEME.gray, fontSize: 12, marginBottom: 4 }}>{selectedGame.opponent}</div>
              <div style={{
                color: THEME.gray,
                fontSize: 48,
                fontWeight: 700,
                fontFamily: "'Oswald',sans-serif"
              }}>{selectedGame.theirScore}</div>
            </div>
          </div>
          <div style={{ color: THEME.gray, fontSize: 12, marginTop: 12 }}>
            Final • {selectedGame.innings || 7} innings
          </div>
        </Card>

        {/* Top Performers */}
        {selectedGame.atBats && selectedGame.atBats.length > 0 && (
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⭐ Top Performers</h4>
            <div style={{ display: "grid", gap: 8 }}>
              {(() => {
                // Calculate player contributions
                const contributions = {};
                selectedGame.atBats.forEach(ab => {
                  if (!contributions[ab.playerId]) {
                    contributions[ab.playerId] = { hits: 0, atBats: 0, rbi: 0, runs: 0 };
                  }
                  contributions[ab.playerId].atBats++;
                  if (["1B", "2B", "3B", "HR"].includes(ab.result)) contributions[ab.playerId].hits++;
                  contributions[ab.playerId].rbi += ab.rbi || 0;
                  contributions[ab.playerId].runs += ab.runs || 0;
                });

                // Get top 5 by hits + RBI
                return Object.entries(contributions)
                  .map(([playerId, stats]) => ({
                    player: players.find(p => p.id === playerId),
                    ...stats
                  }))
                  .filter(p => p.player && (p.hits > 0 || p.rbi > 0 || p.runs > 0))
                  .sort((a, b) => (b.hits + b.rbi) - (a.hits + a.rbi))
                  .slice(0, 5)
                  .map(stat => (
                    <div key={stat.player.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: THEME.blackLight,
                      borderRadius: 4,
                      border: `1px solid ${THEME.charcoal}`
                    }}>
                      <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{stat.player.name}</span>
                      <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                        <div style={{ color: THEME.gray }}>
                          {stat.hits}-{stat.atBats}
                        </div>
                        {stat.rbi > 0 && (
                          <div style={{ color: THEME.blue }}>
                            {stat.rbi} RBI
                          </div>
                        )}
                        {stat.runs > 0 && (
                          <div style={{ color: THEME.green }}>
                            {stat.runs} R
                          </div>
                        )}
                      </div>
                    </div>
                  ));
              })()}
            </div>
          </Card>
        )}

        {/* Pitching Summary */}
        {selectedGame.pitching && selectedGame.pitching.length > 0 && (
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚡ Pitching</h4>
            <div style={{ display: "grid", gap: 8 }}>
              {selectedGame.pitching.map(p => {
                const pitcher = players.find(pl => pl.id === p.playerId);
                if (!pitcher) return null;
                return (
                  <div key={p.playerId} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: THEME.blackLight,
                    borderRadius: 4,
                    border: `1px solid ${THEME.charcoal}`
                  }}>
                    <span style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>{pitcher.name}</span>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: THEME.gray }}>
                      <div>{p.innings || 0} IP</div>
                      <div style={{ color: THEME.green }}>{p.strikeouts || 0} K</div>
                      <div style={{ color: THEME.red }}>{p.walks || 0} BB</div>
                      <div>{p.earnedRuns || 0} ER</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Lineup */}
        {selectedGame.lineup && selectedGame.lineup.length > 0 && (
          <Card style={{ padding: 16 }}>
            <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Lineup & Positions</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
              {selectedGame.lineup
                .sort((a, b) => (a.battingOrder || 99) - (b.battingOrder || 99))
                .map(l => {
                  const player = players.find(p => p.id === l.playerId);
                  if (!player) return null;
                  return (
                    <div key={l.playerId} style={{
                      padding: "6px 10px",
                      background: THEME.blackLight,
                      borderRadius: 4,
                      border: `1px solid ${THEME.charcoal}`,
                      fontSize: 12
                    }}>
                      <div style={{ color: THEME.gold, fontWeight: 700 }}>#{l.battingOrder} {l.position}</div>
                      <div style={{ color: THEME.white, marginTop: 2 }}>{player.name}</div>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}

        </div>
      </div>
    )}

    {/* Player Game Log Modal */}
    {selectedPlayerGameLog && (() => {
      const player = selectedPlayerGameLog;

      // Calculate player's game-by-game stats
      const playerGames = filteredGames.map(game => {
        const atBats = (game.atBats || []).filter(ab => ab.playerId === player.id);
        const pitching = (game.pitching || []).filter(p => p.playerId === player.id);
        const lineup = (game.lineup || []).find(l => l.playerId === player.id);

        if (atBats.length === 0 && pitching.length === 0 && !lineup) return null;

        // Batting stats
        const hits = atBats.filter(ab => ["1B", "2B", "3B", "HR"].includes(ab.result)).length;
        const rbi = atBats.reduce((sum, ab) => sum + (ab.rbi || 0), 0);
        const runs = atBats.reduce((sum, ab) => sum + (ab.runs || 0), 0);
        const avg = atBats.length > 0 ? hits / atBats.length : 0;

        // Pitching stats
        const totalPitching = pitching.reduce((acc, p) => ({
          innings: acc.innings + (p.innings || 0),
          strikeouts: acc.strikeouts + (p.strikeouts || 0),
          walks: acc.walks + (p.walks || 0),
          earnedRuns: acc.earnedRuns + (p.earnedRuns || 0)
        }), { innings: 0, strikeouts: 0, walks: 0, earnedRuns: 0 });

        return {
          game,
          atBats: atBats.length,
          hits,
          avg,
          rbi,
          runs,
          position: lineup?.position || "N/A",
          battingOrder: lineup?.battingOrder,
          pitching: totalPitching.innings > 0 ? totalPitching : null
        };
      }).filter(Boolean);

      // Overall season totals
      const seasonTotals = playerGames.reduce((acc, g) => ({
        games: acc.games + 1,
        atBats: acc.atBats + g.atBats,
        hits: acc.hits + g.hits,
        rbi: acc.rbi + g.rbi,
        runs: acc.runs + g.runs,
        innings: acc.innings + (g.pitching?.innings || 0),
        strikeouts: acc.strikeouts + (g.pitching?.strikeouts || 0)
      }), { games: 0, atBats: 0, hits: 0, rbi: 0, runs: 0, innings: 0, strikeouts: 0 });

      const seasonAvg = seasonTotals.atBats > 0 ? seasonTotals.hits / seasonTotals.atBats : 0;

      // Positions played with frequency
      const positionCounts = {};
      playerGames.forEach(g => {
        if (g.position && g.position !== "N/A") {
          positionCounts[g.position] = (positionCounts[g.position] || 0) + 1;
        }
      });
      const positionsList = Object.entries(positionCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([pos, count]) => `${pos} (${count}x)`);

      return (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 20
        }} onClick={() => setSelectedPlayerGameLog(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: THEME.blackLight,
            borderRadius: 12,
            padding: 24,
            border: `2px solid ${THEME.gold}`,
            maxWidth: 800,
            width: "100%",
            maxHeight: "85vh",
            overflowY: "auto"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: THEME.gold, fontFamily: "'Oswald',sans-serif", fontSize: 20, textTransform: "uppercase" }}>
                👤 {player.name}
              </h3>
              <button onClick={() => setSelectedPlayerGameLog(null)} style={{
                background: "none",
                border: "none",
                color: THEME.gray,
                fontSize: 24,
                cursor: "pointer",
                padding: 0,
                width: 32,
                height: 32
              }}>✕</button>
            </div>

            {/* Season Overview */}
            <Card style={{ padding: 16, marginBottom: 16 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 Season Overview</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonTotals.games}</div>
                  <div style={{ color: THEME.gray, fontSize: 11 }}>GAMES</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonAvg.toFixed(3)}</div>
                  <div style={{ color: THEME.gray, fontSize: 11 }}>AVG</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: THEME.blue, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonTotals.hits}</div>
                  <div style={{ color: THEME.gray, fontSize: 11 }}>HITS</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: THEME.green, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonTotals.rbi}</div>
                  <div style={{ color: THEME.gray, fontSize: 11 }}>RBI</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: THEME.white, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonTotals.runs}</div>
                  <div style={{ color: THEME.gray, fontSize: 11 }}>RUNS</div>
                </div>
                {seasonTotals.innings > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: THEME.red, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{seasonTotals.innings.toFixed(1)}</div>
                    <div style={{ color: THEME.gray, fontSize: 11 }}>IP</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Positions Played */}
            {positionsList.length > 0 && (
              <Card style={{ padding: 16, marginBottom: 16 }}>
                <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>📍 Positions Played</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {positionsList.map((pos, idx) => (
                    <span key={idx} style={{
                      padding: "4px 12px",
                      background: THEME.charcoal,
                      borderRadius: 12,
                      color: THEME.white,
                      fontSize: 12,
                      fontWeight: 600
                    }}>{pos}</span>
                  ))}
                </div>
              </Card>
            )}

            {/* Game-by-Game Breakdown */}
            <Card style={{ padding: 16 }}>
              <h4 style={{ color: THEME.white, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Game-by-Game Performance</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {playerGames.sort((a, b) => (b.game.date || "").localeCompare(a.game.date || "")).map(g => (
                  <div key={g.game.id} style={{
                    padding: "12px",
                    background: THEME.blackLight,
                    borderRadius: 6,
                    border: `1px solid ${THEME.charcoal}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ color: THEME.white, fontSize: 13, fontWeight: 600 }}>
                          {g.game.date ? new Date(g.game.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} vs {g.game.opponent}
                        </div>
                        <div style={{ color: THEME.gray, fontSize: 11, marginTop: 2 }}>
                          #{g.battingOrder} {g.position}
                        </div>
                      </div>
                      <div style={{
                        color: g.game.result === "W" ? THEME.green : g.game.result === "L" ? THEME.red : THEME.gray,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {g.game.result} {g.game.ourScore}-{g.game.theirScore}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                      <div style={{ color: THEME.gray }}>
                        Batting: <span style={{ color: THEME.white }}>{g.hits}-{g.atBats}</span>
                        {g.atBats > 0 && <span style={{ color: THEME.gold, marginLeft: 4 }}>({g.avg.toFixed(3)})</span>}
                      </div>
                      {g.rbi > 0 && (
                        <div style={{ color: THEME.gray }}>
                          RBI: <span style={{ color: THEME.blue }}>{g.rbi}</span>
                        </div>
                      )}
                      {g.runs > 0 && (
                        <div style={{ color: THEME.gray }}>
                          R: <span style={{ color: THEME.green }}>{g.runs}</span>
                        </div>
                      )}
                      {g.pitching && (
                        <div style={{ color: THEME.gray }}>
                          Pitching: <span style={{ color: THEME.white }}>{g.pitching.innings.toFixed(1)} IP, {g.pitching.strikeouts} K</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      );
    })()}
  </div>;
};

// ─── MAIN ───────────────────────────────────────────────────────
const TABS = [
  { id: "roster", label: "Roster", icon: "👥" },
  { id: "practicelog", label: "Practice", icon: "📋" },
  { id: "lineup", label: "Lineup", icon: "📋" },
  { id: "gamelog", label: "Game", icon: "⚾" },
  { id: "reports", label: "Reports", icon: "📊" },
  { id: "comms", label: "Comms", icon: "✉️" },
];

function App() {
  const [tab, setTab] = useState("roster");
  const [players, setPlayers] = useState(SEED_PLAYERS);
  const [coaches, setCoaches] = useState(SEED_COACHES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEYS.PLAYERS);
        if (r?.value) {
          const p = JSON.parse(r.value);
          if (Array.isArray(p) && p.length > 0) setPlayers(p);
        }
      } catch {}
      try {
        const r = await window.storage.get(STORAGE_KEYS.COACHES);
        if (r?.value) {
          const c = JSON.parse(r.value);
          if (Array.isArray(c) && c.length > 0) setCoaches(c);
        }
      } catch {}
      // Seed practices if none exist
      try {
        const r = await window.storage.get("pirates-practices-unified-2026v1");
        if (!r?.value || JSON.parse(r.value).length === 0) {
          await window.storage.set("pirates-practices-unified-2026v1", JSON.stringify(SEED_PRACTICES));
        }
      } catch {}
      // Seed game logs if none exist
      try {
        const r = await window.storage.get(STORAGE_KEYS.GAMELOGS);
        if (!r?.value || JSON.parse(r.value).length === 0) {
          await window.storage.set(STORAGE_KEYS.GAMELOGS, JSON.stringify(SEED_GAMELOGS));
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) { try { window.storage.set(STORAGE_KEYS.PLAYERS, JSON.stringify(players)); } catch{} } }, [players, loaded]);
  useEffect(() => { if (loaded) { try { window.storage.set(STORAGE_KEYS.COACHES, JSON.stringify(coaches)); } catch{} } }, [coaches, loaded]);

  return <div style={{ minHeight: "100vh", background: THEME.black, color: THEME.white, fontFamily: "'Source Sans 3',sans-serif", padding: "0 0 40px 0" }}>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />
    <div style={{ background: `linear-gradient(135deg, ${THEME.black} 0%, ${THEME.blackLight} 100%)`, borderBottom: `3px solid ${THEME.gold}`, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: THEME.black, border: `3px solid ${THEME.gold}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 8, boxShadow: `0 0 20px ${THEME.gold}40` }}>
          <img src="assets/pirates-logo.svg" alt="Pittsburgh Pirates" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div><h1 style={{ margin: 0, fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: THEME.gold }}>Pirates Softball</h1><p style={{ margin: 0, color: THEME.gray, fontSize: 13 }}>2026 Season Dashboard</p></div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => { if (confirm("Load test practice and game data?")) { try { window.storage.set("pirates-practices-unified-2026v1", JSON.stringify(SEED_PRACTICES)); window.storage.set(STORAGE_KEYS.GAMELOGS, JSON.stringify(SEED_GAMELOGS)); alert("Test data loaded! Page will reload."); window.location.reload(); } catch{} } }} style={{ background: THEME.gold, border: "none", color: THEME.black, padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'Oswald',sans-serif", textTransform: "uppercase", fontWeight: 700 }}>Load Test Data</button>
          <button onClick={() => { if (confirm("Reset roster to original 13 players?")) { setPlayers(SEED_PLAYERS); try { window.storage.set(STORAGE_KEYS.PLAYERS, JSON.stringify(SEED_PLAYERS)); } catch{} } }} style={{ background: "none", border: `1px solid ${THEME.charcoal}`, color: THEME.gray, padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" }}>Reset Roster</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {[{ l: "Roster", v: players.length }, { l: "Returning", v: players.filter(p=>p.returning).length }, { l: "New", v: players.filter(p=>!p.returning).length }, { l: "Pitchers", v: players.filter(p=>p.isPitcher).length }].map(s => <div key={s.l} style={{ background: THEME.blackLight, padding: "10px 16px", borderRadius: 8, border: `1px solid ${THEME.charcoal}`, minWidth: 80 }}><div style={{ color: THEME.gold, fontSize: 24, fontWeight: 700, fontFamily: "'Oswald',sans-serif" }}>{s.v}</div><div style={{ color: THEME.gray, fontSize: 11, textTransform: "uppercase" }}>{s.l}</div></div>)}
      </div>
    </div>
    <div style={{ padding: "0 24px", marginTop: 16 }}>
      <Tabs tabs={TABS} active={tab} onSelect={setTab} />
      {tab==="roster" && <RosterPanel players={players} setPlayers={setPlayers} coaches={coaches} setCoaches={setCoaches} />}
      {tab==="practicelog" && <PracticeLog players={players} coaches={coaches} />}
      {tab==="lineup" && <LineupBuilder players={players} />}
      {tab==="reports" && <Reports players={players} />}
      {tab==="gamelog" && <GameLog players={players} />}
      {tab==="comms" && <Comms players={players} />}
    </div>
  </div>;
}
