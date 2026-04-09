/**
 * Seed Game Logs — Initial game log data for the Pirates Softball Dashboard
 *
 * Extracted from App.jsx. Used as default data when no localStorage data exists.
 * Game types: "league", "scrimmage", "internal", "tournament", "exhibition"
 */

export const SEED_GAMELOGS = [
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
