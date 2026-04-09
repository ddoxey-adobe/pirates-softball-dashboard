/**
 * Season Schedule — 2026 Pirates Softball season schedule and helper functions
 *
 * Extracted from App.jsx. Contains the full schedule array and utility functions
 * for finding upcoming events.
 * Types: practice, game, scrimmage, tournament
 */

export const SEASON_SCHEDULE = [
  // PRE-SEASON
  { id: "s01", date: "2026-04-09", day: "Thu", type: "practice", title: "Assessment Practice 1", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s02", date: "2026-04-11", day: "Sat", type: "practice", title: "Assessment Practice 2", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s03", date: "2026-04-14", day: "Tue", type: "scrimmage", title: "Scrimmage", time: "6:00 PM", endTime: "8:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s04", date: "2026-04-16", day: "Thu", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Pre-Season" },
  { id: "s05", date: "2026-04-18", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Pre-Season" },
  // WEEK 1
  { id: "s06", date: "2026-04-20", day: "Mon", type: "game", title: "vs Rockies", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rockies", phase: "Week 1" },
  { id: "s07", date: "2026-04-21", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 1" },
  { id: "s08", date: "2026-04-23", day: "Thu", type: "game", title: "vs Reds", time: "5:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Reds", phase: "Week 1" },
  { id: "s09", date: "2026-04-25", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 1" },
  // WEEK 2
  { id: "s10", date: "2026-04-27", day: "Mon", type: "game", title: "vs Rangers", time: "6:30 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rangers", phase: "Week 2" },
  { id: "s11", date: "2026-04-28", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 2" },
  { id: "s12", date: "2026-04-30", day: "Thu", type: "game", title: "vs White Sox", time: "6:30 PM", location: "Sports Complex North", homeAway: "away", opponent: "White Sox", phase: "Week 2" },
  { id: "s13", date: "2026-05-02", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 2" },
  // WEEK 3
  { id: "s14", date: "2026-05-04", day: "Mon", type: "game", title: "vs Giants", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Giants", phase: "Week 3" },
  { id: "s15", date: "2026-05-05", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 3" },
  { id: "s16", date: "2026-05-07", day: "Thu", type: "game", title: "vs Athletics", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Athletics", phase: "Week 3" },
  { id: "s17", date: "2026-05-09", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 3" },
  // WEEK 4
  { id: "s18", date: "2026-05-11", day: "Mon", type: "game", title: "vs Diamondbacks", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Diamondbacks", phase: "Week 4" },
  { id: "s19", date: "2026-05-13", day: "Wed", type: "game", title: "vs Reds", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Reds", phase: "Week 4" },
  { id: "s20", date: "2026-05-16", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 4" },
  // WEEK 5
  { id: "s21", date: "2026-05-19", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 5" },
  { id: "s22", date: "2026-05-21", day: "Thu", type: "game", title: "vs Rockies", time: "8:00 PM", location: "Sports Complex North", homeAway: "home", opponent: "Rockies", phase: "Week 5" },
  { id: "s23", date: "2026-05-23", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 5" },
  // WEEK 6
  { id: "s24", date: "2026-05-26", day: "Tue", type: "practice", title: "Practice", time: "4:45 PM", endTime: "7:00 PM", location: "Sports Complex", phase: "Week 6" },
  { id: "s25", date: "2026-05-27", day: "Wed", type: "game", title: "vs Rangers", time: "8:00 PM", location: "Sports Complex North", homeAway: "away", opponent: "Rangers", phase: "Week 6" },
  { id: "s26", date: "2026-05-30", day: "Sat", type: "practice", title: "Practice", time: "7:45 AM", endTime: "10:00 AM", location: "Sports Complex", phase: "Week 6" },
  // TOURNAMENTS
  { id: "s27", date: "2026-06-01", day: "Mon", type: "tournament", title: "City Tournament - Day 1", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s28", date: "2026-06-04", day: "Thu", type: "tournament", title: "City Tournament - Day 2", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s29", date: "2026-06-05", day: "Fri", type: "tournament", title: "City Tournament - Day 3", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s30", date: "2026-06-06", day: "Sat", type: "tournament", title: "City Tournament - Day 4", time: "TBD", location: "Sports Complex", phase: "City Tournament" },
  { id: "s31", date: "2026-07-06", day: "Mon", type: "tournament", title: "State Tournament - Day 1", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
  { id: "s32", date: "2026-07-07", day: "Tue", type: "tournament", title: "State Tournament - Day 2", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
  { id: "s33", date: "2026-07-08", day: "Wed", type: "tournament", title: "State Tournament - Day 3", time: "TBD", location: "TBD", phase: "State Tournament", notes: "Top 4 from city qualify" },
];

export const getNextScheduleEvent = (type) => {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = SEASON_SCHEDULE.filter(e => e.date >= today && (!type || e.type === type));
  return upcoming.length > 0 ? upcoming[0] : null;
};

export const getUpcomingScheduleEvents = (count = 5) => {
  const today = new Date().toISOString().split("T")[0];
  return SEASON_SCHEDULE.filter(e => e.date >= today).slice(0, count);
};
