import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, phone, date, time, guests, specialRequests } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate guest count
    const guestCount = parseInt(guests);
    if (guestCount < 1 || guestCount > 12) {
      return NextResponse.json(
        { message: 'Number of guests must be between 1 and 12' },
        { status: 400 }
      );
    }

    // Validate date (must be in the future)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { message: 'Booking date must be in the future' },
        { status: 400 }
      );
    }

    // Check for existing bookings at the same date and time
    const existingBooking = await Booking.findOne({
      date: bookingDate,
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: 'This time slot is already booked. Please choose a different time.' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      date: bookingDate,
      time: time,
      guests: guestCount,
      specialRequests: specialRequests?.trim() || '',
      status: 'pending'
    });

    // Send confirmation email (optional - implement based on your email service)
    try {
      await sendBookingConfirmation(booking);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        status: booking.status
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Booking creation error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}