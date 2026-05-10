import db from "../db/index.js";

export const getAllUnits = async (req, res) => {
  const { rows } = await db.query(`
    SELECT u.*, c.name AS tenant_name, c.id AS tenant_id
    FROM units u
    LEFT JOIN clients c ON c.unit_id = u.id
    ORDER BY u.city, u.label
  `);
  res.json(rows);
};

export const getUnit = async (req, res) => {
  const { rows } = await db.query(
    `SELECT u.*, c.name AS tenant_name, c.id AS tenant_id
     FROM units u
     LEFT JOIN clients c ON c.unit_id = u.id
     WHERE u.id = $1`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Unit not found" });
  res.json(rows[0]);
};

export const createUnit = async (req, res) => {
  const { label, type, size, city, rent } = req.body;
  const { rows } = await db.query(
    `INSERT INTO units (label, type, size, city, rent)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [label, type, size, city, rent]
  );
  res.status(201).json(rows[0]);
};

export const updateUnit = async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ error: "No fields to update" });

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = keys.map(k => fields[k]);

  const { rows } = await db.query(
    `UPDATE units SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Unit not found" });
  res.json(rows[0]);
};

export const deleteUnit = async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM units WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Unit not found" });
  res.json({ success: true });
};
