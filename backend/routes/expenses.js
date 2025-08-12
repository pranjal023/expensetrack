const express = require('express');
const pool = require('../config/database');
const Expense = require('../models/Expense');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();


router.use(ensureAuthenticated);


router.get('/', async (req, res) => {
  const userId = req.session.userId;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // Total count
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM expenses WHERE user_id = ?',
      [userId]
    );

    // Page data
    const [expenses] = await pool.query(
      `SELECT id, amount, category, description, expense_date
       FROM expenses
       WHERE user_id = ?
       ORDER BY expense_date DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    res.json({
      success: true,
      expenses,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ success: false, message: 'Error fetching expenses.' });
  }
});


router.post('/', async (req, res) => {
  const { amount, category, description = '', expense_date } = req.body;
  const userId = req.session.userId;

  if (!amount || !category || !expense_date) {
    return res.status(400).json({ success: false, message: 'Amount, category, and date are required.' });
  }

  try {
    await Expense.create(userId, amount, category, description, expense_date);
    res.json({ success: true, message: 'Expense added successfully.' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ success: false, message: 'Error adding expense.' });
  }
});


router.delete('/:id', async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.session.userId;

  try {
    const deleted = await Expense.delete(expenseId, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Expense not found or not authorized.' });
    }
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ success: false, message: 'Error deleting expense.' });
  }
});

module.exports = router;
