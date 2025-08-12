const mysql = require('mysql2/promise');
const { dbConfig } = require('./config');

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  
  
  handleDisconnects: true,
  
  
  timezone: '+00:00',
  
 
  multipleStatements: false,
  
 
  charset: 'utf8mb4'
});


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to: ${dbConfig.host}:${dbConfig.port || 3306}/${dbConfig.database}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Database connection required for production. Please check your configuration.');
    }
  }
}


pool.on('connection', (connection) => {
  console.log(`🔗 New database connection established as id ${connection.threadId}`);
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Database connection lost, pool will reconnect...');
  }
});

testConnection();


process.on('SIGINT', async () => {
  console.log('🛑 Shutting down database pool...');
  await pool.end();
  process.exit(0);
});

module.exports = pool;
