import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a booking date']
  },
  time: {
    type: String,
    required: [true, 'Please provide a booking time']
  },
  guests: {
    type: Number,
    required: [true, 'Please specify number of guests'],
    min: [1, 'At least 1 guest is required'],
    max: [12, 'Maximum 12 guests allowed']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  tableNumber: Number
}, {
  timestamps: true
});

// Prevent double bookings
bookingSchema.index({ date: 1, time: 1, tableNumber: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);