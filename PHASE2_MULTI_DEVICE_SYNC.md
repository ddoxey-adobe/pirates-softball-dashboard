# Phase 2: Multi-Device Real-Time Sync Architecture

**Status:** Planning
**Priority:** Future Enhancement
**Timeline:** Post-Season 2026 (After initial season validation)
**Last Updated:** 2026-03-30

---

## Executive Summary

The Pirates Softball Dashboard currently operates as a **single-device, offline-first application** using browser localStorage. This architecture is intentional for Phase 1 - it's simple, fast, reliable, and requires no backend infrastructure or ongoing costs.

**Phase 2** introduces **multi-device real-time sync** to enable:
- Multiple coaches accessing the same data simultaneously
- Real-time updates during practice (one coach enters drill tracking, others see it instantly)
- Access from any device (phone, tablet, laptop)
- Cloud backup and data persistence
- Historical data across multiple seasons

This document outlines the architecture, options, costs, and migration strategy.

---

## Current Architecture (Phase 1)

### Technology Stack
- **Frontend:** React 18 (single-file HTML with CDN)
- **Storage:** Browser localStorage
- **Deployment:** GitHub Pages (static hosting)
- **Cost:** $0/month

### Strengths
✅ Zero cost
✅ No backend required
✅ Fast (no network latency)
✅ Works offline
✅ Simple deployment
✅ Privacy (data never leaves device)

### Limitations
❌ Single device only
❌ No data backup (if browser cache clears, data is lost)
❌ No collaboration (only one person can manage data)
❌ No cross-device access
❌ Can't access from phone during practice

---

## Phase 2 Vision

### Goals
1. **Multi-Coach Access:** Ken, Shari, and assistant coaches can all access the same roster, practice plans, and game logs
2. **Real-Time Updates:** Changes sync instantly across all connected devices
3. **Mobile-First During Practice:** Coaches use phones/tablets during practice to track drills in real-time
4. **Cloud Backup:** Data persists even if devices are lost or browsers are cleared
5. **Historical Records:** Multi-season tracking and analytics
6. **Selective Sync:** Option to work offline and sync when back online

### User Stories

**Story 1: Practice Day - Multi-Coach Coordination**
- Ken plans practice on laptop at home Tuesday night
- Shari opens the app on her phone Wednesday morning, sees the plan
- During practice: Ken tracks B1 sprint times on his phone, Shari tracks P2 pitch location on her tablet
- Both see real-time updates as data is entered
- After practice: Ken adds coach notes on laptop, Shari sees them immediately

**Story 2: Game Day - Split Responsibilities**
- Ken tracks at-bats and defensive plays from dugout on phone
- Shari tracks pitching stats from behind home plate on tablet
- Assistant coach tracks baserunning notes on their device
- All data merges into unified game log in real-time

**Story 3: Season Planning - Data Continuity**
- Season ends, team data is safely stored in cloud
- Next season: Ken creates new team, imports returning players
- Historical drill tracking data preserved for comparison (e.g., "Rose's B1 time improved from 3.8s last year to 3.5s this year")

---

## Architecture Options

### Option 1: Firebase Realtime Database (Google)

**Technology:**
- Firebase Realtime Database for sync
- Firebase Authentication for coach login
- Firebase Storage for optional photo/video uploads
- Firebase Hosting (alternative to GitHub Pages)

**Pros:**
✅ Real-time sync out of the box
✅ Excellent React SDK
✅ Free tier (Spark Plan) supports ~100 users
✅ Automatic offline support
✅ Strong security rules
✅ Google account integration
✅ Proven at scale

**Cons:**
❌ Vendor lock-in (Google)
❌ NoSQL data structure (requires redesign)
❌ Cost scales with usage (after free tier)
❌ Limited query capabilities

**Cost Estimate:**
- **Free Tier:** 1GB storage, 10GB/month bandwidth, 100 concurrent connections
- **Paid (if exceeded):** ~$5-25/month for small team usage

**Best For:** Teams that want a battle-tested solution with minimal backend work.

---

### Option 2: Supabase (Open-Source Firebase Alternative)

**Technology:**
- PostgreSQL database (relational)
- Supabase Realtime for live updates
- Supabase Auth for authentication
- Supabase Storage for files
- REST API + real-time subscriptions

**Pros:**
✅ Open source (can self-host if needed)
✅ SQL database (easier to query and analyze)
✅ Excellent free tier
✅ TypeScript-first SDK
✅ Row-level security
✅ Real-time subscriptions
✅ No vendor lock-in (PostgreSQL)

