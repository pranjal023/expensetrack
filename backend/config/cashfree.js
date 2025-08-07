const crypto = require('crypto');
const { cashfreeConfig } = require('./config');

function generateSignature(params) {
  const data = Object.keys(params).sort().map(k => k + params[k]).join('');
  return crypto.createHmac('sha256', cashfreeConfig.secretKey)
               .update(data).digest('hex');
}

module.exports = { ...cashfreeConfig, generateSignature };
