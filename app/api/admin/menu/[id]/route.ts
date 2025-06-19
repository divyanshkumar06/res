import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await verifyAdmin(request);

    const { id } = params;
    const updateData = await request.json();

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Menu item updated successfully',
      menuItem
    });

  } catch (error: any) {
    console.error('Update menu item error:', error);
    
    if (error.message.includes('token') || error.message.includes('Admin')) {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await verifyAdmin(request);

    const { id } = params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Menu item deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete menu item error:', error);
    
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