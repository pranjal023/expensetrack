
const express = require('express');
const crypto  = require('crypto');
const pool    = require('../config/database');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const router = express.Router();


router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  try {
    // -- find user
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.json({ success: true, message: 'If the email is registered, a reset link has been sent.' });
    }
    const userId = rows[0].id;

    
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);
    await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?,?,?)',
      [userId, token, expiresAt]
    );

    // configrue  Sendinblue
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const resetLink   = `http://localhost:3000/reset-password.html?token=${token}`;

    const emailObj = new SibApiV3Sdk.SendSmtpEmail({
      sender : { name: 'Expense Tracker', email: 'no-reply@expensetracker.com' },
      to     : [{ email }],
      subject: 'Password Reset',
      htmlContent:
        `<p>You requested a password reset.</p>
         <p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for one hour.</p>`
    });

    await apiInstance.sendTransacEmail(emailObj);
    res.json({ success: true, message: 'If the email is registered, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error sending reset link.' });
  }
});

module.exports = router;
