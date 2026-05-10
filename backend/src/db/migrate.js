import db from "./index.js";

const migrate = async () => {
  console.log("Running migrations...");

  await db.query(`
    CREATE TABLE IF NOT EXISTS units (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      label       TEXT NOT NULL,
      type        TEXT NOT NULL,
      size        TEXT,
      city        TEXT NOT NULL,
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
      wa_tags         TEXT[],
      wa_sentiment    TEXT DEFAULT 'neutral',
      next_nudge      TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS leases (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      unit_id       UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
      rent_amount   INTEGER NOT NULL,
      start_date    DATE NOT NULL,
      end_date      DATE NOT NULL,
      status        TEXT DEFAULT 'active' CHECK (status IN ('active','expired','terminated')),
      created_at    TIMESTAMPTZ DEFAULT NOW()
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

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
