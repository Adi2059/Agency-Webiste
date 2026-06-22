const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  uploadedBy: { type: String, required: true },
  fileSize: { type: String, default: '2.4 MB' },
  downloadUrl: { type: String, required: true }, // Yahan hum simulate/real url save karenge
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);