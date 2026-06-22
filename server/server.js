const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Files Import karna
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes'); // Naya import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('AfterUS API is running perfectly on Render! 🚀');
});
// Routes ko use karna
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes); // Naya API endpoint
// TEMPORARY ROUTE: Database me pehli baar users daalne ke liye
app.get('/api/create-default-users', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs'); // ya 'bcrypt', jo bhi aap use kar rahe ho
    const User = require('./models/User'); // Apne User model ka path check kar lena

    // Check karo ki admin pehle se toh nahi hai
    const adminExists = await User.findOne({ email: 'aditya@afterus.com' });
    if (adminExists) {
      return res.send('Users pehle se bane hue hain! Jaldi login karo.');
    }

    // Ek common password banate hain sabke liye
    const hashedPassword = await bcrypt.hash('afterus123', 10);

    // Teeno Accounts Create kar rahe hain
    await User.create([
      { 
        name: 'Aditya Thakur', 
        email: 'aditya@afterus.com', 
        password: hashedPassword, 
        role: 'admin' 
      },
      { 
        name: 'Dilkhush Tiwari', 
        email: 'dilkhush@afterus.com', 
        password: hashedPassword, 
        role: 'cofounder' 
      },
      { 
        name: 'Outreach Team', 
        email: 'calling@afterus.com', 
        password: hashedPassword, 
        role: 'telecaller' 
      }
    ]);

    res.send('Bhai Badhai Ho! Accounts ban gaye. Password sabka "afterus123" hai.');
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