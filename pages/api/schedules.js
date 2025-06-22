import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { station_id } = req.query;
      let query = 'SELECT * FROM schedules';
      let params = [];
      if (station_id) {
        query += ' WHERE station_id = ?';
        params.push(station_id);
      }
      query += ' ORDER BY arrival_time ASC';
      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  } else if (req.method === 'POST') {
    try {
      const { station_id, train_number, arrival_time, departure_time, platform, destination } = req.body;
      if (!station_id || !train_number) {
        res.status(400).json({ error: 'station_id and train_number are required' });
        return;
      }
      await pool.query(
        'INSERT INTO schedules (station_id, train_number, arrival_time, departure_time, platform, destination) VALUES (?, ?, ?, ?, ?, ?)',
        [station_id, train_number, arrival_time || null, departure_time || null, platform || null, destination || null]
      );
      res.status(201).json({ message: 'Schedule created successfully' });
    } catch (error) {
      console.error('Failed to create schedule:', error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, station_id, train_number, arrival_time, departure_time, platform, destination } = req.body;
      if (!id || !station_id || !train_number) {
        res.status(400).json({ error: 'id, station_id and train_number are required' });
        return;
      }
      await pool.query(
        'UPDATE schedules SET station_id = ?, train_number = ?, arrival_time = ?, departure_time = ?, platform = ?, destination = ? WHERE id = ?',
        [station_id, train_number, arrival_time || null, departure_time || null, platform || null, destination || null, id]
      );
      res.status(200).json({ message: 'Schedule updated successfully' });
    } catch (error) {
      console.error('Failed to update schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
      res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
