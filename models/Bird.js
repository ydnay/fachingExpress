// models/Bird.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const birdSchema = new Schema({
  name: { type: String },
  color: { type: String },
  dob: { type: Date },
  catches: { type: String },
  keeper: { type : Schema.Types.ObjectId, ref: 'Users', required: true },
  profilePic: { type: String, default: '/images/pal-default-avatar.png' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird;