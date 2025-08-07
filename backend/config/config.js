
require('dotenv').config();

module.exports = {
  dbConfig: {
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USER || 'root',
    password : process.env.DB_PASSWORD || '',
    database : process.env.DB_NAME || 'expense_trackermain',
  },
  cashfreeConfig: {
    appId     : process.env.CASHFREE_APP_ID || 'TEST430329ae80e0f32e41a393d78b923034',
    secretKey : process.env.CASHFREE_SECRET_KEY || 'TESTaf195616268bd6202eeb3bf8dc458956e7192a85',
    env       : process.env.CASHFREE_ENV || 'sandbox',
  }
};
