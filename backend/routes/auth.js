const express = require('express');
const bcrypt  = require('bcrypt');
const pool    = require('../config/database');
const router  = express.Router();

/* ---------- signup ---------- */ 
router.post('/signup', async (req,res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ success:false, message:'All fields required' });

  const [dup] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (dup.length) return res.status(400).json({ success:false, message:'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const [out] = await pool.query(
    'INSERT INTO users (username,email,password) VALUES (?,?,?)',
    [username, email, hash]
  );
  req.session.userId     = out.insertId;
  req.session.username   = username;
  req.session.isPremium  = false;
  res.json({ success:true });
});

/* ---------- login ---------- */
router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!users.length) return res.status(400).json({ success:false, message:'Invalid credentials' });

  const user = users[0];
  const ok   = await bcrypt.compare(password, user.password);
  if (!ok)   return res.status(400).json({ success:false, message:'Invalid credentials' });

  req.session.userId    = user.id;
  req.session.username  = user.username;
  req.session.isPremium = !!user.is_premium;
  res.json({ success:true });
});

/* ---------- logout ---------- */
router.post('/logout', (req,res) => {
  req.session.destroy(()=> res.json({ success:true }));
});

/* ---------- profile ---------- */
router.get('/profile', (req,res) => {
  if (!req.session.userId) return res.status(401).json({ success:false });
  res.json({
    success:true,
    user:{
      id        : req.session.userId,
      username  : req.session.username,
      isPremium : req.session.isPremium
    }
  });
});

module.exports = router;
