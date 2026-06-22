const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceNeeded: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'FollowUp', 'Scheduled', 'Rejected', 'Invalid', 'Closed'], 
    default: 'New' 
  },
  meetingDate: { type: String },
  meetingTime: { type: String },
  
  totalDealValue: { type: Number, default: 0 },
  paymentReceived: { type: Number, default: 0 },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // 🔥 NAYE PROJECT MANAGEMENT FIELDS 🔥
  projectPhase: { type: String, default: 'Kickoff / Planning' },
  projectProgress: { type: Number, default: 10 }

}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);