import db from "../db/index.js";

export const getAllProjects = async (req, res) => {
  const { rows } = await db.query(`
    SELECT p.*,
      COUNT(u.id) FILTER (WHERE u.status = 'leased') AS leased_units,
      COUNT(u.id) FILTER (WHERE u.status = 'vacant') AS vacant_units,
      SUM(u.rent)  FILTER (WHERE u.status = 'leased') AS monthly_revenue
    FROM projects p
    LEFT JOIN units u ON u.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
};

export const getProject = async (req, res) => {
  const { rows } = await db.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: "Project not found" });

  const { rows: units } = await db.query(
    "SELECT * FROM units WHERE project_id = $1 ORDER BY floor, unit_no",
    [req.params.id]
  );
  res.json({ ...rows[0], units });
};

export const createProject = async (req, res) => {
  const { name, type, city, address, floors, total_units, description, completion_year } = req.body;
  const { rows } = await db.query(
    `INSERT INTO projects (name, type, city, address, floors, total_units, description, completion_year)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [name, type, city, address, floors, total_units, description, completion_year || new Date().getFullYear()]
  );
  res.status(201).json(rows[0]);
};

export const updateProject = async (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);
  if (!keys.length) return res.status(400).json({ error: "No fields to update" });
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
  const values = keys.map(k => fields[k]);
  const { rows } = await db.query(
    `UPDATE projects SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Project not found" });
  res.json(rows[0]);
};

export const deleteProject = async (req, res) => {
  const { rowCount } = await db.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Project not found" });
  res.json({ success: true });
};