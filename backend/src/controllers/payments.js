import db from "../db/index.js";

export const getAllPayments = async (req, res) => {
  const { rows } = await db.query(`
    SELECT p.*, c.name AS client_name, u.label AS unit_label
    FROM payments p
    JOIN clients c ON p.client_id = c.id
    LEFT JOIN units u ON p.unit_id = u.id
    ORDER BY p.due_date DESC
  `);
  res.json(rows);
};

export const getPayment = async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.*, c.name AS client_name, u.label AS unit_label
     FROM payments p
     JOIN clients c ON p.client_id = c.id
     LEFT JOIN units u ON p.unit_id = u.id
     WHERE p.id = $1`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Payment not found" });
  res.json(rows[0]);
};

export const createPayment = async (req, res) => {
  const { client_id, unit_id, amount, due_date } = req.body;
  const { rows } = await db.query(
    `INSERT INTO payments (client_id, unit_id, amount, due_date)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [client_id, unit_id || null, amount, due_date]
  );
  res.status(201).json(rows[0]);
};

export const updatePayment = async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ error: "No fields to update" });

  // Auto-calculate days_late and status when paid_date is set
  if (fields.paid_date) {
    fields.status = "paid";
    fields.days_late = 0;
  }

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = keys.map(k => fields[k]);

  const { rows } = await db.query(
    `UPDATE payments SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Payment not found" });
  res.json(rows[0]);
};
