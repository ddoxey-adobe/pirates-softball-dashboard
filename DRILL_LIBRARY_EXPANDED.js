// =============================================================================
// PIRATES SOFTBALL — EXPANDED DRILL LIBRARY
// 12U-14U Girls Softball | 2026 Season
// =============================================================================

const EXPANDED_DRILLS = [

  // ===========================================================================
  // WARM-UP (w1–w8)
  // ===========================================================================
  { id: "w1", name: "Dynamic Warm-Up Circuit", category: "Warm-Up", duration: 10, coach: "Any", description: "Players line up on the foul line and perform a progressive movement circuit across the outfield: high knees, butt kicks, carioca, lunges with a twist, and lateral shuffles. Each movement covers roughly 60 feet before jogging back. Coaches should watch for full range of motion and correct lazy arm swings. Finish with 10 arm circles forward and backward to prepare the shoulders.", equipment: "None", minPlayers: 1, ages: "All" },
  { id: "w2", name: "Partner Band Stretch", category: "Warm-Up", duration: 8, coach: "Any", description: "Each player grabs a resistance band and pairs up. They work through a shoulder-specific warm-up: pull-aparts, overhead stretches, internal/external rotation, and cross-body pulls—15 reps each. Partners watch for proper posture and controlled tempo. This is essential before any throwing and should never be rushed or skipped.", equipment: "Resistance bands", minPlayers: 2, ages: "All" },
  { id: "w3", name: "Jog-and-Toss Progression", category: "Warm-Up", duration: 10, coach: "Any", description: "Players jog in pairs around the outfield warning track while tossing a softball back and forth underhand. After one lap, they transition to light overhand flips at close range. The focus is on loosening the arm and building rhythm before full throwing. Coaches should ensure players stay relaxed and do not overthrow during this phase.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "w4", name: "Agility Ladder Footwork", category: "Warm-Up", duration: 8, coach: "Any", description: "Set up two agility ladders (or use cones at 18-inch intervals) along the first-base line. Players cycle through patterns: two feet in each box, ickey shuffle, lateral in-and-out, and single-leg hops. Keep lines short so rest is minimal. This builds the fast-twitch footwork that translates directly to fielding first-step quickness.", equipment: "Agility ladder or cones", minPlayers: 1, ages: "All" },
  { id: "w5", name: "Four Corners Relay", category: "Warm-Up", duration: 10, coach: "Any", description: "Place four cones in a square about 40 feet apart. Split into two teams. On the whistle, the first player from each team sprints to cone one, shuffles laterally to cone two, backpedals to cone three, and sprints home to tag the next player. This competitive warm-up gets heart rates up quickly while reinforcing multi-directional movement. Keep score to add energy.", equipment: "Cones", minPlayers: 4, ages: "All" },
  { id: "w6", name: "Arm Care Routine", category: "Warm-Up", duration: 10, coach: "Any", description: "Players grab a light resistance band and work through a structured arm care program: 15 reps of external rotation at 90 degrees, 15 reps of internal rotation, 15 band pull-aparts, and 15 overhead tricep stretches per arm. Follow with wrist rolls and forearm stretches. This protects growing arms and should become a non-negotiable pregame habit for every player on the roster.", equipment: "Resistance bands", minPlayers: 1, ages: "All" },
  { id: "w7", name: "Mirror Drill", category: "Warm-Up", duration: 8, coach: "Any", description: "Players pair up and face each other about five feet apart. One player is the leader and moves in any direction—shuffles, drops, jumps, spins—while the partner mirrors every movement. Switch leaders every 30 seconds. This sharpens reaction time and keeps players mentally engaged during warm-up instead of going through the motions.", equipment: "None", minPlayers: 2, ages: "All" },
  { id: "w8", name: "Progressive Throwing Warm-Up", category: "Warm-Up", duration: 12, coach: "Any", description: "Partners start on one knee at 20 feet and throw 10 balls focusing on wrist snap and follow-through. They then stand at 30 feet for 10 throws emphasizing full arm extension. Move to 45 feet for 10 throws at game-like effort, then 60 feet for 10 throws with an arc if needed. Finish with five throws from the longest comfortable distance. This graduated approach protects arms while building to full velocity.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },

  // ===========================================================================
  // THROWING (t1–t7)
  // ===========================================================================
  { id: "t1", name: "Knee Throwing Drill", category: "Throwing", duration: 10, coach: "Any", description: "Players kneel on their throwing-side knee with their glove-side foot forward, partner 25 feet away. Focus entirely on upper-body mechanics: elbow above shoulder, fingers on top of the ball, and a strong wrist snap through release. Throw 20 balls each. This isolates the arm action and removes lower-body compensation that can mask bad habits.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t2", name: "Long Toss Progression", category: "Throwing", duration: 15, coach: "Any", description: "After warm-up throws, partners back up five feet after every five accurate throws until they reach their maximum comfortable distance. Hold at max distance for 10 throws, then work back in by five feet per set. The goal is to build arm strength and encourage backspin. Coaches should stop any player whose mechanics break down at distance—they have gone too far.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t3", name: "Four-Seam Grip and Spin", category: "Throwing", duration: 10, coach: "Any", description: "Gather the team and teach the four-seam grip: index and middle fingers across the widest seam, thumb underneath on the smooth leather. Players practice spinning the ball out of their hand into the air and catching it themselves, checking for consistent backspin. Then throw 15 balls to a partner at 30 feet, with the receiver calling out whether the spin looked clean. Proper grip is the foundation of accuracy and velocity.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t4", name: "Quick-Release Relay", category: "Throwing", duration: 12, coach: "Any", description: "Set up three lines of three or four players, each line 40 feet apart. On the coach's whistle, the first player in each line throws to the second, who catches and throws to the third as fast as possible. The ball goes down and back. Time each group and challenge them to beat their previous time. This teaches a short transfer, quick feet toward the target, and urgency—critical for turning double plays.", equipment: "Softballs, gloves", minPlayers: 6, ages: "All" },
  { id: "t5", name: "Target Throwing Challenge", category: "Throwing", duration: 12, coach: "Any", description: "Tape a strike-zone-sized square on a fence or backstop using athletic tape, or hang a tire at chest height. Players throw from 40 feet, earning three points for the center, two for the square, and one for hitting the fence anywhere. Each player gets 10 throws per round. Track scores across practices to measure accuracy improvement. This adds accountability and purpose to every throw.", equipment: "Softballs, gloves, tape or tire", minPlayers: 1, ages: "All" },
  { id: "t6", name: "Crow Hop and Throw", category: "Throwing", duration: 10, coach: "Any", description: "Players line up in the outfield and practice the crow hop: a small hop onto the throwing-side foot to generate momentum toward the target before releasing the throw. Start with dry reps (no ball), then add a ball and throw to a partner 60 feet away. Emphasize that the hop is small and directional—not a big jump. This is how outfielders get power behind long throws to the infield.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "t7", name: "Cutoff and Relay Throwing", category: "Throwing", duration: 15, coach: "Any", description: "Set up an outfielder, a cutoff player at the edge of the infield dirt, and a receiver at home plate. The outfielder fields a rolled ball, throws to the cutoff, who catches, pivots, and throws home. Rotate positions every five reps. Coaches should stress that the cutoff must line up directly between the outfielder and the target, turn glove-side, and make a quick accurate throw. This is one of the most undertrained plays in youth softball.", equipment: "Softballs, gloves, cones", minPlayers: 3, ages: "12U-14U" },

  // ===========================================================================
  // FIELDING (f1–f8)
  // ===========================================================================
  { id: "f1", name: "Ground Ball Fundamentals", category: "Fielding", duration: 12, coach: "Any", description: "Players spread out across the infield. The coach rolls ground balls one at a time, and each player works through the basics: feet wider than shoulders, glove out front, butt down, field through the ball, and bring the glove to the belly button before throwing. Start with slow rollers and increase speed. This repetition is the backbone of every defensive practice.", equipment: "Softballs, gloves", minPlayers: 3, ages: "All" },
  { id: "f2", name: "Backhand and Forehand", category: "Fielding", duration: 12, coach: "Any", description: "The coach hits or throws ground balls to the left and right of each fielder, forcing them to move laterally. On backhands, players cross over, stay low, and field outside the throwing-side foot. On forehands, they open up and field in front of the glove-side foot. Do five of each per player before rotating. This teaches range and the different body positions required for balls hit to either side.", equipment: "Softballs, gloves, bat", minPlayers: 3, ages: "All" },
  { id: "f3", name: "Fly Ball Communication", category: "Fielding", duration: 12, coach: "Any", description: "Three outfielders set up at normal depth. The coach hits or throws pop flies into the gaps between them. The player who calls the ball loudly and first gets priority. The other two must peel off and back up. Repeat 15-20 balls, moving the landing spot around. Emphasize that calling the ball three times is the standard and that collisions happen when nobody talks.", equipment: "Softballs, gloves, bat or tennis racket", minPlayers: 3, ages: "All" },
  { id: "f4", name: "Short Hop Picks", category: "Fielding", duration: 10, coach: "Any", description: "Players pair up 20 feet apart. The thrower intentionally bounces the ball on a short hop directly at the receiver. The receiver practices picking the ball cleanly by keeping the glove below the ball and giving with the hands on contact. Do 15 picks each, then switch. This is essential for first basemen but every infielder needs to handle bad hops confidently.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "f5", name: "Rapid-Fire Infield", category: "Fielding", duration: 15, coach: "Head Coach", description: "Full infield takes positions. The coach hits ground balls in rapid succession—shortstop, second base, third base, first base—with each player throwing to first. As soon as one ball is caught at first, the next ball is hit. Keep the pace fast enough that fielders stay on their toes but not so fast that form collapses. After two rounds, add double-play feeds. This simulates game tempo and builds conditioning.", equipment: "Softballs, gloves, bat, bucket of balls", minPlayers: 7, ages: "12U-14U" },
  { id: "f6", name: "Dive and Recovery", category: "Fielding", duration: 10, coach: "Any", description: "On a soft grass surface, players practice diving for balls thrown or hit just out of reach to their glove side. Start on their knees to learn how to extend, land on the chest, and pop up. Progress to standing starts. Coaches should ensure players tuck the chin, extend the glove fully, and squeeze the ball. Limit to 8-10 dives per player to manage fatigue. This builds confidence for highlight plays.", equipment: "Softballs, gloves", minPlayers: 2, ages: "12U-14U" },
  { id: "f7", name: "Tag Play Practice", category: "Fielding", duration: 10, coach: "Any", description: "Set up a base with a fielder and a runner. The coach throws the ball to the fielder, who must catch it, sweep the glove down in front of the base, and pull it up quickly after the tag. The runner slides in. Focus on glove positioning: tag low and on the front edge of the base, not on top of the runner. Do five reps per fielder at second base and home plate. Proper tag technique prevents both missed calls and injuries.", equipment: "Softballs, gloves, bases", minPlayers: 3, ages: "12U-14U" },
  { id: "f8", name: "Pop-Up Priority", category: "Fielding", duration: 10, coach: "Any", description: "With the full infield and catcher in position, the coach hits pop-ups to various spots on the infield. Players must communicate using priority rules: pitcher covers only if no one else can, corner infielders yield to middle infielders, and everyone yields to the catcher on balls near home. Run 15-20 pop-ups and stop to correct any time communication breaks down. This eliminates the embarrassing dropped pop-ups that give away free baserunners.", equipment: "Softballs, gloves, bat", minPlayers: 7, ages: "12U-14U" },

  // ===========================================================================
  // HITTING (h1–h8)
  // ===========================================================================
  { id: "h1", name: "Tee Work Fundamentals", category: "Hitting", duration: 15, coach: "Any", description: "Each hitter sets up a tee at the front of the strike zone and takes 20 swings focusing on stance, load, stride, and contact point. Place the tee at the inside, middle, and outside positions for 10 swings each to learn how contact point changes. Coaches should watch for a level swing path, back elbow staying connected, and full hip rotation through contact. Tee work is the single best way to build a repeatable swing.", equipment: "Batting tee, softballs, bat, net or fence", minPlayers: 1, ages: "All" },
  { id: "h2", name: "Soft Toss Hitting", category: "Hitting", duration: 15, coach: "Any", description: "A coach or partner kneels at a 45-degree angle in front of the hitter and tosses balls into the strike zone from about eight feet away. The hitter drives each ball into a net or fence. Do sets of 10 with a focus cue each round: first round on keeping the hands inside, second round on staying through the ball, third round on using the lower half. Soft toss bridges the gap between tee work and live pitching.", equipment: "Softballs, bat, net or fence", minPlayers: 2, ages: "All" },
  { id: "h3", name: "Front Toss with L-Screen", category: "Hitting", duration: 15, coach: "Head Coach", description: "The coach sets up behind an L-screen about 20 feet from the batter and delivers underhand tosses at moderate speed into the strike zone. The hitter takes full game swings. This drill is faster-paced than soft toss and teaches timing and pitch tracking. Coaches should mix locations—inside, outside, up, down—and occasionally throw a ball off the plate to see if the hitter can lay off. Groups of four rotate through quickly.", equipment: "L-screen, softballs, bat, helmet", minPlayers: 2, ages: "All" },
  { id: "h4", name: "Two-Strike Approach Drill", category: "Hitting", duration: 12, coach: "Any", description: "Every at-bat in this drill starts with an 0-2 count. The coach delivers front toss, and the hitter must shorten up, protect the plate, and put the ball in play—no called third strikes allowed. If the hitter swings and misses or takes a strike, the at-bat is over and the next hitter steps in. This teaches the mental adjustment that many young hitters never learn: change your approach when the count demands it.", equipment: "L-screen, softballs, bat, helmet", minPlayers: 2, ages: "12U-14U" },
  { id: "h5", name: "Opposite-Field Hitting", category: "Hitting", duration: 12, coach: "Any", description: "Set the tee on the outside corner of the plate. The hitter must let the ball travel deep into the zone and drive it to the opposite field. For right-handed hitters, the ball should go to right field; for lefties, to left field. Place a cone or target in the opposite-field gap as a visual reference. Do 15 swings and count how many go to the target side. This develops the ability to use the whole field instead of pulling everything.", equipment: "Batting tee, softballs, bat, cones", minPlayers: 1, ages: "12U-14U" },
  { id: "h6", name: "Bunting Stations", category: "Hitting", duration: 12, coach: "Any", description: "Set up three cones along the first-base and third-base lines to create target zones. The coach delivers pitches from 20 feet and the hitter squares to bunt, aiming for a specific cone. Practice both sacrifice bunts (square early, deaden the ball) and drag bunts (show late, push toward the target while starting to run). Five reps of each type per hitter. Every player on the team needs to be able to bunt—it is not optional.", equipment: "Softballs, bat, cones, helmet", minPlayers: 2, ages: "All" },
  { id: "h7", name: "High-Velocity Reaction Swings", category: "Hitting", duration: 10, coach: "Any", description: "Feed balls into a pitching machine or have a fast coach throw from a shortened distance (30 feet) to simulate higher velocity. The hitter must shorten the swing, start the load earlier, and trust their hands. Limit to 10-12 swings per hitter to avoid fatigue-driven bad habits. This pushes the hitter out of their comfort zone and forces quicker decisions. Always follow up with normal-speed reps so the hitter recalibrates.", equipment: "Pitching machine or L-screen, softballs, bat, helmet", minPlayers: 1, ages: "12U-14U" },
  { id: "h8", name: "Hit-and-Run Situational Drill", category: "Hitting", duration: 12, coach: "Head Coach", description: "A runner stands on first base. The coach announces the hit-and-run is on. On the pitch, the runner takes off and the batter must swing at whatever is thrown and try to hit a ground ball to the right side of the infield. If the batter misses, the runner must still go. Rotate through the lineup with different runners. This teaches contact discipline, directional hitting, and situational awareness all at once.", equipment: "Softballs, bat, bases, helmet, gloves", minPlayers: 4, ages: "12U-14U" },

  // ===========================================================================
  // BASERUNNING (b1–b7)
  // ===========================================================================
  { id: "b1", name: "Home-to-First Sprint", category: "Baserunning", duration: 10, coach: "Any", description: "Players line up at home plate. Each player takes a swing (real or simulated), drops the bat properly, and sprints through first base, hitting the front edge of the bag. Time each run. Emphasize running through the base—not slowing down, not leaping at it—and turning the head to the right to check for an overthrow. This is the most fundamental baserunning skill and sets the tone for hustle.", equipment: "Bases, stopwatch", minPlayers: 2, ages: "All" },
  { id: "b2", name: "Rounding First Base", category: "Baserunning", duration: 10, coach: "Any", description: "Set up first base in normal position. Players start at home and practice making an aggressive turn at first: banana-curve approach, hit the inside corner of the bag with the left foot, lean into the turn, and take two hard steps toward second before reading the play. The coach stands in right field and gives a safe or out signal to decide if the runner keeps going. This teaches runners to be aggressive and read the ball.", equipment: "Bases", minPlayers: 2, ages: "All" },
  { id: "b3", name: "Leadoff and Steal Timing", category: "Baserunning", duration: 12, coach: "Any", description: "Runners take a leadoff from first base while a pitcher works from the circle. The runner practices timing: when the pitcher's arm starts the forward motion, the runner explodes. A coach at second base times the runner with a stopwatch. Focus on a low explosive first step, pumping the arms, and sliding into the base. Each runner gets five reps and tries to improve their time. Speed is great, but a good jump matters more.", equipment: "Bases, stopwatch", minPlayers: 3, ages: "12U-14U" },
  { id: "b4", name: "Sliding Technique Clinic", category: "Baserunning", duration: 12, coach: "Any", description: "Start on a grassy area with a loose base or a slip-and-slide mat. Teach the figure-four slide: tuck one leg under the other, lean back, keep hands up. Players walk through the motion first, then jog into it, then run at half speed. Progress to full-speed slides into a base. Common corrections: do not slide headfirst at this age, keep the chin tucked, and hands off the ground to avoid jammed fingers.", equipment: "Bases or slide mat", minPlayers: 2, ages: "12U-14U" },
  { id: "b5", name: "First-to-Third Read", category: "Baserunning", duration: 12, coach: "Head Coach", description: "A runner starts on first base. The coach hits or throws a ball into the outfield—some to right field, some to center. The runner must read the ball off the bat, decide whether to go first-to-third, and make the turn. A third-base coach gives live signals (go, hold, slide). Run 10 reps per player and discuss each decision afterward. This is where baserunning IQ develops and where aggressive teams separate themselves.", equipment: "Softballs, gloves, bases, bat", minPlayers: 4, ages: "12U-14U" },
  { id: "b6", name: "Delayed Steal", category: "Baserunning", duration: 10, coach: "Any", description: "A runner is on first or second base. The catcher receives the pitch and throws back to the pitcher. As the throw goes back, the runner takes off for the next base. The key is waiting for the ball to leave the catcher's hand—not guessing—and exploding on the release. Practice the read five times per runner, then add live defense to make it competitive. This play takes advantage of lazy return throws and inattentive middle infielders.", equipment: "Softballs, gloves, bases", minPlayers: 5, ages: "12U-14U" },
  { id: "b7", name: "Tagging Up on Fly Balls", category: "Baserunning", duration: 10, coach: "Any", description: "Runners start on second and third base. The coach hits fly balls to the outfield. Runners must keep one foot on the base until the catch is made, then sprint to the next base. A coach times the tag-up and evaluates the runner's first step. Stress that the runner should watch the fielder's glove—when the ball hits leather, they go. Practice five reps from each base and add a throw from the outfield to make it live.", equipment: "Softballs, gloves, bases, bat", minPlayers: 5, ages: "All" },

  // ===========================================================================
  // PITCHING (p1–p7)
  // ===========================================================================
  { id: "p1", name: "Wrist Snap Drill", category: "Pitching", duration: 8, coach: "Pitching Coach", description: "The pitcher kneels facing a catcher or net at 10 feet. Holding the ball in the pitching hand with the arm extended down, she snaps the wrist forward to release the ball, generating spin. Focus on a firm wrist snap and releasing the ball off the fingertips. Do 20 snaps. This isolates the most important part of the pitch—the release—and builds the muscle memory for spin and accuracy.", equipment: "Softballs, glove, catcher or net", minPlayers: 1, ages: "All" },
  { id: "p2", name: "K-Position Power Drill", category: "Pitching", duration: 10, coach: "Pitching Coach", description: "The pitcher stands sideways with her arm at the top of the windmill circle (the K or power position—arm straight up, body sideways). From here, she drives through with the hips and snaps the ball to the catcher. This skips the windup entirely and focuses on the power phase of the pitch. Do 15 pitches and check for proper hip drive, arm whip, and follow-through. It teaches pitchers where their velocity actually comes from.", equipment: "Softballs, glove, catcher", minPlayers: 2, ages: "All" },
  { id: "p3", name: "Full Windmill Walk-Through", category: "Pitching", duration: 12, coach: "Pitching Coach", description: "The pitcher walks through the complete pitching motion in slow motion, pausing at four checkpoints: the starting stance, the top of the arm circle, the K-position, and the release point. A coach stands beside her and checks alignment, arm path, and hip opening at each stop. After three slow walk-throughs, she delivers five pitches at half speed, then five at three-quarter speed, then five at full speed. This teaches proper sequencing from the ground up.", equipment: "Softballs, glove, catcher", minPlayers: 2, ages: "All" },
  { id: "p4", name: "Pitch Location Targets", category: "Pitching", duration: 15, coach: "Pitching Coach", description: "Set up a strike zone target frame behind the plate or tape four quadrants on a backstop net. The pitcher throws to each quadrant in sequence: up-and-in, up-and-away, down-and-in, down-and-away. She gets five pitches per quadrant and earns a point for each one that hits the target zone. Track scores across practices. Accuracy separates pitchers who throw hard from pitchers who dominate—this is how you build it.", equipment: "Softballs, glove, catcher or target frame", minPlayers: 1, ages: "12U-14U" },
  { id: "p5", name: "Change-Up Development", category: "Pitching", duration: 12, coach: "Pitching Coach", description: "Teach the circle-change grip: form a circle with the thumb and index finger on the side of the ball, with the remaining three fingers across the seams. The arm speed must stay the same as the fastball—the grip change creates the speed difference. Start at 20 feet and throw 10, then move to full distance. Alternate fastball-changeup-fastball to feel the speed difference. Remind pitchers that a good changeup does not need to be slow—it just needs to be slower than the fastball.", equipment: "Softballs, glove, catcher", minPlayers: 2, ages: "12U-14U" },
  { id: "p6", name: "Pitch Count Simulated Inning", category: "Pitching", duration: 15, coach: "Pitching Coach", description: "The pitcher throws a simulated inning to a catcher with the coach calling balls and strikes. She must pitch to imaginary batters and work through counts. If she walks a batter, a runner is placed on base and she must pitch from the stretch. Goal: get through three batters on fewer than 15 pitches. This builds mental stamina and helps the pitcher learn to compete inside the strike zone under realistic pressure.", equipment: "Softballs, glove, catcher, helmet", minPlayers: 2, ages: "12U-14U" },
  { id: "p7", name: "Fielding the Position", category: "Pitching", duration: 10, coach: "Pitching Coach", description: "After delivering the pitch, the pitcher must be ready to field. In this drill, the pitcher delivers to a catcher, and a coach immediately hits or rolls a ball back at her. She must field it cleanly and throw to first base. Mix in bunts, comebackers, and slow rollers. Add a first baseman to receive throws. Do 10 reps. Too many young pitchers finish their motion and stand flat-footed—this drill breaks that habit.", equipment: "Softballs, glove, bat, bases", minPlayers: 3, ages: "12U-14U" },

  // ===========================================================================
  // GAME PLAY / SITUATIONAL (g1–g7)
  // ===========================================================================
  { id: "g1", name: "Situation Ball", category: "Game Play", duration: 20, coach: "Head Coach", description: "The coach sets up a full defense and announces a game situation before each play: runner on second with one out, bases loaded with no outs, runner on third with a squeeze play on. A batter hits a live ball, and every player must execute correctly for their position. If any player goes to the wrong base or makes a mental error, reset and repeat the same situation. This is the best drill for building game IQ across the entire roster.", equipment: "Full equipment, bases, bat, softballs", minPlayers: 10, ages: "12U-14U" },
  { id: "g2", name: "First-and-Third Defense", category: "Game Play", duration: 15, coach: "Head Coach", description: "Set up runners on first and third with the defense in position. The runner on first attempts to steal second. The catcher must decide: throw through to second, fake to second and throw to third, or hold the ball. Run five reps of each option so the defense learns all three responses. Then let the offense run live to see if the defense can make the right read. This is the most common high-leverage situation in youth softball.", equipment: "Softballs, gloves, bases, catcher gear", minPlayers: 10, ages: "12U-14U" },
  { id: "g3", name: "Bunt Defense Rotations", category: "Game Play", duration: 12, coach: "Head Coach", description: "With runners on base, the coach announces a bunt situation. The batter squares to bunt, and the defense executes the rotation: corners crash, pitcher fields if possible, second baseman covers first, shortstop covers second or third depending on the play. Walk through each rotation slowly first, then go live. Run 10 reps and ensure every player knows exactly where they are going. Bunt defense breaks down when one player freelances.", equipment: "Softballs, gloves, bases, bat", minPlayers: 9, ages: "12U-14U" },
  { id: "g4", name: "Rundown Drill", category: "Game Play", duration: 12, coach: "Any", description: "Set up a runner caught between two bases with a fielder at each base. The goal is to get the out in two throws or fewer. The fielder with the ball runs hard at the baserunner to force a commit, then tosses to the other fielder for the tag. Rotate runners and fielders. Common mistakes: too many throws, not running hard enough at the runner, throwing across the runner's path. Keep it simple—run, force, flip, tag.", equipment: "Softballs, gloves, bases", minPlayers: 3, ages: "All" },
  { id: "g5", name: "Two-Out Rally", category: "Game Play", duration: 15, coach: "Head Coach", description: "Set up a scrimmage scenario: the batting team always starts with two outs. The inning continues until the third out is recorded. This forces hitters to learn how to deliver clutch at-bats with two outs and rewards the team that fights through instead of giving up on an inning. Keep score. The two-out mentality separates championship teams from everyone else.", equipment: "Full equipment, bases", minPlayers: 10, ages: "12U-14U" },
  { id: "g6", name: "Live Scrimmage with Coaching Stops", category: "Game Play", duration: 25, coach: "Head Coach", description: "Play a full scrimmage but the head coach can stop play at any time to teach. If a player throws to the wrong base, freeze the play, ask the team where the ball should have gone, and replay the situation. Limit stops to four or five per scrimmage to keep it flowing. This is live game experience with built-in teachable moments—the most realistic practice environment you can create.", equipment: "Full equipment, bases", minPlayers: 12, ages: "12U-14U" },
  { id: "g7", name: "Pressure Inning", category: "Game Play", duration: 15, coach: "Head Coach", description: "Set the score at a one-run deficit in the bottom of the last inning. The batting team must score to tie or win. The defense must get three outs to hold the lead. Both sides play with full intensity and real consequences (losing team does a sprint or the winning team picks the next drill). This simulates end-of-game pressure that cannot be replicated any other way. Rotate sides so every player feels both perspectives.", equipment: "Full equipment, bases", minPlayers: 12, ages: "12U-14U" },

  // ===========================================================================
  // CONDITIONING (c1–c6)
  // ===========================================================================
  { id: "c1", name: "Base Path Sprints", category: "Conditioning", duration: 10, coach: "Any", description: "Players start at home plate and sprint to first base (60 feet), jog to second, sprint to third, jog home. Repeat four times. This interval pattern mirrors game demands—short bursts of speed followed by recovery. Time the sprints to keep players accountable. Encourage full effort on every sprint and active recovery (not walking) on every jog.", equipment: "Bases", minPlayers: 1, ages: "All" },
  { id: "c2", name: "Defensive Shuffle Circuit", category: "Conditioning", duration: 10, coach: "Any", description: "Place four cones in a line, each 10 feet apart. Players start at cone one and shuffle right to cone two, shuffle back to cone one, shuffle right to cone three, back to cone one, then shuffle right to cone four and back. Rest 30 seconds and repeat three times. This builds lateral quickness and endurance specific to infield defense. Keep the hips low and feet wide throughout—no crossing over.", equipment: "Cones", minPlayers: 1, ages: "All" },
  { id: "c3", name: "Softball Suicide Sprints", category: "Conditioning", duration: 8, coach: "Any", description: "Players start on the foul line. Sprint to the pitcher's circle and back, sprint to second base and back, sprint to the outfield grass and back, sprint to the warning track and back. Rest 60 seconds and repeat twice. These progressive-distance sprints build anaerobic capacity and mental toughness. Make sure players touch each line and do not round off early.", equipment: "None", minPlayers: 1, ages: "All" },
  { id: "c4", name: "Burpee-and-Field Combo", category: "Conditioning", duration: 10, coach: "Any", description: "Players line up in the infield. The coach calls out a number between one and five. Players do that many burpees, then immediately get in fielding position as the coach hits a ground ball. They must field it cleanly and throw to first despite being fatigued. This trains players to execute fundamentals when their legs are tired—exactly what the late innings of a tournament feel like. Do eight reps per player.", equipment: "Softballs, gloves, bat", minPlayers: 3, ages: "12U-14U" },
  { id: "c5", name: "Partner Resistance Sprints", category: "Conditioning", duration: 10, coach: "Any", description: "One player wraps a resistance band around her waist while her partner holds the other end from behind. The front player sprints forward for 20 feet against the resistance, then the band is released and she sprints another 20 feet at full speed. The contrast between resisted and free sprinting teaches the body to recruit more muscle fibers. Each player does five reps, then partners switch. This is one of the best ways to build acceleration.", equipment: "Resistance bands", minPlayers: 2, ages: "12U-14U" },
  { id: "c6", name: "Relay Race Challenge", category: "Conditioning", duration: 10, coach: "Any", description: "Split the team into two or three groups. Set up a course: sprint 60 feet, touch a cone, backpedal 30 feet, shuffle left 20 feet, shuffle right 20 feet, then sprint home and tag the next teammate. The first team to finish wins. Losing teams do five push-ups. This adds competition and energy to conditioning so it does not feel like punishment. Vary the course each practice to keep it fresh.", equipment: "Cones", minPlayers: 4, ages: "All" },

  // ===========================================================================
  // MENTAL / TEAM BUILDING (m1–m6)
  // ===========================================================================
  { id: "m1", name: "Visualization Walk-Through", category: "Mental/Team Building", duration: 10, coach: "Head Coach", description: "Players sit or lie down in the outfield with eyes closed. The coach narrates a game scenario in detail: the count, the runners, the crowd noise. Each player mentally sees herself executing the play—fielding the ball, making the throw, hearing the umpire call the out. Run through three different scenarios in 10 minutes. Research shows that mental rehearsal activates the same neural pathways as physical practice. Do this before big games.", equipment: "None", minPlayers: 1, ages: "All" },
  { id: "m2", name: "Positive Self-Talk Reset", category: "Mental/Team Building", duration: 8, coach: "Head Coach", description: "Gather the team in a circle. Each player shares one negative thought they have during games (I always strike out, I cannot throw to first). The team then helps reframe it into a positive statement (I battle every at-bat, I make strong throws). Each player writes her positive statement on athletic tape and sticks it inside her glove or on her bat. Revisit these statements each week. Changing internal dialogue changes performance.", equipment: "Athletic tape, markers", minPlayers: 4, ages: "All" },
  { id: "m3", name: "Error Recovery Drill", category: "Mental/Team Building", duration: 12, coach: "Head Coach", description: "A fielder deliberately receives a bad-hop ground ball that gets past her (coach throws it intentionally). She must immediately perform a reset routine: take a breath, slap her glove, say a positive cue word, and get ready for the next ball. The coach immediately hits another ball. The goal is to train the response to failure—not to dwell on it but to physically reset and compete on the very next play. This is one of the most important mental skills in softball.", equipment: "Softballs, gloves", minPlayers: 2, ages: "All" },
  { id: "m4", name: "Blindfold Trust Fielding", category: "Mental/Team Building", duration: 10, coach: "Any", description: "One player wears a blindfold (or closes her eyes) and stands in the infield. Her partner stands behind her and gives verbal directions: step left, step right, reach down now. The coach rolls a ball toward the blindfolded player, and she must field it using only her partner's instructions. Switch roles after three balls. This builds communication skills and trust between teammates. It also shows players how precise verbal cues need to be.", equipment: "Softballs, gloves, blindfold or bandana", minPlayers: 3, ages: "All" },
  { id: "m5", name: "Team Goal Setting Circle", category: "Mental/Team Building", duration: 10, coach: "Head Coach", description: "The team sits in a circle. The coach asks each player to state one individual goal for the week and one thing she wants the team to improve. The coach writes all responses on a whiteboard or clipboard. At the next practice, the coach revisits the list and asks who made progress. This creates accountability, gives every player a voice, and shows the team that improvement is a daily choice, not something that happens by accident.", equipment: "Whiteboard or clipboard, markers", minPlayers: 4, ages: "All" },
  { id: "m6", name: "Two-Minute Dugout Challenge", category: "Mental/Team Building", duration: 8, coach: "Head Coach", description: "During a scrimmage or situational drill, the coach gives the team a defensive challenge: get out of the inning in two minutes or less of game time. If they succeed, they earn a reward (water break, skip conditioning, choose a drill). If they fail, the clock resets and they try again. This teaches urgency, energy, and the concept of competing as a unit. It also shows players that their collective effort directly controls outcomes.", equipment: "Stopwatch", minPlayers: 9, ages: "12U-14U" },
];


// =============================================================================
// ASSESSMENT PRACTICE TEMPLATES
// =============================================================================
// These templates are designed for the first two evaluation practices of the
// season. They cycle every player through key skill stations while giving
// coaches structured observation windows to evaluate talent, attitude, and
// coachability. Each phase includes assessment notes for what to watch for.
// =============================================================================

const ASSESSMENT_TEMPLATES = [
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
        notes: "ASSESS: Glove work, footwork, body positioning, and first-step quickness. Hit 5 ground balls to each player—2 right at them, 2 to the backhand, 1 to the forehand. Rate on a 1-5 scale: hands, feet, range, throwing accuracy. Note natural position fits."
      },
      {
        name: "Outfield Fielding Station",
        duration: 15,
        drills: ["f3"],
        notes: "ASSESS: Fly ball tracking, drop-step ability, communication, and arm strength on throws back to the infield. Hit 5 fly balls per player—mix in line drives, high pop-ups, and balls in the gap. Who calls the ball? Who takes good angles?"
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
        notes: "ASSESS: Stance, load, swing path, bat speed, and contact quality. Each player takes 15 swings on the tee—5 inside, 5 middle, 5 outside. Rate on a 1-5 scale: mechanics, bat speed, contact consistency, power. Note who makes adjustments between swings."
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
        notes: "ASSESS: For pitchers—velocity, accuracy, mechanics, and composure. Each pitcher throws 20 pitches to the catcher while coaches chart location. For non-pitchers, evaluate catching ability and willingness to receive. Rate pitchers on a 1-5 scale: velocity, command, mechanics, poise."
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
