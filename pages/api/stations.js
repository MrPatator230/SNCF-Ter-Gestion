import pool from '../../utils/mysql';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const [rows] = await pool.query('SELECT * FROM stations');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stations' });
      }
      break;

    case 'POST':
      try {
        const { name } = req.body;
        if (!name) {
          res.status(400).json({ error: 'Station name is required' });
          return;
        }
        const [result] = await pool.query('INSERT INTO stations (name, createdAt) VALUES (?, ?)', [name, new Date()]);
        res.status(201).json({ id: result.insertId, name, createdAt: new Date() });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add station' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
