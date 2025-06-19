import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    // Get user's orders
    const orders = await Order.find({ customer: userId })
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      message: 'Orders retrieved successfully',
      orders
    });

  } catch (error: any) {
    console.error('Get user orders error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}