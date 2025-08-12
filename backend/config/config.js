require('dotenv').config();

module.exports = {
  dbConfig: {
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USER || 'root',
    password : process.env.DB_PASSWORD || '',
    database : process.env.DB_NAME || 'expense_trackermain',
    // Add these for better production database handling
    port     : process.env.DB_PORT || 3306,
    ssl      : process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  },
  
  cashfreeConfig: {
    appId     : process.env.CASHFREE_APP_ID || 'TEST430329ae80e0f32e41a393d78b923034',
    secretKey : process.env.CASHFREE_SECRET_KEY || 'TESTaf195616268bd6202eeb3bf8dc458956e7192a85',
    environment : process.env.CASHFREE_ENV || 'sandbox', // Changed 'env' to 'environment' for clarity
    
    // Add API URLs based on environment
    get apiUrl() {
      return this.environment === 'production' 
        ? 'https://api.cashfree.com' 
        : 'https://sandbox.cashfree.com';
    }
  },
  
  // Add session configuration
  sessionConfig: {
    secret: process.env.SESSION_SECRET || 'expense_tracker_secret',
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    domain: process.env.NODE_ENV === 'production' ? '.your-domain.com' : undefined
  },
  
  // CORS configuration
  corsConfig: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://trackyourexpenz.netlify.app']
      : ['http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
  }
};
