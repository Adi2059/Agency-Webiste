const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    // 👇 YAHAN HUMNE NAYE ROLES ADD KIYE HAIN ('admin', 'editor') 👇
    enum: ['superadmin', 'admin', 'telecaller', 'editor'], 
    default: 'telecaller' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);