**Cons:**
❌ Smaller ecosystem than Firebase
❌ Newer (less battle-tested)
❌ Requires more manual real-time setup
❌ Self-hosting adds complexity

**Cost Estimate:**
- **Free Tier:** 500MB database, 1GB file storage, 2GB bandwidth
- **Paid (Pro Plan):** $25/month for 8GB database, 100GB storage, 50GB bandwidth

**Best For:** Teams that prefer SQL, want open-source, or plan to self-host eventually.

---

### Option 3: Custom Backend (Node.js + WebSockets)

**Technology:**
- Node.js/Express backend
- PostgreSQL or MongoDB
- WebSocket server (Socket.io or native)
- Railway/Render/DigitalOcean hosting
- JWT authentication

**Pros:**
✅ Full control over architecture
✅ No vendor lock-in
✅ Can optimize for specific use cases
✅ Flexible data model
✅ Can integrate with other tools

**Cons:**
❌ Most development work
❌ Requires backend maintenance
❌ Must implement auth, real-time, security from scratch
❌ Higher ongoing time investment

**Cost Estimate:**
- **Railway/Render:** $5-10/month for backend
- **PostgreSQL:** $5-15/month for managed DB
- **Total:** ~$10-25/month

**Best For:** Teams with backend engineering skills who want full control.

---

### Option 4: Hybrid (localStorage + Optional Cloud Sync)

**Technology:**
- Keep current localStorage architecture
- Add optional cloud sync (user chooses to enable)
- Use PouchDB + CouchDB for sync when enabled
- Graceful degradation (works fully offline)

**Pros:**
✅ Preserves current offline-first benefits
✅ Users can choose cloud sync or stay local
✅ CouchDB's sync protocol is robust
✅ Pay only if you use cloud features

**Cons:**
❌ More complex state management
❌ Sync conflicts possible
❌ CouchDB less popular (smaller ecosystem)

**Cost Estimate:**
- **Free:** Users who stay local-only
- **Paid:** $5-15/month for CouchDB hosting (if cloud sync enabled)

**Best For:** Teams that want to preserve offline-first but offer optional cloud sync.

---

## Recommended Approach: Supabase (Option 2)

### Why Supabase?

1. **Best Balance:** Real-time capabilities + SQL flexibility + open source
2. **Cost-Effective:** Free tier likely sufficient for entire season
3. **Developer Experience:** Excellent React SDK, TypeScript support
4. **Future-Proof:** Can self-host if needed (no lock-in)
5. **SQL Queries:** Better for complex analytics and reporting
6. **Row-Level Security:** Built-in security at database level

### Implementation Phases

**Phase 2.1: Authentication & Basic Sync (Weeks 1-2)**
- Set up Supabase project
- Implement coach authentication (email/password or Google OAuth)
- Migrate localStorage data model to PostgreSQL schema
- Basic CRUD operations with Supabase client
- Deploy updated app

**Phase 2.2: Real-Time Sync (Week 3)**
- Subscribe to real-time changes
- Implement optimistic updates
- Handle connection states (online/offline)
- Sync indicator in UI

**Phase 2.3: Conflict Resolution (Week 4)**
- Implement last-write-wins strategy
- Add conflict resolution UI for complex cases
- Test multi-device scenarios

**Phase 2.4: Offline Support (Week 5)**
- Queue changes when offline
- Sync when connection restored
- Handle merge conflicts

**Phase 2.5: Polish & Testing (Week 6)**
- Multi-coach testing
- Performance optimization
- Bug fixes
- Documentation

---

## Data Schema (Supabase PostgreSQL)

```sql
-- Coaches (authentication)
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('head', 'assistant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams (multi-season support)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  created_by UUID REFERENCES coaches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number INTEGER,
  grade TEXT,
  is_pitcher BOOLEAN DEFAULT false,
  is_returning BOOLEAN DEFAULT false,
  positions TEXT[],
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practices
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  date DATE,
  time TEXT,
  duration INTEGER,
  focus TEXT,
  status TEXT CHECK (status IN ('planned', 'active', 'completed')),
  drills JSONB,
  notes TEXT,
  created_by UUID REFERENCES coaches(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice Logs (completed practices with tracking data)
CREATE TABLE practice_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  focus TEXT,
  attendance JSONB, -- { playerId: boolean }
  drill_tracking JSONB, -- { drillId: { playerId: value } }
  observations JSONB, -- { playerId: "text observation" }
  coach_notes TEXT,
  created_by UUID REFERENCES coaches(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game Logs
CREATE TABLE game_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  opponent TEXT NOT NULL,
  location TEXT,
  result TEXT CHECK (result IN ('W', 'L')),
  score_us INTEGER,
  score_them INTEGER,
  attendance JSONB,
  at_bats JSONB,
  pitching JSONB,
  fielding JSONB,
  notes TEXT,
  created_by UUID REFERENCES coaches(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (team communications)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  from_coach UUID REFERENCES coaches(id),
  to_recipients TEXT[], -- player IDs or 'all'
  subject TEXT,
  body TEXT,
  scheduled_send TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Example Policy: Coaches can only access their team's data
CREATE POLICY "Coaches can view their team's players"
  ON players FOR SELECT
  USING (team_id IN (
    SELECT id FROM teams WHERE created_by = auth.uid()
  ));
```

