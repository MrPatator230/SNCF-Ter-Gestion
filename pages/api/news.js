import pool from '../../utils/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM news ORDER BY published_at DESC');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content, author, published_at } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }
      await pool.query(
        'INSERT INTO news (title, content, author, published_at) VALUES (?, ?, ?, ?)',
        [title, content, author || null, published_at || new Date()]
      );
      res.status(201).json({ message: 'News item created successfully' });
    } catch (error) {
      console.error('Failed to create news item:', error);
      res.status(500).json({ error: 'Failed to create news item' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, content, author, published_at } = req.body;
      if (!id || !title || !content) {
        res.status(400).json({ error: 'ID, title and content are required' });
        return;
      }
      await pool.query(
        'UPDATE news SET title = ?, content = ?, author = ?, published_at = ? WHERE id = ?',
        [title, content, author || null, published_at || new Date(), id]
      );
      res.status(200).json({ message: 'News item updated successfully' });
    } catch (error) {
      console.error('Failed to update news item:', error);
      res.status(500).json({ error: 'Failed to update news item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await pool.query('DELETE FROM news WHERE id = ?', [id]);
      res.status(200).json({ message: 'News item deleted successfully' });
    } catch (error) {
      console.error('Failed to delete news item:', error);
      res.status(500).json({ error: 'Failed to delete news item' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
