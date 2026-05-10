import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
});

// Thin wrapper — use db.query() everywhere instead of pool.query() directly
const db = {
  query: (text, params) => pool.query(text, params),
  pool,
};

export default db;