---

## Migration Strategy

### Step 1: Data Export from Phase 1
```javascript
// Add to current app: Export button
const exportAllData = () => {
  const data = {
    players: JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS) || '[]'),
    practices: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRACTICES) || '[]'),
    practiceLogs: JSON.parse(localStorage.getItem(STORAGE_KEYS.PRACTICELOGS) || '[]'),
    gameLogs: JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMELOGS) || '[]'),
    messages: JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]'),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pirates-softball-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};
```

### Step 2: Import to Supabase
```javascript
// Phase 2 app: Import from Phase 1 backup
const importFromPhase1 = async (backupFile) => {
  const data = JSON.parse(await backupFile.text());

  // Create team
  const { data: team } = await supabase
    .from('teams')
    .insert({ name: 'Pirates Softball', season: '2026' })
    .select()
    .single();

  // Import players
  await supabase.from('players').insert(
    data.players.map(p => ({ ...p, team_id: team.id }))
  );

  // Import practices
  await supabase.from('practices').insert(
    data.practices.map(p => ({ ...p, team_id: team.id }))
  );

  // Import practice logs
  await supabase.from('practice_logs').insert(
    data.practiceLogs.map(l => ({ ...l, team_id: team.id }))
  );

  // Import game logs
  await supabase.from('game_logs').insert(
    data.gameLogs.map(g => ({ ...g, team_id: team.id }))
  );
};
```

### Step 3: Gradual Rollout
1. **Week 1:** Ken tests Phase 2 solo with imported data
2. **Week 2:** Add Shari, test two-coach sync
3. **Week 3:** Run both Phase 1 (backup) and Phase 2 (primary) in parallel
4. **Week 4:** Phase 2 becomes primary, Phase 1 archived

---

## Cost Analysis

### Year 1 (Free Tier)
- Supabase Free: 500MB database, 1GB storage, 2GB bandwidth
- **Estimated Usage:** ~50MB database, 100MB storage, 500MB bandwidth
- **Cost:** $0/month

### Year 2+ (If Free Tier Exceeded)
- Supabase Pro: $25/month
- **Alternatives:** Self-host on DigitalOcean ($5/month) or stay on free tier by archiving old seasons

### Total Cost of Ownership (3 Years)
- **Phase 1 Only:** $0
- **Phase 2 (Supabase Free):** $0
- **Phase 2 (Supabase Pro):** $300/year = $900 over 3 years
- **Phase 2 (Self-Hosted):** $60/year = $180 over 3 years

**Recommendation:** Start with free tier, evaluate after Year 1.

---

## Technical Requirements

### Browser Support
- Chrome/Edge 90+ (95% of users)
- Safari 14+ (iPhone/iPad)
- Firefox 88+

### Device Support
- Desktop: Windows, Mac, Linux
- Mobile: iOS 14+, Android 10+
- Tablets: iPad, Android tablets

### Network Requirements
- Minimum: 3G mobile connection
- Recommended: 4G/LTE or WiFi
- Offline: Queue changes, sync when reconnected

### Authentication
- Email/password (minimum)
- Google OAuth (preferred for convenience)
- Optional: Coach invite codes for team access

---

## Security & Privacy

### Data Protection
- **Encryption in Transit:** HTTPS/TLS for all connections
- **Encryption at Rest:** Supabase encrypts database storage
- **Row-Level Security:** Coaches can only access their team's data
- **Authentication:** JWT tokens, secure session management

