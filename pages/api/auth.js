import pool from '../../utils/mysql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action } = req.query;

    if (action === 'register') {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email and password are required' });
        return;
      }
      try {
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
          res.status(409).json({ error: 'User with this email or username already exists' });
          return;
        }
        const password_hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password_hash]);
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Failed to register user:', error);
        res.status(500).json({ error: 'Failed to register user' });
      }
    } else if (action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }
      try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
      } catch (error) {
        console.error('Failed to login user:', error);
        res.status(500).json({ error: 'Failed to login user' });
      }
    } else if (action === 'logout') {
      // For stateless JWT, logout can be handled client-side by deleting token
      res.status(200).json({ message: 'Logout successful' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
