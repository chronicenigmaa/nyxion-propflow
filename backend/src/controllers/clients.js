import db from "../db/index.js";

export const getAllClients = async (req, res) => {
  const { rows } = await db.query(`
    SELECT
      c.*,
      u.label  AS unit_label,
      u.city   AS unit_city,
      u.type   AS unit_type,
      u.rent   AS unit_rent
    FROM clients c
    LEFT JOIN units u ON c.unit_id = u.id
    ORDER BY c.lead_score DESC
  `);
  res.json(rows);
};

export const getClient = async (req, res) => {
  const { rows } = await db.query(
    `SELECT c.*, u.label AS unit_label, u.city AS unit_city
     FROM clients c
     LEFT JOIN units u ON c.unit_id = u.id
     WHERE c.id = $1`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Client not found" });
  res.json(rows[0]);
};

export const createClient = async (req, res) => {
  const { name, email, phone, cnic, city, unit_id, notes } = req.body;
  const { rows } = await db.query(
    `INSERT INTO clients (name, email, phone, cnic, city, unit_id, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [name, email, phone, cnic, city, unit_id || null, notes]
  );
  res.status(201).json(rows[0]);
};

export const updateClient = async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ error: "No fields to update" });

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = keys.map(k => fields[k]);

  const { rows } = await db.query(
    `UPDATE clients SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Client not found" });
  res.json(rows[0]);
};

export const deleteClient = async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM clients WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Client not found" });
  res.json({ success: true });
};
