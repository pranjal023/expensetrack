require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes        = require('./routes/auth');
const expensesRoutes    = require('./routes/expenses');
const paymentRoutes     = require('./routes/payment');
const leaderboardRoutes = require('./routes/leaderboard');
const forgotPwRoutes    = require('./routes/forgot-password');
const resetPwRoutes     = require('./routes/reset-password');

const { ensureAuthenticated } = require('./middleware/auth');


const corsOptions = {
  origin: [
    'https://trackyourexpenz.netlify.app', 
    'http://127.0.0.1:5500',               
    'http://localhost:3000'                
  ],
  credentials: true
};
app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'expense_tracker_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ---- API Routes ----
app.use('/api/auth/forgot-password', forgotPwRoutes);
app.use('/api/auth/reset-password', resetPwRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/expenses', ensureAuthenticated, expensesRoutes);
app.use('/api/payment', ensureAuthenticated, paymentRoutes);
app.use('/api/leaderboard', ensureAuthenticated, leaderboardRoutes);


app.use(express.static(path.join(__dirname, '..', 'frontend')));


app.get('/', (req, res) => {
  res.send('✅ Expense Tracker backend is running on EC2');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
