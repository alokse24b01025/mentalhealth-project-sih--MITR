const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  // --- New Fields for Sanctuary Resiliency ---
  name: {
    type: String,
    default: "Anonymous Member"
  },
  bio: {
    type: String,
    default: "" // This stores the user's resiliency quote
  },
  location: {
    type: String,
    default: "" // This stores the user's city/region
  },
  imageUrl: {
    type: String,
    default: "" // Link to profile picture if provided
  },
  isSharingResiliency: {
    type: Boolean,
    default: false // Controlled by the Settings toggle
  },
  
  // NEW: Moderation Status
  // This prevents unverified stories from showing up automatically.
  resiliencyStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // ------------------------------------------------------
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);