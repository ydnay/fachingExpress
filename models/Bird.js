// models/Bird.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const birdSchema = new Schema({
  // name: {
    // first: { type: String, set: capitalizeFirstLetter, required: true },
    // last: { type: String, set: capitalizeFirstLetter, required: true }
  // },
  name: { type: String },
  color: [ { type: String } ],
  dob: { type: Date },
  captures: { type: Number },
  keeper: { type : Schema.Types.ObjectId, ref: 'Users', required:true },
  // email: { type: String, unique: true, required: true },
  // phone: String,
  profilePic: { type: String, default: "/images/pig-default-avatar.jpg" }
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Bird = mongoose.model("Bird", birdSchema);

module.exports = Bird;