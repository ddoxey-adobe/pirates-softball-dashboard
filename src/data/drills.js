/**
 * Drill Library — Complete drill catalog for the Pirates Softball Dashboard
 *
 * Extracted from App.jsx. Contains the full 69-drill library, trackable drill
 * metadata, and assessment templates used during tryout/evaluation practices.
 */

export const TRACKABLE_DRILLS = {
  b1: { type: "time", label: "Time (seconds)", perPlayer: true, description: "Record each player's home-to-first time" },
  p2: { type: "strikes-balls", label: "Strikes / Balls", perPlayer: true, description: "Track strikes vs balls for each pitcher" },
  p3: { type: "number", label: "Pitch Count", perPlayer: true, description: "Total pitches thrown" },
  f3: { type: "team-count", label: "Consecutive Outs", perPlayer: false, description: "Team's best consecutive outs before error" },
  h9: { type: "number", label: "Points", perPlayer: true, description: "Total points (GB=1, FB=2, LD=3)" },
  h10: { type: "number", label: "Points", perPlayer: true, description: "Bunt accuracy points" },
  h11: { type: "level", label: "Level Reached", perPlayer: true, description: "Highest level (1-6) achieved" },
};

export const DRILL_LIBRARY = [
  // ── Warm-Up ──
  { id: "w1", name: "Dynamic Warm-Up", category: "Warm-Up", duration: 10, coach: "Any", description: "Jog, arm circles, high knees, butt kicks, lunges, karaokes, leg swings. Get blood flowing and muscles loose before throwing. Every practice starts here." },
  { id: "w2", name: "Band Work (Shoulders)", category: "Warm-Up", duration: 5, coach: "Any", description: "Resistance band exercises for shoulder stability. Internal/external rotation, pull-aparts, overhead stretches. Experts recommend starting bands at age 11-12 to prevent arm injuries. Especially important for pitchers." },
  // ── Throwing ──
  { id: "t1", name: "One-Knee Throwing", category: "Throwing", duration: 10, coach: "Shari", description: "Players kneel on throwing-side knee, isolating the upper body. Focus on 4-seam grip, L-position arm path, and clean follow-through. Eliminates lower body to build proper arm mechanics. Recommended by GoRout and Covey Sports for youth." },
  { id: "t2", name: "Rock & Fire", category: "Throwing", duration: 10, coach: "Shari", description: "Players rock weight back and forth 3 times, then throw on the final forward shift. Teaches proper weight transfer during the throw. Top drill from Covey Sports for 10U-12U age groups." },
  { id: "t3", name: "Long Toss Progression", category: "Throwing", duration: 10, coach: "Any", description: "Partners start 20ft apart. After every 5 clean catches, both step back 3ft. If you drop it, you're out. Builds arm strength and accuracy under increasing distance with real stakes." },
  { id: "t4", name: "Relay & Cutoff", category: "Throwing", duration: 15, coach: "Ken", description: "Outfielders throw to cutoff, infielders relay to bases. First throw: through the cutoff. Second throw: 'do or die' to home \u2014 cutoff should not touch it. Practice all game scenarios. Critical for reducing extra bases." },
  // ── Fielding ──
  { id: "f1", name: "Ground Ball Fundamentals", category: "Fielding", duration: 15, coach: "Ken", description: "Ready position (athletic stance, glove out front), charge the ball, field out in front with two hands, funnel to chest, transfer, crow hop, throw. Roll grounders at varying speeds. The foundation of all infield defense." },
  { id: "f2", name: "Rapid Fire Grounders", category: "Fielding", duration: 15, coach: "Ken", description: "3 consecutive balls hit to the same fielder \u2014 first play at 3B, second at 2B, third at 1B. Repeat for each infielder. Teaches reads, footwork, and quick transitions under pressure. Recommended by GoRout for 12U+." },
  { id: "f3", name: "21 Outs Drill", category: "Fielding", duration: 20, coach: "All", description: "Full defense on the field, goal is 21 consecutive outs without an error. Coach hits/throws game-like balls. If anyone makes an error, restart at zero. Builds team accountability and focus. Top game-simulation drill from multiple expert sources." },
  { id: "f4", name: "Fly Ball Tracking Box", category: "Fielding", duration: 15, coach: "Any", description: "Set up 4 cones in a 20x10 yard box. Coach throws fly balls over players' heads. Players drop-step, sprint, and track with their head turned. Trains outfielders to read the ball off the bat and take proper routes. GoRout recommended." },
  { id: "f5", name: "Triangle Pop Fly", category: "Fielding", duration: 15, coach: "Any", description: "From 2025: Hit deep pop flies to groups of 3 outfielders arranged in a triangle. One calls it, one backs up, one communicates. Teaches the communication triangle your team used last year." },
  { id: "f6", name: "Bare Hand Pickups", category: "Fielding", duration: 10, coach: "Any", description: "From 2025: Coach rolls slow grounders and bunts. Players field bare-handed, transfer to throwing hand, and throw to first. Builds soft hands, quick reactions, and clean transfers." },
  { id: "f7", name: "Scoop Step Throw", category: "Fielding", duration: 15, coach: "Ken", description: "From 2025: Field the ball, transfer with proper footwork, step toward target, and throw \u2014 all as one fluid motion. Focuses on eliminating wasted movement between catch and throw." },
  { id: "f8", name: "Cone Fielding Triangle", category: "Fielding", duration: 15, coach: "Ken", description: "Use your cones to create triangle patterns. Coach rolls grounders to different angles \u2014 left, right, straight on. Players work on lateral movement, approach angles, and setting feet to throw. Uses your agility cone set." },
  { id: "f9", name: "Cone Weave Grounders", category: "Fielding", duration: 15, coach: "Ken", description: "Set up 6-8 cones in a zigzag pattern 5ft apart. Coach rolls grounders to each cone. Player fields at each cone while weaving through the pattern. Builds lateral agility and quick hands while moving. Uses your 12-cone set." },
  { id: "f10", name: "Lateral Shuffle Box", category: "Fielding", duration: 10, coach: "Any", description: "Set up 4 cones in a 10x10 ft box. Fielder starts at center, coach calls a cone. Shuffle laterally to cone, ready position, shuffle back to center. Repeat for all 4 directions. Teaches defensive positioning and quick lateral movement. Uses your agility cone set." },
  // ── Hitting ──
  { id: "h1", name: "Tee Work (Basics)", category: "Hitting", duration: 15, coach: "Any", description: "10 swings per round off the tee. Focus on balanced stance, grip, swing path, and contact point. Even pros use tees daily. The foundation of all hitting \u2014 don't rush past it. Use backstop net for collection." },
  { id: "h2", name: "Freeze Drill (Tee)", category: "Hitting", duration: 10, coach: "Any", description: "Player loads into hitting position and HOLDS for 2-3 seconds before swinging. Forces awareness of load position and weight distribution. Works especially well with kids who rush their swing. Recommended by GoRout and SkillShark." },
  { id: "h3", name: "Inside/Outside Tee", category: "Hitting", duration: 15, coach: "Any", description: "Move the tee to different pitch locations \u2014 inside, outside, high, low. Teaches players to adjust their swing path and hit the ball to all parts of the field. Every hitter needs this. GoRout recommended." },
  { id: "h4", name: "Soft Toss", category: "Hitting", duration: 10, coach: "Any", description: "Partner or coach kneels to the side and tosses balls into the strike zone. Hitter focuses on tracking the ball, timing, and making solid contact. Bridge between tee work and live pitching." },
  { id: "h5", name: "Front Toss", category: "Hitting", duration: 15, coach: "Any", description: "Coach kneels 15-20ft in front behind an L-screen and flips balls to the hitter. Builds timing with a moving ball and trains barrel awareness. The key progression step before machine or live pitching." },
  { id: "h6", name: "Live Machine BP", category: "Hitting", duration: 20, coach: "Any", description: "Live at-bats against the Jugs pitching machine. Vary speeds. 8-10 swings per player. Use backstop net. The closest thing to facing a real pitcher. Rotate players through quickly to maximize reps." },
  { id: "h7", name: "Power Hitting (Speed Changes)", category: "Hitting", duration: 15, coach: "Any", description: "From 2025: Alternate slow and fast pitches from the Jugs machine. Teaches timing adjustment and weight transfer. Players must read the speed and adjust \u2014 just like a real at-bat." },
  { id: "h8", name: "Drop Ball Drill", category: "Hitting", duration: 10, coach: "Any", description: "Coach holds ball above batter's head height and drops it into the strike zone. Batter must hit it before it hits the ground. Trains quick hands, staying inside the ball, and driving line contact. Fun and competitive." },
  { id: "h9", name: "Points-Based Hitting", category: "Hitting", duration: 15, coach: "Any", description: "Draft teams. Ground ball = 1 point, fly ball = 2 points, line drive = 3 points. Each player gets 5 swings, highest score wins. Pushes quality contact \u2014 line drives are the goal. Great competitive energy. GoRout recommended." },
  { id: "h10", name: "Bunt Stations", category: "Hitting", duration: 10, coach: "Any", description: "Sacrifice bunt and drag bunt technique. Square early, angle the bat, deaden the ball. Use point values for where the ball stops (bases 1&3 = 2 points, base 2 = 1 point) to make it competitive. Bunting wins rec league games." },
  { id: "h11", name: "Batting Queen", category: "Hitting", duration: 15, coach: "Any", description: "From 2025: Progressive 6-level hitting competition. 1-Make Contact, 2-Has to be Fair, 3-Past the Pitcher, 4-Past Pitcher in the Air, 5-Only Touch Grass (not dirt), 6-Furthest Hit. Girls love this \u2014 great energy and competition." },
  // ── Baserunning ──
  { id: "b1", name: "Home to First Sprint", category: "Baserunning", duration: 10, coach: "Any", description: "Timed sprints from batter's box to first base. Emphasize running THROUGH the bag (not slowing down), hitting the front edge of the base, and turning right toward foul territory. Time each girl and track improvement." },
  { id: "b2", name: "Rounding Bases", category: "Baserunning", duration: 10, coach: "Any", description: "Practice the banana curve when rounding bases \u2014 arc out slightly before the base, hit the inside corner, and accelerate toward the next base. Use cones to mark the ideal path." },
  { id: "b3", name: "Read & React", category: "Baserunning", duration: 15, coach: "Ken", description: "Runner on base, coach hits ball. Runner must read whether to go, stay, or advance based on where the ball goes. Builds game IQ and base running instincts. Teaches when to be aggressive vs. when to hold." },
  { id: "b4", name: "Sliding Practice", category: "Baserunning", duration: 10, coach: "Any", description: "Bent-leg slide technique on grass. Start from walking, progress to jogging, then running. Emphasize tucking one leg under, keeping hands up, and hitting the base with the top foot. Safety first \u2014 always on soft ground." },
  { id: "b5", name: "Baserunning Race", category: "Baserunning", duration: 10, coach: "Any", description: "From 2025: Race to 2nd base and race home. Two runners go at once, competitive format. Proper technique required \u2014 touch inside of bases, use banana turns. Girls get fired up for this one." },
  { id: "b6", name: "Four Corners Box Drill", category: "Baserunning", duration: 10, coach: "Any", description: "Set up 4 cones in a box 15x15 ft. Sprint to each cone, touch it, sprint to next. Focus on quick direction changes and acceleration. Builds explosive first-step speed for stealing bases and beating throws. Use your agility cone set." },
  { id: "b7", name: "Star Drill", category: "Baserunning", duration: 12, coach: "Any", description: "Set up 5 cones in a star pattern (1 center, 4 corners). Start at center, sprint to corner cone, backpedal to center, sprint to next corner. Teaches multi-direction movement and quick recovery. Great for baserunning instincts. Use your agility cone set." },
  // ── Pitching ──
  { id: "p1", name: "Pitching Mechanics", category: "Pitching", duration: 20, coach: "Shari", description: "Windmill mechanics breakdown: K position (arm at 90 degrees), full arm circle, stride toward target, wrist snap at hip, follow through. Shari works with Rose, Kaizley, and Jayden on this progression." },
  { id: "p2", name: "Pitch Location Work", category: "Pitching", duration: 15, coach: "Shari", description: "Throwing to specific spots \u2014 inside, outside, high, low. Use targets or a strike zone mat. Track strikes vs balls for each pitcher. Builds control and confidence on the mound." },
  { id: "p3", name: "Pitch Count Simulated Innings", category: "Pitching", duration: 15, coach: "Shari", description: "Pitcher throws a simulated inning \u2014 3 batters, full count sequences. Catcher works on framing. Builds game-like rhythm and stamina without needing live hitters. Track pitch count." },
  // ── Game Situations ──
  { id: "g1", name: "Situation Ball", category: "Game Play", duration: 20, coach: "All", description: "Coach calls out a situation (runners on 1st and 3rd, 1 out, ground ball to short). Hit the ball, everyone executes. Best drill for game IQ \u2014 teaches every player where to go and what to do. Full team, full field." },
  { id: "g2", name: "First & Third Defense", category: "Game Play", duration: 15, coach: "Ken", description: "Runners on 1st and 3rd \u2014 practice defensive reads for different steal scenarios. What does the catcher do? Where does the SS go? When do you throw through vs. hold? Critical game situation for this age group." },
  { id: "g3", name: "Bunt Defense", category: "Game Play", duration: 15, coach: "Ken", description: "Runner on 3rd, batter squares to bunt. Practice the squeeze play offense AND the defensive reaction. Who charges? Who covers? What if the bunt is popped up? Game situation that decides close games." },
  { id: "g4", name: "Live Scrimmage Innings", category: "Game Play", duration: 25, coach: "All", description: "Actual at-bats with full defense on the field. The most realistic practice possible. Keep score, make it competitive. Rotate pitchers. Best used late in practice when energy is high and fundamentals have been drilled." },
  // ── Conditioning ──
  { id: "c1", name: "Agility Ladder", category: "Conditioning", duration: 10, coach: "Any", description: "Quick feet through the ladder: two-in each box, in-out, lateral shuffle, Icky shuffle, single-leg hops. Builds footwork, coordination, and quickness. Uses your agility ladder set. Make it a race." },
  { id: "c2", name: "Cone & Hurdle Course", category: "Conditioning", duration: 10, coach: "Any", description: "Sprint, shuffle, backpedal between cones. Add mini hurdles for explosion and hip flexibility. Uses your agility training set (cones + mini hurdles). Great warm-up or end-of-practice conditioner." },
  { id: "c3", name: "Jump Rope Intervals", category: "Conditioning", duration: 10, coach: "Any", description: "30 seconds jumping, 10 seconds rest, repeat 8 rounds. Mix it up: basic bounce, alternating feet, high knees, double-unders. Builds cardio, foot coordination, and rhythm. Great warm-up or conditioning finisher. Uses your jump rope from agility set." },
  { id: "c4", name: "Hurdle Hops", category: "Conditioning", duration: 10, coach: "Any", description: "Set up 4 hurdles 2-3ft apart. Two-foot hop over each hurdle, focusing on explosive power and soft landings. Progress to lateral hops and single-leg hops. Builds leg power for batting, throwing, and running. Uses your adjustable hurdles (start low!)." },
  { id: "c5", name: "Ladder-Hurdle Combo", category: "Conditioning", duration: 12, coach: "Any", description: "Set up ladder, then 4 hurdles right after. Quick feet through the ladder, then explosive hops over hurdles. Combines speed footwork with power. Advanced conditioning drill \u2014 make it a race. Uses your 20ft ladder + adjustable hurdles." },
  // ── Mental ──
  { id: "m1", name: "Team Mental Huddle", category: "Mental", duration: 5, coach: "Head Coach", description: "5-minute talk on ONE mental skill. Topics: positive self-talk, shaking off errors, cheering for teammates, what to focus on during at-bats, being a good teammate, handling pressure. Pick one per practice \u2014 don't overload." },

  // ── EXPANDED DRILLS (Added 2026-04-09) ──
  { id: "w3", name: "Jog-and-Toss Progression", category: "Warm-Up", duration: 10, coach: "Any", description: "Players jog in pairs around the outfield warning track while tossing a softball back and forth underhand. After one lap, they transition to light overhand flips at close range. The focus is on loosening the arm and building rhythm before full throwing. Coaches should ensure players stay relaxed and do not overthrow during this phase.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "w4", name: "Agility Ladder Footwork", category: "Warm-Up", duration: 8, coach: "Any", description: "Set up two agility ladders (or use cones at 18-inch intervals) along the first-base line. Players cycle through patterns: two feet in each box, ickey shuffle, lateral in-and-out, and single-leg hops. Keep lines short so rest is minimal. This builds the fast-twitch footwork that translates directly to fielding first-step quickness.", equipment: "Agility ladder or cones", minPlayers: 1, ages: "All" },
  { id: "w5", name: "Four Corners Relay", category: "Warm-Up", duration: 10, coach: "Any", description: "Place four cones in a square about 40 feet apart. Split into two teams. On the whistle, the first player from each team sprints to cone one, shuffles laterally to cone two, backpedals to cone three, and sprints home to tag the next player. This competitive warm-up gets heart rates up quickly while reinforcing multi-directional movement. Keep score to add energy.", equipment: "Cones", minPlayers: 4, ages: "All" },
  { id: "w6", name: "Arm Care Routine", category: "Warm-Up", duration: 10, coach: "Any", description: "Players grab a light resistance band and work through a structured arm care program: 15 reps of external rotation at 90 degrees, 15 reps of internal rotation, 15 band pull-aparts, and 15 overhead tricep stretches per arm. Follow with wrist rolls and forearm stretches. This protects growing arms and should become a non-negotiable pregame habit for every player on the roster.", equipment: "Resistance bands", minPlayers: 1, ages: "All" },
  { id: "w7", name: "Mirror Drill", category: "Warm-Up", duration: 8, coach: "Any", description: "Players pair up and face each other about five feet apart. One player is the leader and moves in any direction\u2014shuffles, drops, jumps, spins\u2014while the partner mirrors every movement. Switch leaders every 30 seconds. This sharpens reaction time and keeps players mentally engaged during warm-up instead of going through the motions.", equipment: "None", minPlayers: 2, ages: "All" },
  { id: "w8", name: "Progressive Throwing Warm-Up", category: "Warm-Up", duration: 12, coach: "Any", description: "Partners start on one knee at 20 feet and throw 10 balls focusing on wrist snap and follow-through. They then stand at 30 feet for 10 throws emphasizing full arm extension. Move to 45 feet for 10 throws at game-like effort, then 60 feet for 10 throws with an arc if needed. Finish with five throws from the longest comfortable distance. This graduated approach protects arms while building to full velocity.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t5", name: "Target Throwing Challenge", category: "Throwing", duration: 12, coach: "Any", description: "Tape a strike-zone-sized square on a fence or backstop using athletic tape, or hang a tire at chest height. Players throw from 40 feet, earning three points for the center, two for the square, and one for hitting the fence anywhere. Each player gets 10 throws per round. Track scores across practices to measure accuracy improvement. This adds accountability and purpose to every throw.", equipment: "Softballs, gloves, tape or tire", minPlayers: 1, ages: "All" },
  { id: "t6", name: "Crow Hop and Throw", category: "Throwing", duration: 10, coach: "Any", description: "Players line up in the outfield and practice the crow hop: a small hop onto the throwing-side foot to generate momentum toward the target before releasing the throw. Start with dry reps (no ball), then add a ball and throw to a partner 60 feet away. Emphasize that the hop is small and directional\u2014not a big jump. This is how outfielders get power behind long throws to the infield.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t7", name: "Cutoff and Relay Throwing", category: "Throwing", duration: 15, coach: "Any", description: "Set up an outfielder, a cutoff player at the edge of the infield dirt, and a receiver at home plate. The outfielder fields a rolled ball, throws to the cutoff, who catches, pivots, and throws home. Rotate positions every five reps. Coaches should stress that the cutoff must line up directly between the outfielder and the target, turn glove-side, and make a quick accurate throw. This is one of the most undertrained plays in youth softball.", equipment: "Softballs, gloves, cones", minPlayers: 3, ages: "12U-14U" },
  { id: "p4", name: "Pitch Location Targets", category: "Pitching", duration: 15, coach: "Pitching Coach", description: "Set up a strike zone target frame behind the plate or tape four quadrants on a backstop net. The pitcher throws to each quadrant in sequence: up-and-in, up-and-away, down-and-in, down-and-away. She gets five pitches per quadrant and earns a point for each one that hits the target zone. Track scores across practices. Accuracy separates pitchers who throw hard from pitchers who dominate\u2014this is how you build it.", equipment: "Softballs, glove, catcher or target frame", minPlayers: 1, ages: "12U-14U" },
  { id: "p5", name: "Change-Up Development", category: "Pitching", duration: 12, coach: "Pitching Coach", description: "Teach the circle-change grip: form a circle with the thumb and index finger on the side of the ball, with the remaining three fingers across the seams. The arm speed must stay the same as the fastball\u2014the grip change creates the speed difference. Start at 20 feet and throw 10, then move to full distance. Alternate fastball-changeup-fastball to feel the speed difference. Remind pitchers that a good changeup does not need to be slow\u2014it just needs to be slower than the fastball.", equipment: "Softballs, glove, catcher", minPlayers: 2, ages: "12U-14U" },
  { id: "p6", name: "Pitch Count Simulated Inning", category: "Pitching", duration: 15, coach: "Pitching Coach", description: "The pitcher throws a simulated inning to a catcher with the coach calling balls and strikes. She must pitch to imaginary batters and work through counts. If she walks a batter, a runner is placed on base and she must pitch from the stretch. Goal: get through three batters on fewer than 15 pitches. This builds mental stamina and helps the pitcher learn to compete inside the strike zone under realistic pressure.", equipment: "Softballs, glove, catcher, helmet", minPlayers: 2, ages: "12U-14U" },
  { id: "p7", name: "Fielding the Position", category: "Pitching", duration: 10, coach: "Pitching Coach", description: "After delivering the pitch, the pitcher must be ready to field. In this drill, the pitcher delivers to a catcher, and a coach immediately hits or rolls a ball back at her. She must field it cleanly and throw to first base. Mix in bunts, comebackers, and slow rollers. Add a first baseman to receive throws. Do 10 reps. Too many young pitchers finish their motion and stand flat-footed\u2014this drill breaks that habit.", equipment: "Softballs, glove, bat, bases", minPlayers: 3, ages: "12U-14U" },
  { id: "g5", name: "Two-Out Rally", category: "Game Play", duration: 15, coach: "Head Coach", description: "Set up a scrimmage scenario: the batting team always starts with two outs. The inning continues until the third out is recorded. This forces hitters to learn how to deliver clutch at-bats with two outs and rewards the team that fights through instead of giving up on an inning. Keep score. The two-out mentality separates championship teams from everyone else.", equipment: "Full equipment, bases", minPlayers: 10, ages: "12U-14U" },
  { id: "g6", name: "Live Scrimmage with Coaching Stops", category: "Game Play", duration: 25, coach: "Head Coach", description: "Play a full scrimmage but the head coach can stop play at any time to teach. If a player throws to the wrong base, freeze the play, ask the team where the ball should have gone, and replay the situation. Limit stops to four or five per scrimmage to keep it flowing. This is live game experience with built-in teachable moments\u2014the most realistic practice environment you can create.", equipment: "Full equipment, bases", minPlayers: 12, ages: "12U-14U" },
  { id: "g7", name: "Pressure Inning", category: "Game Play", duration: 15, coach: "Head Coach", description: "Set the score at a one-run deficit in the bottom of the last inning. The batting team must score to tie or win. The defense must get three outs to hold the lead. Both sides play with full intensity and real consequences (losing team does a sprint or the winning team picks the next drill). This simulates end-of-game pressure that cannot be replicated any other way. Rotate sides so every player feels both perspectives.", equipment: "Full equipment, bases", minPlayers: 12, ages: "12U-14U" },
  { id: "c6", name: "Relay Race Challenge", category: "Conditioning", duration: 10, coach: "Any", description: "Split the team into two or three groups. Set up a course: sprint 60 feet, touch a cone, backpedal 30 feet, shuffle left 20 feet, shuffle right 20 feet, then sprint home and tag the next teammate. The first team to finish wins. Losing teams do five push-ups. This adds competition and energy to conditioning so it does not feel like punishment. Vary the course each practice to keep it fresh.", equipment: "Cones", minPlayers: 4, ages: "All" },
  { id: "m2", name: "Positive Self-Talk Reset", category: "Mental", duration: 8, coach: "Head Coach", description: "Gather the team in a circle. Each player shares one negative thought they have during games (I always strike out, I cannot throw to first). The team then helps reframe it into a positive statement (I battle every at-bat, I make strong throws). Each player writes her positive statement on athletic tape and sticks it inside her glove or on her bat. Revisit these statements each week. Changing internal dialogue changes performance.", equipment: "Athletic tape, markers", minPlayers: 4, ages: "All" },
  { id: "m3", name: "Error Recovery Drill", category: "Mental", duration: 12, coach: "Head Coach", description: "A fielder deliberately receives a bad-hop ground ball that gets past her (coach throws it intentionally). She must immediately perform a reset routine: take a breath, slap her glove, say a positive cue word, and get ready for the next ball. The coach immediately hits another ball. The goal is to train the response to failure\u2014not to dwell on it but to physically reset and compete on the very next play. This is one of the most important mental skills in softball.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "m4", name: "Blindfold Trust Fielding", category: "Mental", duration: 10, coach: "Any", description: "One player wears a blindfold (or closes her eyes) and stands in the infield. Her partner stands behind her and gives verbal directions: step left, step right, reach down now. The coach rolls a ball toward the blindfolded player, and she must field it using only her partner's instructions. Switch roles after three balls. This builds communication skills and trust between teammates. It also shows players how precise verbal cues need to be.", equipment: "Softballs, gloves, blindfold or bandana", minPlayers: 3, ages: "All" },
  { id: "m5", name: "Team Goal Setting Circle", category: "Mental", duration: 10, coach: "Head Coach", description: "The team sits in a circle. The coach asks each player to state one individual goal for the week and one thing she wants the team to improve. The coach writes all responses on a whiteboard or clipboard. At the next practice, the coach revisits the list and asks who made progress. This creates accountability, gives every player a voice, and shows the team that improvement is a daily choice, not something that happens by accident.", equipment: "Whiteboard or clipboard, markers", minPlayers: 4, ages: "All" },
  { id: "m6", name: "Two-Minute Dugout Challenge", category: "Mental", duration: 8, coach: "Head Coach", description: "During a scrimmage or situational drill, the coach gives the team a defensive challenge: get out of the inning in two minutes or less of game time. If they succeed, they earn a reward (water break, skip conditioning, choose a drill). If they fail, the clock resets and they try again. This teaches urgency, energy, and the concept of competing as a unit. It also shows players that their collective effort directly controls outcomes.", equipment: "Stopwatch", minPlayers: 9, ages: "12U-14U" },
];

export const ASSESSMENT_TEMPLATES = [
  {
    id: "tmpl-assess1",
    name: "Assessment Practice 1: Hitting + Fielding Focus",
    duration: 135,
    category: "Assessment",
    phases: [
      {
        name: "Welcome + Dynamic Warm-Up",
        duration: 15,
        drills: ["w1", "w2"],
        notes: "ASSESS: Who arrives early and ready? Note attitude, energy, and body language. Does the player stretch with intent or go through the motions? Attitude baseline is set here."
      },
      {
        name: "Throwing Evaluation",
        duration: 15,
        drills: ["w8", "t1"],
        notes: "ASSESS: Arm strength, accuracy, and mechanics. Watch for elbow position, follow-through, and whether the player can consistently hit a target at 40+ feet. Note who has a live arm and who needs mechanical work."
      },
      {
        name: "Infield Fielding Station",
        duration: 20,
        drills: ["f1", "f2"],
        notes: "ASSESS: Glove work, footwork, body positioning, and first-step quickness. Hit 5 ground balls to each player\u20142 right at them, 2 to the backhand, 1 to the forehand. Rate on a 1-5 scale: hands, feet, range, throwing accuracy. Note natural position fits."
      },
      {
        name: "Outfield Fielding Station",
        duration: 15,
        drills: ["f3"],
        notes: "ASSESS: Fly ball tracking, drop-step ability, communication, and arm strength on throws back to the infield. Hit 5 fly balls per player\u2014mix in line drives, high pop-ups, and balls in the gap. Who calls the ball? Who takes good angles?"
      },
      {
        name: "Water Break + Team Introduction",
        duration: 5,
        drills: [],
        notes: "ASSESS: Social dynamics. Who leads the group to the water? Who talks to teammates they do not know? Who stays isolated? Note early chemistry and leadership potential."
      },
      {
        name: "Hitting Station: Tee Work",
        duration: 20,
        drills: ["h1"],
        notes: "ASSESS: Stance, load, swing path, bat speed, and contact quality. Each player takes 15 swings on the tee\u20145 inside, 5 middle, 5 outside. Rate on a 1-5 scale: mechanics, bat speed, contact consistency, power. Note who makes adjustments between swings."
      },
      {
        name: "Hitting Station: Live Front Toss",
        duration: 20,
        drills: ["h3"],
        notes: "ASSESS: Timing, pitch tracking, and ability to handle a moving ball after tee work. Each player gets 15 pitches. Track swings-and-misses, foul balls, and hard-hit balls. Note who has a short quick swing versus a long slow one. Can the player adjust to inside vs. outside pitches?"
      },
      {
        name: "Baserunning Evaluation",
        duration: 15,
        drills: ["b1", "b2"],
        notes: "ASSESS: Raw speed (time home-to-first), running form, base-touching technique, and aggressiveness on the turn at first. Record times for every player. Note who runs hard through the base vs. who decelerates early."
      },
      {
        name: "Cool Down + Wrap-Up",
        duration: 10,
        drills: ["w2"],
        notes: "ASSESS: Who asks questions? Who thanks the coaches? Who helps pick up equipment without being asked? Final attitude and coachability check. Record all scores and observations before players leave."
      }
    ]
  },
  {
    id: "tmpl-assess2",
    name: "Assessment Practice 2: Pitching + Game Situations Focus",
    duration: 135,
    category: "Assessment",
    phases: [
      {
        name: "Dynamic Warm-Up + Arm Care",
        duration: 15,
        drills: ["w1", "w6"],
        notes: "ASSESS: Compare energy and effort to Assessment 1. Did players improve their warm-up habits? Who remembered the arm care routine without being reminded? Note improvement in attitude and preparation."
      },
      {
        name: "Throwing Assessment: Long Toss",
        duration: 12,
        drills: ["t2"],
        notes: "ASSESS: Maximum throwing distance with good mechanics. Mark each player's max distance. Compare to Assessment 1 data. Watch for who maintains mechanics at distance versus who falls apart. Note arm strength tiers for position placement."
      },
      {
        name: "Pitching Evaluation",
        duration: 20,
        drills: ["p3", "p4"],
        notes: "ASSESS: For pitchers\u2014velocity, accuracy, mechanics, and composure. Each pitcher throws 20 pitches to the catcher while coaches chart location. For non-pitchers, evaluate catching ability and willingness to receive. Rate pitchers on a 1-5 scale: velocity, command, mechanics, poise."
      },
      {
        name: "Catching Evaluation",
        duration: 15,
        drills: ["f4", "f7"],
        notes: "ASSESS: Blocking ability, receiving, framing, throws to second base (pop time), and tag play technique. Each catcher candidate receives 10 pitches (mix locations), blocks 5 balls in the dirt, and makes 5 throws to second. Record pop times. Note who wants to catch versus who avoids it."
      },
      {
        name: "Water Break",
        duration: 5,
        drills: [],
        notes: "ASSESS: Is the player more or less comfortable with teammates compared to Assessment 1? Note developing friendships and any players still isolated. Assign these players a buddy drill partner for the next phase."
      },
      {
        name: "Situational Defense",
        duration: 20,
        drills: ["g1", "g4"],
        notes: "ASSESS: Game IQ and instincts. Run 10 different situations and watch where each player throws the ball. Who knows where the play is before the ball is hit? Who hesitates? Who communicates? Rate each player on a 1-5 scale for softball IQ. This is often the most revealing phase of the assessment."
      },
      {
        name: "Live At-Bats vs. Pitching",
        duration: 20,
        drills: ["h4"],
        notes: "ASSESS: How each hitter performs against live pitching with a two-strike count. Track contact rate, quality of contact, plate discipline, and composure under pressure. Note who rises to the challenge and who shrinks. This is the closest simulation to a real game at-bat."
      },
      {
        name: "Conditioning Baseline Test",
        duration: 10,
        drills: ["c1", "c3"],
        notes: "ASSESS: Fitness level, effort, and competitiveness. Time base-path sprints and suicide sprints for every player. These become baseline numbers to measure improvement over the season. Note who pushes through fatigue and who quits when it gets hard."
      },
      {
        name: "Team Meeting + Goal Setting",
        duration: 18,
        drills: ["m5"],
        notes: "ASSESS: Communication skills and coachability. Share initial observations with the team (positive only at this stage). Ask each player to set one goal for the season. Collect all assessment data and begin roster/position discussions among coaching staff."
      }
    ]
  }
];

// Helper to find a drill by ID
export const D = (id) => DRILL_LIBRARY.find(d => d.id === id);

// Practice templates for the Practice module
export const PRACTICE_TEMPLATES = [
  // EARLY SEASON (Weeks 1-4)
  { id: "early1", name: "Early Season \u2014 Fundamentals & Team Building", duration: 120, focus: "Fundamentals",
    description: "First 2-3 weeks. Build culture, assess players, teach basics.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: 'What does being a Pirate mean? We support each other.'" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("t1"), assignedCoach: "Throwing", station: "A" },
        { ...D("f1"), assignedCoach: "Infield", station: "B" },
        { ...D("h1"), assignedCoach: "Hitting", station: "C" },
      ]},
      { name: "Full Team \u2014 Baserunning", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any" },
        { ...D("b2"), assignedCoach: "Any" },
      ]},
      { name: "Competition", type: "together", time: "20 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 great energy builder for the first week" },
      ]},
      { name: "Cool Down", type: "together", time: "10 min", drills: [
        { ...D("c1"), assignedCoach: "Any" },
      ]},
    ]},
  { id: "early2", name: "Early Season \u2014 Throwing & Hitting Basics", duration: 120, focus: "Mechanics",
    description: "Week 2-3. Focus on proper throwing mechanics and hitting foundation.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Throwing Fundamentals", type: "together", time: "20 min", drills: [
        { ...D("t1"), assignedCoach: "Throwing", notes: "One-knee throwing \u2014 isolate arm mechanics" },
        { ...D("t2"), assignedCoach: "Throwing", notes: "Rock & Fire \u2014 weight transfer" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("h1"), assignedCoach: "Hitting", station: "A", notes: "Tee work \u2014 check stance, grip, swing path" },
        { ...D("h2"), assignedCoach: "Hitting", station: "B", notes: "Freeze drill \u2014 slow down rushed swings" },
        { ...D("f6"), assignedCoach: "Infield", station: "C", notes: "Bare hand pickups \u2014 soft hands" },
      ]},
      { name: "Baserunning Basics", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any", notes: "Time each player \u2014 track improvement" },
        { ...D("b4"), assignedCoach: "Any", notes: "Sliding on grass \u2014 safety first" },
      ]},
      { name: "Fun Finish", type: "together", time: "15 min", drills: [
        { ...D("b5"), assignedCoach: "Any", notes: "Baserunning race \u2014 competitive energy" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Positive self-talk \u2014 we all make mistakes" },
      ]},
    ]},
  { id: "early3", name: "Early Season \u2014 Defense & Confidence Building", duration: 120, focus: "Defense",
    description: "Week 3-4. Ground balls, fly balls, and building defensive confidence.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("f1"), assignedCoach: "Infield", station: "A", notes: "Ground ball fundamentals \u2014 charge, field, throw" },
        { ...D("f4"), assignedCoach: "Outfield", station: "B", notes: "Fly ball tracking \u2014 drop step, read the ball" },
        { ...D("f10"), assignedCoach: "Defense", station: "C", notes: "Lateral shuffle box \u2014 defensive positioning" },
      ]},
      { name: "Full Team Throwing", type: "together", time: "15 min", drills: [
        { ...D("t3"), assignedCoach: "Any", notes: "Long toss \u2014 distance challenge" },
      ]},
      { name: "Hitting Competition", type: "together", time: "25 min", drills: [
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball \u2014 quick hands drill" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based hitting \u2014 quality contact" },
      ]},
      { name: "Conditioning", type: "together", time: "10 min", drills: [
        { ...D("c2"), assignedCoach: "Any", notes: "Cone & hurdle course \u2014 footwork" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Cheering for teammates \u2014 we win together" },
      ]},
    ]},
  { id: "early4", name: "Early Season \u2014 All-Around Assessment", duration: 120, focus: "Assessment",
    description: "Week 3-4. Assess each player across all skills to identify strengths.",
    phases: [
      { name: "Warm-Up & Throwing", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("t2"), assignedCoach: "Throwing", notes: "Rock & Fire \u2014 assess arm strength" },
      ]},
      { name: "Station Rotations", type: "stations", time: "50 min (3 groups \u00d7 15 min each + 5 min buffer)", drills: [
        { ...D("f1"), assignedCoach: "Infield", station: "A", notes: "Assess fielding \u2014 speed, hands, accuracy" },
        { ...D("h3"), assignedCoach: "Hitting", station: "B", notes: "Inside/outside tee \u2014 assess swing path" },
        { ...D("f8"), assignedCoach: "Infield", station: "C", notes: "Cone triangle \u2014 assess footwork & angles" },
      ]},
      { name: "Baserunning Assessment", type: "together", time: "15 min", drills: [
        { ...D("b1"), assignedCoach: "Any", notes: "Time every player \u2014 record for tracking" },
        { ...D("b6"), assignedCoach: "Any", notes: "Four corners box \u2014 assess explosive first-step" },
        { ...D("b2"), assignedCoach: "Any", notes: "Assess rounding technique" },
      ]},
      { name: "Hitting Competition", type: "together", time: "25 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 see who thrives under pressure" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Every player brings something unique to this team" },
      ]},
    ]},

  // MID SEASON (Weeks 5-8)
  { id: "mid1", name: "Mid Season \u2014 Game Situations & Refining", duration: 120, focus: "Game IQ",
    description: "Fundamentals are solid. Focus on game IQ and competitive reps.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any", notes: "Shoulder bands for pitchers especially" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Machine BP \u2014 vary speeds" },
        { ...D("f9"), assignedCoach: "Infield", station: "B", notes: "Cone weave grounders \u2014 lateral movement while fielding" },
        { ...D("p1"), assignedCoach: "Pitching", station: "C", notes: "Rose, Kaizley, Jayden + catchers" },
      ]},
      { name: "Full Team \u2014 Game Situations", type: "together", time: "35 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Call different scenarios each round" },
        { ...D("g2"), assignedCoach: "Infield" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: What did we learn from last game?" },
      ]},
    ]},
  { id: "mid2", name: "Mid Season \u2014 Advanced Defense & Relays", duration: 120, focus: "Defense",
    description: "Week 5-7. Outfield relays, cutoffs, and rapid-fire infield work.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Outfield Work", type: "together", time: "20 min", drills: [
        { ...D("f10"), assignedCoach: "Any", notes: "Lateral shuffle box \u2014 defensive positioning" },
        { ...D("f4"), assignedCoach: "Any", notes: "Fly ball tracking \u2014 read off the bat" },
        { ...D("t4"), assignedCoach: "Throwing", notes: "Relay & cutoff \u2014 through vs. do-or-die" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("f2"), assignedCoach: "Infield", station: "A", notes: "Rapid fire \u2014 3B, 2B, 1B in sequence" },
        { ...D("h6"), assignedCoach: "Hitting", station: "B", notes: "Live machine BP \u2014 game speeds" },
        { ...D("f5"), assignedCoach: "Outfield", station: "C", notes: "Triangle pop fly \u2014 communication" },
      ]},
      { name: "Game Situations", type: "together", time: "20 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Focus on outfield scenarios \u2014 gaps, over heads" },
      ]},
      { name: "Competition", type: "together", time: "10 min", drills: [
        { ...D("h8"), assignedCoach: "Any" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Trusting your teammates \u2014 make the play" },
      ]},
    ]},
  { id: "mid3", name: "Mid Season \u2014 Hitting Power & Speed Adjustment", duration: 120, focus: "Hitting",
    description: "Week 6-8. Refine swing mechanics, adjust to pitch speeds, drive the ball.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "50 min (3 groups \u00d7 15 min each + 5 buffer)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Machine BP \u2014 challenge speeds" },
        { ...D("h7"), assignedCoach: "Hitting", station: "B", notes: "Speed changes \u2014 adjust timing" },
        { ...D("h3"), assignedCoach: "Hitting", station: "C", notes: "Inside/outside tee \u2014 hit to all fields" },
      ]},
      { name: "Bunting Practice", type: "together", time: "15 min", drills: [
        { ...D("h10"), assignedCoach: "Any", notes: "Sacrifice & drag bunts \u2014 game situations" },
      ]},
      { name: "Hitting Competition", type: "together", time: "30 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 full 6 levels" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based \u2014 line drives win" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Quality at-bats \u2014 make the pitcher work" },
      ]},
    ]},
  { id: "mid4", name: "Mid Season \u2014 Pressure Situations & 21 Outs", duration: 120, focus: "Pressure",
    description: "Week 6-8. Build focus under pressure. Team accountability.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "40 min", drills: [
        { ...D("h5"), assignedCoach: "Hitting", station: "A", notes: "Front toss \u2014 timing under pressure" },
        { ...D("f7"), assignedCoach: "Infield", station: "B", notes: "Scoop step throw \u2014 eliminate wasted movement" },
        { ...D("p2"), assignedCoach: "Pitching", station: "C", notes: "Pitch location \u2014 hit your spots" },
      ]},
      { name: "Full Team \u2014 21 Outs", type: "together", time: "30 min", drills: [
        { ...D("f3"), assignedCoach: "All Coaches", notes: "Goal: 21 consecutive outs. Reset on error. Team accountability." },
      ]},
      { name: "Game Situations", type: "together", time: "20 min", drills: [
        { ...D("g3"), assignedCoach: "Infield", notes: "Bunt defense \u2014 squeeze play" },
        { ...D("g2"), assignedCoach: "Infield", notes: "First & third \u2014 steal scenarios" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Handling pressure \u2014 breathe, trust your training" },
      ]},
    ]},

  // END SEASON / TOURNAMENT PREP (Last 3 weeks)
  { id: "late1", name: "End Season \u2014 Tournament Prep & Live Scrimmage", duration: 120, focus: "Game Ready",
    description: "Last 3 weeks. Simulate real games. Keep it fun and competitive.",
    phases: [
      { name: "Warm-Up", type: "together", time: "15 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("w2"), assignedCoach: "Any", notes: "Pitchers especially" },
        { ...D("c5"), assignedCoach: "Any", notes: "Ladder-hurdle combo \u2014 dynamic warm-up" },
      ]},
      { name: "Pre-Game Hitting", type: "together", time: "25 min", drills: [
        { ...D("h4"), assignedCoach: "Any", notes: "Soft toss \u2014 feel-good swings" },
        { ...D("h6"), assignedCoach: "Hitting", notes: "8-10 swings each \u2014 confidence builders" },
      ]},
      { name: "Live Scrimmage", type: "together", time: "60 min", drills: [
        { ...D("g4"), assignedCoach: "All Coaches", notes: "Full game simulation. Keep score. Rotate pitchers. Most realistic practice." },
      ]},
      { name: "Cool Down & Mental", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Trust your training. You're ready for tournament." },
      ]},
    ]},
  { id: "late2", name: "End Season \u2014 Pre-Game Light Work", duration: 120, focus: "Pre-Game",
    description: "Day before tournament or big game. Light reps, build confidence.",
    phases: [
      { name: "Warm-Up & Throwing", type: "together", time: "20 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
        { ...D("t3"), assignedCoach: "Any", notes: "Long toss \u2014 build arm strength, keep it fun" },
      ]},
      { name: "Light Hitting", type: "together", time: "30 min", drills: [
        { ...D("h4"), assignedCoach: "Any", notes: "Light soft toss \u2014 feel good swings, not fixing mechanics" },
        { ...D("h6"), assignedCoach: "Any", notes: "8-10 swings each on the machine, low pressure" },
      ]},
      { name: "Defensive Review", type: "together", time: "25 min", drills: [
        { ...D("b2"), assignedCoach: "Any", notes: "Review rounding bases" },
        { ...D("f4"), assignedCoach: "Outfield", notes: "Fly ball tracking \u2014 outfielders especially" },
      ]},
      { name: "Mental Prep", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Talk about opponent, focus cues, positive energy. 'Trust your training.'" },
      ]},
      { name: "Fun Finish", type: "together", time: "15 min", drills: [
        { ...D("h9"), assignedCoach: "Any", notes: "Points-Based Hitting \u2014 end on a high note" },
      ]},
    ]},
  { id: "late3", name: "End Season \u2014 Fun & Competitions Day", duration: 120, focus: "Fun",
    description: "Last week of season. All competitions, keep energy high, celebrate the season.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Competitions", type: "together", time: "40 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 crown the champion" },
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball \u2014 quick hands" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-based team draft" },
      ]},
      { name: "Fielding Competition", type: "together", time: "25 min", drills: [
        { ...D("f3"), assignedCoach: "All Coaches", notes: "21 Outs challenge \u2014 beat your record" },
      ]},
      { name: "Baserunning Races", type: "together", time: "20 min", drills: [
        { ...D("b5"), assignedCoach: "Any", notes: "Race to 2nd and race home \u2014 bracket style" },
        { ...D("b7"), assignedCoach: "Any", notes: "Star drill \u2014 multi-direction competition" },
        { ...D("b1"), assignedCoach: "Any", notes: "Home to first \u2014 final season times" },
      ]},
      { name: "Conditioning Challenge", type: "together", time: "10 min", drills: [
        { ...D("c5"), assignedCoach: "Any", notes: "Ladder-hurdle combo \u2014 advanced challenge race" },
      ]},
      { name: "Team Celebration", type: "together", time: "10 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Season reflection \u2014 shoutouts, favorite memories, what we accomplished" },
      ]},
    ]},
  { id: "late4", name: "End Season \u2014 Advanced Skills & Team Chemistry", duration: 120, focus: "Advanced",
    description: "Final 2-3 weeks. Polish advanced skills, build team chemistry for playoffs.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("h7"), assignedCoach: "Hitting", station: "A", notes: "Speed changes \u2014 timing mastery" },
        { ...D("c4"), assignedCoach: "Conditioning", station: "B", notes: "Hurdle hops \u2014 explosive power for tournament prep" },
        { ...D("p3"), assignedCoach: "Pitching", station: "C", notes: "Simulated innings \u2014 pitch count management" },
      ]},
      { name: "Advanced Game Situations", type: "together", time: "35 min", drills: [
        { ...D("g1"), assignedCoach: "All Coaches", notes: "Complex scenarios \u2014 multiple runners" },
        { ...D("g2"), assignedCoach: "Infield", notes: "First & third defense \u2014 make the right read" },
        { ...D("g3"), assignedCoach: "Infield", notes: "Bunt defense \u2014 squeeze situations" },
      ]},
      { name: "Competition Finish", type: "together", time: "15 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 end practice on a high" },
      ]},
      { name: "Huddle", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "Topic: Playing for each other \u2014 we're at our best when we play together" },
      ]},
    ]},

  // SPECIAL PURPOSE
  { id: "special1", name: "Hitting-Focused Day", duration: 120, focus: "Hitting",
    description: "All offense. 3 hitting stations rotating, plus competitive hitting games.",
    phases: [
      { name: "Warm-Up", type: "together", time: "10 min", drills: [
        { ...D("w1"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Station Rotations", type: "stations", time: "45 min (3 groups \u00d7 15 min each)", drills: [
        { ...D("h6"), assignedCoach: "Hitting", station: "A", notes: "Jugs machine \u2014 vary speeds each round" },
        { ...D("h3"), assignedCoach: "Hitting", station: "B", notes: "Inside/outside tee \u2014 move tee between reps" },
        { ...D("h5"), assignedCoach: "Hitting", station: "C", notes: "Front toss \u2014 focus on timing" },
      ]},
      { name: "Bunting", type: "together", time: "10 min", drills: [
        { ...D("h10"), assignedCoach: "Any" },
      ]},
      { name: "Hitting Competitions", type: "together", time: "40 min", drills: [
        { ...D("h11"), assignedCoach: "Any", notes: "Batting Queen \u2014 6 levels" },
        { ...D("h8"), assignedCoach: "Any", notes: "Drop Ball \u2014 quick hands competition" },
        { ...D("h9"), assignedCoach: "Any", notes: "Points-Based Hitting \u2014 team draft" },
      ]},
      { name: "Cool Down", type: "together", time: "5 min", drills: [
        { ...D("m1"), assignedCoach: "Leadership", notes: "What felt good today? What do we work on next?" },
      ]},
    ]},
];
