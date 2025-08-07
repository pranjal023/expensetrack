const express = require('express');
const Order   = require('../models/Order');
const User    = require('../models/User');
const router  = express.Router();


router.post('/create-order', async (req,res) => {
  const orderId = await Order.create(req.session.userId, req.body.amount || 10);
  res.json({ success:true, orderId });
});


router.post('/update-status', async (req,res) => {
  const { orderId, paymentStatus } = req.body;
  if (!['SUCCESS','FAILED'].includes(paymentStatus))
    return res.status(400).json({ success:false });

  await Order.updateStatus(orderId, paymentStatus);
  if (paymentStatus === 'SUCCESS') {
    await User.setPremium(req.session.userId);
    req.session.isPremium = true;
  }
  res.json({ success:true, message: paymentStatus==='SUCCESS' ? 'Transaction successful' : 'TRANSACTION FAILED' });
});

module.exports = router;
