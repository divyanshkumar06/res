import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization token required');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  
  const user = await User.findById(decoded.userId);
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    await verifyAdmin(request);

    const orders = await Order.find({})
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      message: 'Orders retrieved successfully',
      orders
    });

  } catch (error: any) {
    console.error('Get orders error:', error);
    
    if (error.message.includes('token') || error.message.includes('Admin')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}