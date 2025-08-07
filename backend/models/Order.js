const pool = require('../config/database');

class Order {
  static async create(userId, amount) {
    const [res] = await pool.query(
      'INSERT INTO orders (user_id, amount, status) VALUES (?,?,?)',
      [userId, amount, 'PENDING']
    );
    return res.insertId;
  }
  static async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  }
  static async find(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }
}
module.exports = Order;
