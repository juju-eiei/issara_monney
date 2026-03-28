const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const router = express.Router();

// Get customer by phone
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 5 },
        redemptions: { orderBy: { createdAt: 'desc' }, take: 5 }
      }
    });

    if (!customer) return res.status(404).json({ error: 'ไม่พบลูกค้า' });
    
    // Hide PIN hash from response
    const { pinHash, ...data } = customer;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Customer or Add Points
router.post('/', async (req, res) => {
  try {
    const { phone, name, pin, amount } = req.body;
    let customer = await prisma.customer.findUnique({ where: { phone } });

    // If new customer, validate PIN and Name
    if (!customer) {
      if (!pin || pin.length < 4) return res.status(400).json({ error: 'ต้องตั้งรหัส PIN อย่างน้อย 4 หลัก (แนะนำ 6 หลัก)' });
      
      const pinHash = await bcrypt.hash(pin, 10);
      customer = await prisma.customer.create({
        data: { phone, name, pinHash }
      });
    }

    // Add transaction if amount is provided
    if (amount && amount > 0) {
      // Calculate new totals
      const newTotalSpent = customer.totalItemsSpent + amount;
      
      // Calculate rewards (e.g. 20,000 = 1 reward)
      // Logic: we check how many new rewards are earned based on previous total and new total
      const SPEND_PER_REWARD = 20000;
      
      const oldRewardsEarned = Math.floor(customer.totalItemsSpent / SPEND_PER_REWARD);
      const newRewardsEarned = Math.floor(newTotalSpent / SPEND_PER_REWARD);
      const rewardsGained = newRewardsEarned - oldRewardsEarned;

      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            customerId: customer.id,
            amount,
            type: 'PURCHASE'
          }
        }),
        prisma.customer.update({
          where: { id: customer.id },
          data: {
            totalItemsSpent: newTotalSpent,
            rewardBalance: { increment: rewardsGained }
          }
        })
      ]);
    }

    res.json({ message: 'บันทึกสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redeem Rewards
router.post('/redeem', async (req, res) => {
  try {
    const { phone, rewardsToUse } = req.body;
    
    // In real app, verify admin token here
    
    const customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer) return res.status(404).json({ error: 'ไม่พบลูกค้า' });
    
    if (customer.rewardBalance < rewardsToUse) {
      return res.status(400).json({ error: 'สิทธิ์ไม่เพียงพอ' });
    }

    // 1 reward = 1000 cash
    const cashReceived = rewardsToUse * 1000;

    await prisma.$transaction([
      prisma.redemption.create({
        data: {
          customerId: customer.id,
          rewardsUsed: rewardsToUse,
          cashReceived: cashReceived
        }
      }),
      prisma.customer.update({
        where: { id: customer.id },
        data: {
          rewardBalance: { decrement: rewardsToUse }
        }
      })
    ]);

    res.json({ message: 'แลกสิทธิ์สำเร็จ', cashReceived });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
