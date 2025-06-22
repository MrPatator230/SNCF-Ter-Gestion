import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'admin',
  password: process.env.MYSQL_PASSWORD || 'Mrpatator290406-',
  database: process.env.MYSQL_DATABASE || 'SNCF_ter_gestion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
