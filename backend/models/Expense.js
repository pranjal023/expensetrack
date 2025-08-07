const pool = require('../config/database');

class Expense {
  static async allByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC',
      [userId]
    );
    return rows;
  }
  static async create(userId, amount, category, description, expenseDate) {
    await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, expense_date) VALUES (?,?,?,?,?)',
      [userId, amount, category, description, expenseDate]
    );
  }
  static async delete(id, userId) {
    await pool.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
  }
}
module.exports = Expense;
