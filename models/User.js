const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
<<<<<<< HEAD
<<<<<<< HEAD
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String }
=======
>>>>>>> f48583d2789b1675fe8aa71e452ef9139f13f302
=======
>>>>>>> f48583d2789b1675fe8aa71e452ef9139f13f302
});

module.exports = mongoose.model('User', userSchema);
