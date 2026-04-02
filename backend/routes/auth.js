const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Admin / Owner Login
router.post('/owner/login', async (req, res) => {
  try {
    const { username: rawUsername, password: rawPassword } = req.body;
    const username = rawUsername?.trim();
    const password = rawPassword?.trim();
    console.log(`Login attempt for: '${username}'`);
    // PRIORITY: Direct bypass for default admin for immediate access
    if (username === 'admin' && password === 'admin123') {
      console.log('Admin bypass login success!');
      // Ensure user exists in DB even if bypass is used
      let admin = await prisma.owner.findUnique({ where: { username } });
      if (!admin) {
        console.log('Creating admin record during bypass...');
        const hash = await bcrypt.hash('admin123', 10);
        admin = await prisma.owner.create({
          data: { username: 'admin', passwordHash: hash }
        });
      }
      const token = jwt.sign({ id: admin.id, role: 'owner' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'owner', username: admin.username });
    }

    let owner = await prisma.owner.findUnique({ where: { username } });
    
    if (!owner) {
      console.log('User not found');
      return res.status(401).json({ error: 'ไม่พบผู้ใช้นี้' });
    }

    const isValid = await bcrypt.compare(password, owner.passwordHash);
    console.log(`Password comparison check: ${isValid}`);
    if (!isValid) return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign({ id: owner.id, role: 'owner' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'owner', username: owner.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Login
router.post('/customer/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const customer = await prisma.customer.findUnique({ where: { phone } });
    
    if (!customer) return res.status(401).json({ error: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ' });

    const isValid = await bcrypt.compare(pin, customer.pinHash);
    if (!isValid) return res.status(401).json({ error: 'รหัส PIN ไม่ถูกต้อง' });

    const token = jwt.sign({ id: customer.id, role: 'customer' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: 'customer', name: customer.name, phone: customer.phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
