const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files from the React app
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Any other requests that don't match an API route get sent to React's index.html
app.use((req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const prisma = require('./prismaClient');

const seedAdmin = async () => {
  try {
    const count = await prisma.owner.count();
    if (count === 0) {
      console.log('No admin found. Seeding default admin...');
      const hash = await bcrypt.hash('admin123', 10);
      await prisma.owner.create({
        data: { username: 'admin', passwordHash: hash }
      });
      console.log('✅ Seeded default admin user (admin / admin123)');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
};

app.listen(PORT, '0.0.0.0', async () => {
  await seedAdmin();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 For mobile devices on your Wi-Fi, find your computer's IP address (e.g. 192.168.1.XX) and go to http://192.168.1.XX:${PORT}`);
});