### Privacy Considerations
- Player data is sensitive (names, phone numbers, emails)
- Comply with COPPA (Children's Online Privacy Protection Act) if collecting data from players under 13
- Clear privacy policy for parents
- Option to anonymize drill tracking data (use numbers instead of names)

### Access Control
- **Head Coach:** Full access (read/write all data, manage roster)
- **Assistant Coach:** Limited access (read all, write practice tracking only)
- **View-Only:** Parents/players can view public stats (optional future feature)

---

## Development Roadmap

### Pre-Phase 2 (Season 2026)
- ✅ Complete Phase 1 features
- ✅ Validate with real practices
- ✅ Gather user feedback
- ⏳ Test data export/import flow
- ⏳ Document lessons learned

### Phase 2.0: Foundation (Q1 2027)
- Set up Supabase project
- Design database schema
- Implement authentication
- Build basic CRUD operations
- Test with Ken only

### Phase 2.1: Real-Time Sync (Q2 2027)
- Implement real-time subscriptions
- Add optimistic updates
- Handle online/offline states
- Test with Ken + Shari

### Phase 2.2: Multi-Device Polish (Q3 2027)
- Conflict resolution
- Performance optimization
- Mobile UI improvements
- Full team testing

### Phase 2.3: Production Launch (Q4 2027)
- Final testing
- Data migration from Phase 1
- Rollout to team
- Monitor and iterate

---

## Success Metrics

### Phase 2 Success Criteria
- ✅ Zero data loss during migration
- ✅ <500ms sync latency for drill tracking
- ✅ Works reliably on 3G mobile connection
- ✅ 3+ coaches can collaborate simultaneously
- ✅ Offline mode handles 1+ hour without connection
- ✅ Zero security incidents
- ✅ Ken and Shari prefer Phase 2 over Phase 1

### Key Performance Indicators
- **Sync Speed:** Real-time updates appear <500ms
- **Reliability:** 99.9% uptime (Supabase SLA)
- **Data Integrity:** Zero conflicts or lost data
- **User Satisfaction:** Coaches rate experience 8+/10

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase free tier limits exceeded | Medium | Low | Monitor usage, archive old data, upgrade to Pro if needed |
| Real-time sync conflicts | Medium | Medium | Implement last-write-wins + manual resolution UI |
| Poor mobile network during practice | High | Medium | Offline-first design, queue changes, sync later |
| Learning curve for coaches | Medium | High | Simple onboarding, video tutorials, Ken tests first |
| Data breach / security incident | High | Low | Row-level security, encrypted connections, regular audits |
| Vendor lock-in (Supabase) | Medium | Low | PostgreSQL is portable, can self-host if needed |

---

## Decision Points

### Go/No-Go Decision (End of 2026 Season)

**Proceed with Phase 2 if:**
- ✅ Ken and Shari both use Phase 1 regularly
- ✅ Phase 1 drill tracking proves valuable
- ✅ Multi-coach collaboration is desired
- ✅ Team can afford $0-25/month for cloud sync
- ✅ Ken has 20-30 hours for development (or budget to hire)

**Stay with Phase 1 if:**
- ❌ Single-device works fine for the team
- ❌ Data backup isn't critical
- ❌ Phase 1 features aren't being used
- ❌ No budget for cloud hosting

---

## Alternatives Considered

### WebRTC Peer-to-Peer Sync
- **Pros:** No backend, zero cost
- **Cons:** Complex, unreliable, no cloud backup
- **Decision:** Rejected (too complex for benefit)

### Dropbox/Google Drive File Sync
- **Pros:** Simple, familiar
- **Cons:** No real-time, conflict resolution is manual
- **Decision:** Rejected (poor UX for real-time collaboration)

### Airtable/Google Sheets
- **Pros:** No code, instant sync
- **Cons:** Not designed for this use case, limited customization
- **Decision:** Rejected (doesn't support drill tracking UI)

---

## Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/react)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Similar Projects
- [TeamSnap](https://www.teamsnap.com/) - Team management (commercial)
- [SportsEngine](https://www.sportsengine.com/) - Youth sports platform
- [GameChanger](https://gc.com/) - Baseball/softball scoring app

### Learning Resources
- [Building Real-Time Apps with Supabase](https://egghead.io/courses/build-a-real-time-chat-app-with-react-and-supabase)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Offline-First Architecture](https://offlinefirst.org/)

---

## Next Steps

1. ✅ Complete Phase 1 features (reporting, print/export) - **Done 2026-03-30**
2. ⏳ Validate Phase 1 with real practices (Season 2026)
3. ⏳ Gather user feedback from Ken and Shari
4. ⏳ Test data export from Phase 1
5. ⏳ Make Go/No-Go decision (End of Season 2026)
6. ⏳ If Go: Begin Supabase setup and authentication (Q1 2027)

---

**Document Owner:** Claude Sonnet 4.5
**Last Review:** 2026-03-30
**Next Review:** 2026-12-01 (Post-Season)