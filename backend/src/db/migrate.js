import db from "./index.js";

const migrate = async () => {
  console.log("Running Propflow migrations…");

  await db.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name             TEXT NOT NULL,
      type             TEXT NOT NULL CHECK (type IN ('residential','commercial','mixed')),
      city             TEXT NOT NULL,
      address          TEXT,
      floors           INTEGER DEFAULT 1,
      total_units      INTEGER DEFAULT 0,
      description      TEXT,
      completion_year  INTEGER,
      status           TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','under_construction')),
      color            TEXT DEFAULT '#1C64F2',
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS units (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
      floor       INTEGER NOT NULL DEFAULT 1,
      unit_no     TEXT NOT NULL,
      type        TEXT NOT NULL CHECK (type IN ('apartment','office','retail','commercial')),
      bedrooms    INTEGER,
      size        TEXT,
      rent        INTEGER NOT NULL,
      status      TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('leased','vacant')),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT,
      cnic            TEXT,
      city            TEXT,
      unit_id         UUID REFERENCES units(id) ON DELETE SET NULL,
      lead_score      INTEGER DEFAULT 50,
      status          TEXT DEFAULT 'Prospect',
      status_color    TEXT DEFAULT 'blue',
      notes           TEXT,
      wa_summary      TEXT,
      wa_summary_urdu TEXT,
      wa_tags         TEXT[],
      wa_sentiment    TEXT DEFAULT 'neutral',
      next_nudge      TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS leases (
      id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      unit_id           UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
      rent_amount       INTEGER NOT NULL,
      security_deposit  INTEGER DEFAULT 0,
      notice_period     INTEGER DEFAULT 60,
      start_date        DATE NOT NULL,
      end_date          DATE NOT NULL,
      status            TEXT DEFAULT 'active' CHECK (status IN ('active','expiring','terminated')),
      created_at        TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
      unit_id     UUID REFERENCES units(id) ON DELETE CASCADE,
      visit_date  DATE NOT NULL,
      visit_time  TEXT,
      type        TEXT DEFAULT 'viewing' CHECK (type IN ('viewing','signing','inspection')),
      status      TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
      notes       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      unit_id       UUID REFERENCES units(id) ON DELETE SET NULL,
      amount        INTEGER NOT NULL,
      due_date      DATE NOT NULL,
      paid_date     DATE,
      status        TEXT DEFAULT 'upcoming' CHECK (status IN ('paid','overdue','upcoming')),
      days_late     INTEGER DEFAULT 0,
      ai_label      TEXT,
      ai_color      TEXT DEFAULT 'blue',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS risk_flags (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
      unit_id     UUID REFERENCES units(id) ON DELETE CASCADE,
      reason      TEXT NOT NULL,
      level       TEXT NOT NULL CHECK (level IN ('critical','high','medium','low')),
      resolved    BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS nudges (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
      message     TEXT NOT NULL,
      action      TEXT,
      urgency     TEXT DEFAULT 'medium' CHECK (urgency IN ('critical','high','medium','low')),
      done        BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("All migrations complete.");
  process.exit(0);
};

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});