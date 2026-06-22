const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User'); // Model import kiya

// .env file se MONGO_URI uthane ke liye
dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Database se connect karein
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // 2. Check karein ki kahin pehle se toh admin nahi hai
    const adminExists = await User.findOne({ email: 'aditya@afterus.com' }); // <--- Aapka official email yahan dalein
    if (adminExists) {
      console.log('⚠️ Super Admin already exists in Database.');
      process.exit(); // Script band karein
    }

    // 3. Password set karein aur hash karein (SECURE)
    const rawPassword = 'AapkaStrongPassword123'; // <--- Ek strong password yahan set karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // 4. Naya Admin User Object banayein
    const adminUser = new User({
      name: 'Aditya (AfterUS)', // <--- Aapka Naam
      email: 'aditya@afterus.com', // <--- Aapka official email
      password: hashedPassword,
      role: 'superadmin', // <--- Yeh hamesha SuperAdmin rahega
    });

    // 5. Database mein save karein
    await adminUser.save();
    
    console.log('====================================');
    console.log('🎉🎉🎉 SUCCESS: First Super Admin Created! 🎉🎉🎉');
    console.log(`Email: aditya@afterus.com`);
    console.log(`Password: ${rawPassword} (Write this down!)`);
    console.log('====================================');

    process.exit(); // Script band karein

  } catch (error) {
    console.error('❌ Error seeding admin: ', error.message);
    process.exit(1); // Error ke sath band karein
  }
};

// Script ko run karein
seedAdmin();