const express = require('express');
const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');
const { appId, secretKey, environment, apiUrl, generateSignature } = require('../config/cashfree');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();


router.use(ensureAuthenticated);

router.post('/create-order', async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount) || 10;
    
    const orderId = await Order.create(req.session.userId, amount);

    
    const params = {
      appId,
      orderId: orderId.toString(),
      orderAmount: amount.toFixed(2),
      orderCurrency: 'INR',
      customerEmail: req.session.username, 
      customerPhone: '',                  
      returnUrl: `${process.env.FRONTEND_URL}/checkout-success.html`,
      notifyUrl: `${process.env.FRONTEND_URL}/api/payment/update-status`
    };
    
    const signature = generateSignature(params);
   
    const { data } = await axios.post(
      `${apiUrl}/api/v2/cftoken/order`,
      params,
      { headers: { 'x-client-id': appId, 'x-client-secret': secretKey } }
    );
    if (!data || !data.paymentLink) {
      throw new Error('Failed to obtain payment link from Cashfree');
    }

    res.json({ success: true, paymentLink: data.paymentLink });
  } catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({ success: false, message: 'Error creating payment order.' });
  }
});


router.post('/update-status', async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;
    if (!['SUCCESS', 'FAILED'].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await Order.updateStatus(orderId, paymentStatus);
    if (paymentStatus === 'SUCCESS') {
      await User.setPremium(req.session.userId);
      req.session.isPremium = true;
    }
    res.json({
      success: true,
      message: paymentStatus === 'SUCCESS' ? 'Transaction successful' : 'Transaction failed'
    });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ success: false, message: 'Error updating payment status.' });
  }
});

module.exports = router;
