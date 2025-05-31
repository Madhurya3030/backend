const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { userEmail, phone, address, city, pincode, dateTime, description, employeeId } = req.body;

    if (!userEmail || !phone || !address || !city || !pincode || !dateTime || !description || !employeeId) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newBooking = new Booking({
      userEmail,
      phone,
      address,
      city,
      pincode,
      dateTime: new Date(dateTime),
      description,
      employeeId,
      otp: generateOTP(),
    });

    await newBooking.save();

    res.status(201).json({ success: true, message: 'Booking created successfully', otp: newBooking.otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get bookings filtered by userEmail
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'userEmail query parameter is required' });
    }

    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get bookings for an employee by employeeId
router.get('/employee/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const bookings = await Booking.find({ employeeId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add this PATCH route to update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; // expected values: 'Accepted' or 'Rejected'

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




// New route to validate OTP for a booking
router.patch('/:id/validate-otp', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Optionally, mark booking as verified or confirmed after OTP validation
    booking.status = 'Confirmed';
    await booking.save();

    res.json({ success: true, message: 'OTP validated successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
