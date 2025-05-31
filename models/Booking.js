const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  dateTime: { type: Date, required: true },
  description: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  status: { type: String, default: 'Pending' },
  otp: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
