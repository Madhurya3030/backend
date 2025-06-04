const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  aadhar: String,
  bankAccount: String,
  fieldOfWork: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
