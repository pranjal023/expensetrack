
const express = require('express');
const bcrypt  = require('bcrypt');
const pool    = require('../config/database');

const router = express.Router();


router.post('/', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ success:false, message:'Token and new password required.' });

  try {
    const [rows] = await pool.query(
      'SELECT user_id, expires_at FROM password_resets WHERE token = ?', [token]
    );
    if (!rows.length) return res.status(400).json({ success:false, message:'Invalid or expired token.' });

    const { user_id, expires_at } = rows[0];
    if (new Date() > new Date(expires_at))
      return res.status(400).json({ success:false, message:'Token has expired.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, user_id]);
    await pool.query('DELETE FROM password_resets WHERE token = ?', [token]);

    res.json({ success:true, message:'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Server error resetting password.' });
  }
});

module.exports = router;
