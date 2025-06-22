import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { train_number } = req.query;
      let query = 'SELECT * FROM train_compositions';
      let params = [];
      if (train_number) {
        query += ' WHERE train_number = ?';
        params.push(train_number);
      }
      const [rows] = await pool.query(query, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch train compositions:', error);
      res.status(500).json({ error: 'Failed to fetch train compositions' });
    }
  } else if (req.method === 'POST') {
    try {
      const { train_number, composition } = req.body;
      if (!train_number || !composition) {
        res.status(400).json({ error: 'train_number and composition are required' });
        return;
      }
      await pool.query(
        'INSERT INTO train_compositions (train_number, composition) VALUES (?, ?)',
        [train_number, JSON.stringify(composition)]
      );
      res.status(201).json({ message: 'Train composition created successfully' });
    } catch (error) {
      console.error('Failed to create train composition:', error);
      res.status(500).json({ error: 'Failed to create train composition' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, train_number, composition } = req.body;
      if (!id || !train_number || !composition) {
        res.status(400).json({ error: 'id, train_number and composition are required' });
        return;
      }
      await pool.query(
        'UPDATE train_compositions SET train_number = ?, composition = ? WHERE id = ?',
        [train_number, JSON.stringify(composition), id]
      );
      res.status(200).json({ message: 'Train composition updated successfully' });
    } catch (error) {
      console.error('Failed to update train composition:', error);
      res.status(500).json({ error: 'Failed to update train composition' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM train_compositions WHERE id = ?', [id]);
      res.status(200).json({ message: 'Train composition deleted successfully' });
    } catch (error) {
      console.error('Failed to delete train composition:', error);
      res.status(500).json({ error: 'Failed to delete train composition' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
