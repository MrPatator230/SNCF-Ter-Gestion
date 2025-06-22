import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM stations ORDER BY name ASC');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      res.status(500).json({ error: 'Failed to fetch stations' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, code, city, region } = req.body;
      if (!name || !code) {
        res.status(400).json({ error: 'Name and code are required' });
        return;
      }
      await pool.query(
        'INSERT INTO stations (name, code, city, region) VALUES (?, ?, ?, ?)',
        [name, code, city || null, region || null]
      );
      res.status(201).json({ message: 'Station created successfully' });
    } catch (error) {
      console.error('Failed to create station:', error);
      res.status(500).json({ error: 'Failed to create station' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, code, city, region } = req.body;
      if (!id || !name || !code) {
        res.status(400).json({ error: 'ID, name and code are required' });
        return;
      }
      await pool.query(
        'UPDATE stations SET name = ?, code = ?, city = ?, region = ? WHERE id = ?',
        [name, code, city || null, region || null, id]
      );
      res.status(200).json({ message: 'Station updated successfully' });
    } catch (error) {
      console.error('Failed to update station:', error);
      res.status(500).json({ error: 'Failed to update station' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM stations WHERE id = ?', [id]);
      res.status(200).json({ message: 'Station deleted successfully' });
    } catch (error) {
      console.error('Failed to delete station:', error);
      res.status(500).json({ error: 'Failed to delete station' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
