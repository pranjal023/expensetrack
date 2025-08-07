require('dotenv').config();
const express = require('express');
const app  = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const authRoutes        = require('./routes/auth');
const expensesRoutes    = require('./routes/expenses');
const paymentRoutes     = require('./routes/payment');
const leaderboardRoutes = require('./routes/leaderboard');
const { ensureAuthenticated } = require('./middleware/auth');


const forgotPwRoutes = require('./routes/forgot-password');
const resetPwRoutes  = require('./routes/reset-password');



app.use(cors({
  origin: 'http://127.0.0.1:5500',    
  credentials: true                   
}))

/* ----------- middleware ----------- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'expense_tracker_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   
}));

/* ----------- api routes ----------- */
app.use('/api/auth/forgot-password', forgotPwRoutes);
app.use('/api/auth/reset-password',  resetPwRoutes);

app.use('/api/auth',        authRoutes);
app.use('/api/expenses',    ensureAuthenticated, expensesRoutes);
app.use('/api/payment',     ensureAuthenticated, paymentRoutes);
app.use('/api/leaderboard', ensureAuthenticated, leaderboardRoutes);

/* ----------- static frontend ----------- */
app.use(express.static(path.join(__dirname, '..', 'frontend')));

/* ----------- start ----------- */
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
