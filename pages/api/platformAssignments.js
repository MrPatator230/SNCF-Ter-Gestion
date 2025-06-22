import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { station_id } = req.query;
      let query = 'SELECT * FROM platform_assignments';
      let params = [];
      if (station_id) {
        query += ' WHERE station_id = ?';
        params.push(station_id);
      }
      query += ' ORDER BY assigned_at DESC';
      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch platform assignments:', error);
      res.status(500).json({ error: 'Failed to fetch platform assignments' });
    }
  } else if (req.method === 'POST') {
    try {
      const { station_id, platform, train_number } = req.body;
      if (!station_id || !platform || !train_number) {
        res.status(400).json({ error: 'station_id, platform and train_number are required' });
        return;
      }
      await pool.query(
        'INSERT INTO platform_assignments (station_id, platform, train_number) VALUES (?, ?, ?)',
        [station_id, platform, train_number]
      );
      res.status(201).json({ message: 'Platform assignment created successfully' });
    } catch (error) {
      console.error('Failed to create platform assignment:', error);
      res.status(500).json({ error: 'Failed to create platform assignment' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, station_id, platform, train_number } = req.body;
      if (!id || !station_id || !platform || !train_number) {
        res.status(400).json({ error: 'id, station_id, platform and train_number are required' });
        return;
      }
      await pool.query(
        'UPDATE platform_assignments SET station_id = ?, platform = ?, train_number = ? WHERE id = ?',
        [station_id, platform, train_number, id]
      );
      res.status(200).json({ message: 'Platform assignment updated successfully' });
    } catch (error) {
      console.error('Failed to update platform assignment:', error);
      res.status(500).json({ error: 'Failed to update platform assignment' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM platform_assignments WHERE id = ?', [id]);
      res.status(200).json({ message: 'Platform assignment deleted successfully' });
    } catch (error) {
      console.error('Failed to delete platform assignment:', error);
      res.status(500).json({ error: 'Failed to delete platform assignment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
