const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Password encrypt karne ke liye
const Lead = require('../models/Lead');
const User = require('../models/User');
const { protect } = require('../middleware/auth'); 
const Document = require('../models/Document'); // Document Model Import
const multer = require('multer');
const path = require('path');
// 1. Status Update API (Calling Dashboard, Payments & Projects ke liye)
router.put('/update-status/:id', protect, async (req, res) => {
  try {
    const { status, meetingDate, meetingTime, totalDealValue, paymentReceived, projectPhase, projectProgress } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (meetingDate) updateData.meetingDate = meetingDate;
    if (meetingTime) updateData.meetingTime = meetingTime;
    
    if (totalDealValue !== undefined) updateData.totalDealValue = Number(totalDealValue);
    if (paymentReceived !== undefined) updateData.paymentReceived = Number(paymentReceived);
    
    // 🔥 Project Update Logic 🔥
    if (projectPhase) updateData.projectPhase = projectPhase;
    if (projectProgress !== undefined) updateData.projectProgress = Number(projectProgress);

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    await User.findByIdAndUpdate(req.user.id, { lastActivity: new Date() });
    
    res.json({ message: 'Updated successfully', lead });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// 2. Dashboard Stats API (Super Admin ke liye)
router.get('/dashboard-data', protect, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const meetingsSet = await Lead.countDocuments({ status: 'Scheduled' });
    const activeCallers = await User.countDocuments({ role: 'telecaller', isActive: true });
    
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name');

    const conversionRate = totalLeads > 0 ? ((meetingsSet / totalLeads) * 100).toFixed(1) + '%' : '0%';

    res.json({
      stats: { totalLeads, meetingsSet, activeCallers, conversionRate },
      recentLeads
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// 3. Add New Lead API (Website Form aur Admin Panel dono ke liye)
router.post('/add', async (req, res) => {
  try {
    const { clientName, phoneNumber, serviceNeeded } = req.body;
    
    const newLead = new Lead({
      clientName,
      phoneNumber,
      serviceNeeded,
      status: 'New' 
    });

    await newLead.save();
    res.status(201).json({ message: 'Lead generated successfully', lead: newLead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// 4. Calling Dashboard Leads API
router.get('/calling-leads', protect, async (req, res) => {
  try {
    const leads = await Lead.find({ status: { $in: ['New', 'FollowUp'] } }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching calling leads' });
  }
});


// ==========================================
// TEAM MANAGEMENT APIs
// ==========================================

// 1. Get All Team Members
router.get('/team', protect, async (req, res) => {
  try {
    const team = await User.find().select('-password'); 
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching team' });
  }
});

// 2. Add New Team Member
router.post('/team/add', protect, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    
    res.status(201).json({ message: 'Team member added successfully', user: newUser });
  } catch (error) {
    console.error("🔴 TEAM ADD ERROR:", error); // <-- YAHAN SE EXACT ERROR PATA CHALEGA
    res.status(500).json({ error: error.message || 'Error adding team member' });
  }
});
// Update Team Member (With Password Change Support)
router.put('/team/edit/:id', protect, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    let updateData = { name, email, role };

    // 🔥 Agar Super Admin ne naya password type kiya hai, toh use encrypt karke save karo
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Team member updated successfully', user: updatedUser });
  } catch (error) {
    console.error("EDIT TEAM ERROR:", error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});
// 5. Bulk Upload Leads API
router.post('/bulk-add', async (req, res) => {
  try {
    const { leads } = req.body; // Frontend se leads ki list aayegi
    
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty leads array' });
    }

    // Har lead ka status default 'New' set karna agar provided nahi hai
    const formattedLeads = leads.map(lead => ({
      clientName: lead.clientName,
      phoneNumber: lead.phoneNumber,
      serviceNeeded: lead.serviceNeeded || 'Web & App Development',
      status: 'New'
    }));

    // MongoDB ka insertMany ek sath poori list save karta hai
    await Lead.insertMany(formattedLeads);
    
    res.status(201).json({ message: `${formattedLeads.length} Leads imported successfully` });
  } catch (error) {
    console.error("🔴 BULK UPLOAD ERROR:", error);
    res.status(500).json({ error: 'Failed to bulk import leads' });
  }
});
// 6. Get All Leads API (Super Admin Pipeline ke liye)
router.get('/all', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).populate('assignedTo', 'name');
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching all leads' });
  }
});
// 7. Upload Company Document (Co-founder ke liye)
router.post('/docs/upload', protect, async (req, res) => {
  try {
    const { title, fileSize, downloadUrl } = req.body;
    
    const newDoc = new Document({
      title,
      fileSize: fileSize || '1.8 MB',
      uploadedBy: req.user.name,
      downloadUrl: downloadUrl || '#'
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded to Vault successfully', doc: newDoc });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// 8. Get All Documents (Super Admin aur Co-founder dono ke liye)
router.get('/docs/all', protect, async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});
// Multer Storage Configuration (Files ko server ke 'uploads' folder me save karne ke liye)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Server me 'uploads' naam ka folder hona chahiye
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename banana
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed!'), false);
    }
  }
});

// 7. REAL Upload Company Document API (Co-founder ke liye)
router.post('/docs/upload', protect, upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const { title } = req.body;
    
    // File size ko KB/MB me format karna
    const sizeInMb = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const newDoc = new Document({
      title: title || req.file.originalname,
      fileSize: sizeInMb,
      uploadedBy: req.user.name,
      // Download link me server ka path save hoga
      downloadUrl: `http://localhost:5000/uploads/${req.file.filename}` 
    });

    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded to Vault successfully', doc: newDoc });
  } catch (error) {
    console.error("🔴 UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message || 'Failed to upload document' });
  }
});
// 10. Delete/Remove Lead (Co-founder ledger ke liye)
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal removed from ledger successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});
module.exports = router;