// models/User.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

function capitalizeFirstLetter(letter) {
  if (typeof letter !== 'string') letter = '';
  return letter.charAt(0).toUpperCase() + letter.substring(1);
}

const userSchema = new Schema({
  // name: {
    // first: { type: String, set: capitalizeFirstLetter, required: true },
    // last: { type: String, set: capitalizeFirstLetter, required: true }
  // },
  username: { type: String, unique: true, required : true },
  password: { type: String, required: true },
  // email: { type: String, unique: true, required: true },
  // phone: String,
  profilePic: { type: String, default: '/images/user-default-avatar.png' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;