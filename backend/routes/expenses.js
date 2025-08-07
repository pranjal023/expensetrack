const express = require('express');
const pool = require('../config/database'); 
const Expense = require('../models/Expense');
const router  = express.Router();

// GET /api/expenses?page=1&limit=10  — paginated fetching of expenses
router.get('/', async (req, res) => {
  const userId = req.session.userId;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // default 10 per page
  const offset = (page - 1) * limit;

  try {
    // Get total expense count for the user
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
      [userId]
    );

    //  expenses for the current page with limit and offset
    const [expenses] = await pool.query(
      'SELECT id, amount, category, description, expense_date FROM expenses WHERE user_id = ? ORDER BY expense_date DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    res.json({
      success: true,
      expenses,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ success: false, message: 'Error fetching expenses.' });
  }
});

// add new expense 
router.post('/', async (req, res) => {
  const { amount, category, description, expense_date } = req.body;
  try {
    await Expense.create(req.session.userId, amount, category, description || '', expense_date);
    res.json({ success: true, message: 'Expense added successfully.' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ success: false, message: 'Error adding expense.' });
  }
});

//  delete expense 
router.delete('/:id', async (req, res) => {
  try {
    await Expense.delete(req.params.id, req.session.userId);
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ success: false, message: 'Error deleting expense.' });
  }
});

module.exports = router;
