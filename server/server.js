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

// Routes ko use karna
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes); // Naya API endpoint

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ AfterUS Global Database Connected Successfully'))
.catch((err) => console.log('❌ Database Connection Error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));