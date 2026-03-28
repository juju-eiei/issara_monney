const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();
    
    const aggregation = await prisma.customer.aggregate({
      _sum: { totalItemsSpent: true }
    });
    
    const redemptions = await prisma.redemption.aggregate({
      _sum: { cashReceived: true, rewardsUsed: true }
    });

    res.json({
      totalCustomers,
      totalSales: aggregation._sum.totalItemsSpent || 0,
      totalRewardsRedeemed: redemptions._sum.rewardsUsed || 0,
      totalCashGiven: redemptions._sum.cashReceived || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
