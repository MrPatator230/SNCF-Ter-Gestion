import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;
      let query = 'SELECT * FROM tickets';
      let params = [];
      if (user_id) {
        query += ' WHERE user_id = ?';
        params.push(user_id);
      }
      query += ' ORDER BY departure_time DESC';
      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        user_id,
        train_number,
        departure_station_id,
        arrival_station_id,
        departure_time,
        arrival_time,
        seat_number,
        price,
        status,
      } = req.body;
      if (!user_id || !train_number || !departure_station_id || !arrival_station_id || !departure_time || !arrival_time || !price || !status) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      await pool.query(
        `INSERT INTO tickets 
          (user_id, train_number, departure_station_id, arrival_station_id, departure_time, arrival_time, seat_number, price, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          train_number,
          departure_station_id,
          arrival_station_id,
          departure_time,
          arrival_time,
          seat_number || null,
          price,
          status,
        ]
      );
      res.status(201).json({ message: 'Ticket created successfully' });
    } catch (error) {
      console.error('Failed to create ticket:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        id,
        user_id,
        train_number,
        departure_station_id,
        arrival_station_id,
        departure_time,
        arrival_time,
        seat_number,
        price,
        status,
      } = req.body;
      if (!id || !user_id || !train_number || !departure_station_id || !arrival_station_id || !departure_time || !arrival_time || !price || !status) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      await pool.query(
        `UPDATE tickets SET 
          user_id = ?, 
          train_number = ?, 
          departure_station_id = ?, 
          arrival_station_id = ?, 
          departure_time = ?, 
          arrival_time = ?, 
          seat_number = ?, 
          price = ?, 
          status = ? 
          WHERE id = ?`,
        [
          user_id,
          train_number,
          departure_station_id,
          arrival_station_id,
          departure_time,
          arrival_time,
          seat_number || null,
          price,
          status,
          id,
        ]
      );
      res.status(200).json({ message: 'Ticket updated successfully' });
    } catch (error) {
      console.error('Failed to update ticket:', error);
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
      res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
