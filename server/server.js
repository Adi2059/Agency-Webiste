const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Files Import karna
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AfterUS API is running perfectly on Render! 🚀');
});

// Routes ko use karna
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes); 

// 🔥 SUPER BRAHMASTRA: Force Reset All Users 🔥
app.get('/api/force-reset-users', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs'); 
    const User = require('./models/User'); 

    const hashedPassword = await bcrypt.hash('afterus123', 10);

    // 1. Admin reset (Aditya)
    await User.findOneAndUpdate(
      { email: 'aditya@afterus.com' }, 
      { name: 'Aditya Thakur', password: hashedPassword, role: 'superadmin' }, 
      { upsert: true }
    );

    // 2. Co-founder reset (Dilkhush)
    await User.findOneAndUpdate(
      { email: 'dilkhush@afterus.com' }, 
      { name: 'Dilkhush Tiwari', password: hashedPassword, role: 'co-founder' }, 
      { upsert: true }
    );

    // 3. Telecaller reset (Outreach Team)
    await User.findOneAndUpdate(
      { email: 'calling@afterus.com' }, 
      { name: 'Outreach Team', password: hashedPassword, role: 'telecaller' }, 
      { upsert: true }
    );

    res.send('🚀 BOOM! Teeno accounts force-reset ho gaye. Sabka password wapas "afterus123" ho gaya hai.');
  } catch (error) {
    res.status(500).send("Error aa gaya: " + error.message);
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ AfterUS Global Database Connected Successfully'))
.catch((err) => console.log('❌ Database Connection Error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));