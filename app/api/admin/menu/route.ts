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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    await verifyAdmin(request);

    const menuItems = await MenuItem.find({}).sort({ category: 1, name: 1 });

    return NextResponse.json({
      message: 'Menu items retrieved successfully',
      menuItems
    });

  } catch (error: any) {
    console.error('Get menu items error:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await verifyAdmin(request);

    const menuItemData = await request.json();

    // Validate required fields
    const { name, description, price, category, image } = menuItemData;
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create menu item
    const menuItem = await MenuItem.create(menuItemData);

    return NextResponse.json({
      message: 'Menu item created successfully',
      menuItem
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create menu item error:', error);
    
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