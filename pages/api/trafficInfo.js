import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM traffic_info ORDER BY reported_at DESC');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch traffic info:', error);
      res.status(500).json({ error: 'Failed to fetch traffic info' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, region, reported_at } = req.body;
      if (!title || !description) {
        res.status(400).json({ error: 'Title and description are required' });
        return;
      }
      await pool.query(
        'INSERT INTO traffic_info (title, description, region, reported_at) VALUES (?, ?, ?, ?)',
        [title, description, region || null, reported_at || new Date()]
      );
      res.status(201).json({ message: 'Traffic info created successfully' });
    } catch (error) {
      console.error('Failed to create traffic info:', error);
      res.status(500).json({ error: 'Failed to create traffic info' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, description, region, reported_at } = req.body;
      if (!id || !title || !description) {
        res.status(400).json({ error: 'ID, title and description are required' });
        return;
      }
      await pool.query(
        'UPDATE traffic_info SET title = ?, description = ?, region = ?, reported_at = ? WHERE id = ?',
        [title, description, region || null, reported_at || new Date(), id]
      );
      res.status(200).json({ message: 'Traffic info updated successfully' });
    } catch (error) {
      console.error('Failed to update traffic info:', error);
      res.status(500).json({ error: 'Failed to update traffic info' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM traffic_info WHERE id = ?', [id]);
      res.status(200).json({ message: 'Traffic info deleted successfully' });
    } catch (error) {
      console.error('Failed to delete traffic info:', error);
      res.status(500).json({ error: 'Failed to delete traffic info' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
