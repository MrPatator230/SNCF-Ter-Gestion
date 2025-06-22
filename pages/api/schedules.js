import pool from '../../utils/mysql';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const [rows] = await pool.query('SELECT * FROM schedules');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch schedules' });
      }
      break;

    case 'POST':
      try {
        const schedule = req.body;
        if (!schedule) {
          res.status(400).json({ error: 'Schedule data is required' });
          return;
        }
        // Insert schedule, assuming schedule object keys match table columns
        const keys = Object.keys(schedule);
        const values = Object.values(schedule);
        const placeholders = keys.map(() => '?').join(',');
        const sql = `INSERT INTO schedules (${keys.join(',')}) VALUES (${placeholders})`;
        const [result] = await pool.query(sql, values);
        res.status(201).json({ id: result.insertId, ...schedule });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add schedule' });
      }
      break;

    case 'PUT':
      try {
        const schedule = req.body;
        if (!schedule || !schedule.id) {
          res.status(400).json({ error: 'Schedule id and data are required' });
          return;
        }
        const id = schedule.id;
        delete schedule.id;
        const keys = Object.keys(schedule);
        const values = Object.values(schedule);
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE schedules SET ${setClause} WHERE id = ?`;
        await pool.query(sql, [...values, id]);
        res.status(200).json({ id, ...schedule });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update schedule' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          res.status(400).json({ error: 'Schedule id is required' });
          return;
        }
        await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete schedule' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
