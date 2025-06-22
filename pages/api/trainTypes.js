import pool from '../../utils/mysql.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM train_types');
      if (rows.length > 0) {
        // Convert logos JSON string to object
        const trainTypes = rows.map(row => ({
          id: row.id,
          typeName: row.typeName,
          logoUrl: row.logoUrl,
        }));
        res.status(200).json(trainTypes);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Failed to fetch train types:', error);
      res.status(500).json({ error: 'Failed to fetch train types' });
    }
  } else if (req.method === 'POST') {
    try {
      const trainTypes = req.body; // Expecting array of { typeName, logoUrl }
      if (!Array.isArray(trainTypes)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Clear existing train types
      await pool.query('DELETE FROM train_types');

      // Insert new train types
      for (const trainType of trainTypes) {
        await pool.query(
          'INSERT INTO train_types (typeName, logoUrl) VALUES (?, ?)',
          [trainType.typeName, trainType.logoUrl]
        );
      }

      res.status(200).json({ message: 'Train types updated successfully' });
    } catch (error) {
      console.error('Failed to update train types:', error);
      res.status(500).json({ error: 'Failed to update train types' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
