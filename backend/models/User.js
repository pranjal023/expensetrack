const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
  static async create({ username, email, password }) {
    const [res] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?,?,?)',
      [username, email, password]
    );
    return res.insertId;
  }
  static async setPremium(id) {
    await pool.query('UPDATE users SET is_premium = TRUE WHERE id = ?', [id]);
  }
}
module.exports = User;
