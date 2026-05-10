import db from "../db/index.js";

export const getAllLeases = async (req, res) => {
  const { rows } = await db.query(`
    SELECT l.*, c.name AS client_name, u.label AS unit_label, u.city
    FROM leases l
    JOIN clients c ON l.client_id = c.id
    JOIN units u ON l.unit_id = u.id
    ORDER BY l.end_date ASC
  `);
  res.json(rows);
};

export const getLease = async (req, res) => {
  const { rows } = await db.query(
    `SELECT l.*, c.name AS client_name, u.label AS unit_label
     FROM leases l
     JOIN clients c ON l.client_id = c.id
     JOIN units u ON l.unit_id = u.id
     WHERE l.id = $1`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Lease not found" });
  res.json(rows[0]);
};

export const createLease = async (req, res) => {
  const { client_id, unit_id, rent_amount, start_date, end_date } = req.body;

  // Mark unit as leased
  await db.query("UPDATE units SET status = 'leased' WHERE id = $1", [unit_id]);

  const { rows } = await db.query(
    `INSERT INTO leases (client_id, unit_id, rent_amount, start_date, end_date)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [client_id, unit_id, rent_amount, start_date, end_date]
  );
  res.status(201).json(rows[0]);
};

export const updateLease = async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ error: "No fields to update" });

  // If terminating a lease, free up the unit
  if (fields.status === "terminated" || fields.status === "expired") {
    const { rows: lease } = await db.query("SELECT unit_id FROM leases WHERE id = $1", [req.params.id]);
    if (lease.length) {
      await db.query("UPDATE units SET status = 'vacant' WHERE id = $1", [lease[0].unit_id]);
    }
  }

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = keys.map(k => fields[k]);

  const { rows } = await db.query(
    `UPDATE leases SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Lease not found" });
  res.json(rows[0]);
};
