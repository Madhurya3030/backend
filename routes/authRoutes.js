const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

  // Signup Route
  router.post('/signup', async (req, res) => {
    try {
      const { name, email, password, phone, aadhar, bankAccount, fieldOfWork } = req.body;

      const existing = await Employee.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

      const newEmp = new Employee({ name, email, password, phone, aadhar, bankAccount, fieldOfWork });
      await newEmp.save();

      res.status(201).json({ success: true, message: 'Employee created successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  // Login Route
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const emp = await Employee.findOne({ email });
      if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

      if (emp.password !== password) return res.status(401).json({ success: false, message: 'Incorrect password' });

      res.json({ success: true, message: 'Login successful', name: emp.name });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

router.get('/employee', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const emp = await Employee.findOne({ email }, '-password -__v');
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

    res.json({ success: true, employee: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// New route to get employees by fieldOfWork
router.get('/employeesByField', async (req, res) => {
  try {
    const { fieldOfWork } = req.query;
    if (!fieldOfWork) return res.status(400).json({ success: false, message: 'fieldOfWork is required' });

    const employees = await Employee.find({ fieldOfWork }, '-password -__v');
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
