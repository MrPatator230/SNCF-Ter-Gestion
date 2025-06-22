import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT name, logoUrl FROM train_types');
      const result = {};
      rows.forEach(row => {
        result[row.name] = row.logoUrl;
      });
      res.status(200).json(result);
    } catch (error) {
      console.error('Failed to fetch train type logos from DB:', error);
      res.status(500).json({ error: 'Failed to read train type logos data.' });
    }
  } else if (req.method === 'POST') {
    try {
      const newData = req.body; // object mapping name to logoUrl
      for (const [name, logoUrl] of Object.entries(newData)) {
        // Upsert train type
        const [rows] = await pool.query('SELECT id FROM train_types WHERE name = ?', [name]);
        if (rows.length === 0) {
          await pool.query('INSERT INTO train_types (name, logoUrl) VALUES (?, ?)', [name, logoUrl]);
        } else {
          const id = rows[0].id;
          await pool.query('UPDATE train_types SET logoUrl = ? WHERE id = ?', [logoUrl, id]);
        }
      }
      res.status(200).json({ message: 'Train type logos data updated successfully.' });
    } catch (error) {
      console.error('Failed to write train type logos data to DB:', error);
      res.status(500).json({ error: 'Failed to write train type logos data.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
