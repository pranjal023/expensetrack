const express = require('express');
const pool    = require('../config/database');
const router  = express.Router();

router.get('/', async (req,res) => {
  if (!req.session.isPremium)
    return res.status(403).json({ success:false });

  const [rows] = await pool.query(`
      SELECT u.username,
             COALESCE(SUM(e.amount),0)  AS total_spent,
             COUNT(e.id)                AS total_expenses
        FROM users u
   LEFT JOIN expenses e ON u.id = e.user_id
       WHERE u.is_premium = TRUE
    GROUP BY u.id
    ORDER BY total_spent DESC
       LIMIT 5
  `);
  res.json({ success:true, leaderboard: rows });
});

module.exports = router;
